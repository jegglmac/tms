begin;

create table public.load_assignments (
  company_id uuid not null,
  load_id uuid not null,
  driver_id uuid,
  vehicle_id uuid,
  updated_by uuid not null,
  updated_at timestamptz not null default now(),
  primary key (company_id, load_id),
  foreign key (company_id, load_id) references public.loads(company_id, id),
  foreign key (company_id, driver_id) references public.drivers(company_id, id),
  foreign key (company_id, vehicle_id) references public.vehicles(company_id, id),
  foreign key (company_id, updated_by) references public.memberships(company_id, user_id)
);
create unique index assignment_driver_reservation on public.load_assignments(company_id, driver_id) where driver_id is not null;
create unique index assignment_vehicle_reservation on public.load_assignments(company_id, vehicle_id) where vehicle_id is not null;

alter table public.audit_logs drop constraint audit_logs_action_check;
alter table public.audit_logs add constraint audit_logs_action_check check (action in ('create', 'edit', 'ready', 'assignment'));

create table public.load_assignment_events (
  company_id uuid not null,
  load_id uuid not null,
  version integer not null check (version > 0),
  actor_id uuid not null,
  request_id uuid not null,
  previous_driver_id uuid,
  driver_id uuid,
  previous_vehicle_id uuid,
  vehicle_id uuid,
  recorded_at timestamptz not null default now(),
  primary key (company_id, load_id, version),
  foreign key (company_id, load_id, version) references public.audit_logs(company_id, load_id, version),
  foreign key (company_id, actor_id) references public.memberships(company_id, user_id),
  foreign key (company_id, previous_driver_id) references public.drivers(company_id, id),
  foreign key (company_id, driver_id) references public.drivers(company_id, id),
  foreign key (company_id, previous_vehicle_id) references public.vehicles(company_id, id),
  foreign key (company_id, vehicle_id) references public.vehicles(company_id, id),
  check (previous_driver_id is distinct from driver_id or previous_vehicle_id is distinct from vehicle_id)
);

-- A separate receipt namespace avoids collisions with accepted load commands.
create table public.assignment_requests (
  company_id uuid not null,
  actor_id uuid not null,
  request_id uuid not null,
  request_hash text not null,
  load_id uuid not null,
  version integer not null check (version > 0),
  changed boolean not null,
  primary key (company_id, actor_id, request_id),
  foreign key (company_id, load_id) references public.loads(company_id, id),
  foreign key (company_id, actor_id) references public.memberships(company_id, user_id)
);
alter table public.load_assignments enable row level security;
alter table public.load_assignment_events enable row level security;
alter table public.assignment_requests enable row level security;
revoke all on public.load_assignments, public.load_assignment_events, public.assignment_requests from public, anon, authenticated;
grant select on public.load_assignments, public.load_assignment_events to authenticated;
grant select, insert, update on public.load_assignments to tms_dispatch_executor;
grant insert on public.load_assignment_events to tms_dispatch_executor;
grant select, insert on public.assignment_requests to tms_dispatch_executor;
grant select on public.load_assignments to tms_roster_executor;
grant select on public.drivers, public.vehicles to tms_dispatch_executor;
create policy assignment_driver_read on public.drivers for select to tms_dispatch_executor using (public.tms_can_dispatch(company_id));
create policy assignment_vehicle_read on public.vehicles for select to tms_dispatch_executor using (public.tms_can_dispatch(company_id));
create policy assignments_read on public.load_assignments for select to authenticated, tms_dispatch_executor, tms_roster_executor using (public.tms_can_dispatch(company_id));
create policy assignments_insert on public.load_assignments for insert to tms_dispatch_executor
  with check (public.tms_can_dispatch(company_id) and updated_by = public.tms_request_user_id());
create policy assignments_update on public.load_assignments for update to tms_dispatch_executor
  using (public.tms_can_dispatch(company_id)) with check (public.tms_can_dispatch(company_id) and updated_by = public.tms_request_user_id());
create policy assignment_events_read on public.load_assignment_events for select to authenticated using (public.tms_can_dispatch(company_id));
create policy assignment_events_insert on public.load_assignment_events for insert to tms_dispatch_executor
  with check (public.tms_can_dispatch(company_id) and actor_id = public.tms_request_user_id());
create policy assignment_requests_read on public.assignment_requests for select to tms_dispatch_executor
  using (public.tms_can_dispatch(company_id) and actor_id = public.tms_request_user_id());
create policy assignment_requests_insert on public.assignment_requests for insert to tms_dispatch_executor
  with check (public.tms_can_dispatch(company_id) and actor_id = public.tms_request_user_id());

create function public.tms_set_load_assignment(
  p_company uuid, p_load uuid, p_version integer, p_request uuid, p_driver uuid, p_vehicle uuid
) returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  actor uuid := public.tms_request_user_id();
  current_version integer;
  current_status text;
  old_driver uuid;
  old_vehicle uuid;
  command_hash text;
  receipt public.assignment_requests%rowtype;
  changed boolean;
begin
  if actor is null or not public.tms_can_dispatch(p_company) then
    raise exception using errcode = '42501', message = 'Assignment access denied';
  end if;
  if p_load is null or p_request is null or coalesce(p_version, 0) < 1 then
    raise exception using errcode = '22023', message = 'Invalid assignment command';
  end if;
  -- Two-int advisory namespace is distinct from the accepted load RPC's bigint
  -- request locks. All assignment/roster commands acquire this BEFORE row locks.
  perform pg_advisory_xact_lock(20261114, hashtext(p_company::text));
  if not public.tms_can_dispatch(p_company) then
    raise exception using errcode = '42501', message = 'Assignment access denied';
  end if;
  command_hash := encode(sha256(convert_to(jsonb_build_array(p_load, p_version, p_driver, p_vehicle)::text, 'UTF8')), 'hex');
  select * into receipt from public.assignment_requests
    where company_id = p_company and actor_id = actor and request_id = p_request;
  if found then
    if receipt.request_hash <> command_hash then
      raise exception using errcode = '23505', message = 'Request already used with different data';
    end if;
    -- Authorization was revalidated before accessing or returning the receipt.
    return jsonb_build_object('load_id', receipt.load_id, 'version', receipt.version, 'changed', receipt.changed);
  end if;
  select version, status into current_version, current_status from public.loads
    where company_id = p_company and id = p_load for update;
  if not found or current_version <> p_version then
    raise exception using errcode = '40001', message = 'Load unavailable or changed';
  end if;
  if current_status not in ('draft', 'ready') then
    raise exception using errcode = '22023', message = 'Assignment changes unavailable for this status';
  end if;
  if p_driver is not null and not exists (select 1 from public.drivers where company_id = p_company and id = p_driver and active) then
    raise exception using errcode = '22023', message = 'Driver unavailable';
  end if;
  if p_vehicle is not null and not exists (select 1 from public.vehicles where company_id = p_company and id = p_vehicle and active and operating_status = 'in_service') then
    raise exception using errcode = '22023', message = 'Vehicle unavailable';
  end if;
  select driver_id, vehicle_id into old_driver, old_vehicle from public.load_assignments
    where company_id = p_company and load_id = p_load;
  changed := old_driver is distinct from p_driver or old_vehicle is distinct from p_vehicle;
  if changed then
    insert into public.load_assignments(company_id, load_id, driver_id, vehicle_id, updated_by)
      values(p_company, p_load, p_driver, p_vehicle, actor)
      on conflict (company_id, load_id) do update set driver_id = excluded.driver_id,
        vehicle_id = excluded.vehicle_id, updated_by = actor, updated_at = now();
    update public.loads set version = version + 1, updated_at = now()
      where company_id = p_company and id = p_load returning version into current_version;
    insert into public.audit_logs(company_id, load_id, version, actor_id, action, request_id)
      values(p_company, p_load, current_version, actor, 'assignment', p_request);
    insert into public.load_assignment_events(company_id, load_id, version, actor_id, request_id,
      previous_driver_id, driver_id, previous_vehicle_id, vehicle_id)
      values(p_company, p_load, current_version, actor, p_request, old_driver, p_driver, old_vehicle, p_vehicle);
  end if;
  -- Unchanged submissions record only a receipt: no version bump or audit event.
  insert into public.assignment_requests(company_id, actor_id, request_id, request_hash, load_id, version, changed)
    values(p_company, actor, p_request, command_hash, p_load, current_version, changed);
  return jsonb_build_object('load_id', p_load, 'version', current_version, 'changed', changed);
end;
$$;
revoke all on function public.tms_set_load_assignment(uuid, uuid, integer, uuid, uuid, uuid) from public, anon, authenticated;
grant execute on function public.tms_set_load_assignment(uuid, uuid, integer, uuid, uuid, uuid) to authenticated;
grant tms_dispatch_executor to current_user with set true;
grant create on schema public to tms_dispatch_executor;
alter function public.tms_set_load_assignment(uuid, uuid, integer, uuid, uuid, uuid) owner to tms_dispatch_executor;
revoke create on schema public from tms_dispatch_executor;
revoke set option for tms_dispatch_executor from current_user;

-- Preserve the accepted implementation as an executor-only delegate. No client
-- can bypass the new guard by invoking the old implementation directly.
alter function public.tms_save_roster(uuid, text, text, uuid, integer, jsonb) rename to tms_save_roster_unreserved;
revoke all on function public.tms_save_roster_unreserved(uuid, text, text, uuid, integer, jsonb) from public, anon, authenticated;
create function public.tms_save_roster(
  p_company uuid, p_kind text, p_action text, p_id uuid, p_version integer, p_data jsonb
) returns uuid language plpgsql security definer set search_path = ''
as $$
begin
  if public.tms_request_user_id() is null or not public.tms_can_dispatch(p_company) then
    raise exception using errcode = '42501', message = 'Roster access denied';
  end if;
  perform pg_advisory_xact_lock(20261114, hashtext(p_company::text));
  if not public.tms_can_dispatch(p_company) then
    raise exception using errcode = '42501', message = 'Roster access denied';
  end if;
  if (p_action = 'deactivate' or (p_kind = 'vehicles' and p_action = 'edit'
      and (p_data->>'operating_status') is distinct from 'in_service'))
    and exists (select 1 from public.load_assignments where company_id = p_company
      and ((p_kind = 'drivers' and driver_id = p_id) or (p_kind = 'vehicles' and vehicle_id = p_id))) then
    raise exception using errcode = '23514', message = 'Unassign or reassign the resource before making it unavailable';
  end if;
  return public.tms_save_roster_unreserved(p_company, p_kind, p_action, p_id, p_version, p_data);
end;
$$;
revoke all on function public.tms_save_roster(uuid, text, text, uuid, integer, jsonb) from public, anon, authenticated;
grant execute on function public.tms_save_roster(uuid, text, text, uuid, integer, jsonb) to authenticated;
grant tms_roster_executor to current_user with set true;
grant create on schema public to tms_roster_executor;
alter function public.tms_save_roster(uuid, text, text, uuid, integer, jsonb) owner to tms_roster_executor;
revoke create on schema public from tms_roster_executor;
revoke set option for tms_roster_executor from current_user;
notify pgrst, 'reload schema';
commit;
