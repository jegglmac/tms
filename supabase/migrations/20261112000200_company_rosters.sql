begin;

create role tms_roster_executor nologin nobypassrls;
grant usage on schema public to tms_roster_executor;
grant select on public.companies, public.users, public.memberships to tms_roster_executor;
grant execute on function public.tms_request_user_id(), public.tms_can_dispatch(uuid) to tms_roster_executor;

-- Existing policies explicitly name their applicable roles. Give the roster
-- executor the same restricted identity reads without altering Batch 1 policies.
create policy roster_own_profile on public.users for select to tms_roster_executor
  using (id = (select public.tms_request_user_id()) and disabled_at is null);
create policy roster_own_memberships on public.memberships for select to tms_roster_executor
  using (user_id = (select public.tms_request_user_id()) and revoked_at is null
    and exists (select 1 from public.users u where u.id = user_id));
create policy roster_company_members on public.companies for select to tms_roster_executor
  using (active and exists (select 1 from public.memberships m where m.company_id = id));

create table public.drivers (
  display_name text not null check (char_length(btrim(display_name)) between 1 and 120),
  work_email text check (char_length(work_email) <= 254 and work_email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  work_phone text check (char_length(work_phone) between 3 and 40 and work_phone ~ '^[0-9+(). xX-]+$' and work_phone ~ '[0-9]'),
  relationship text check (relationship in ('employee', 'contractor')),
  company_id uuid not null references public.companies(id),
  id uuid not null,
  active boolean not null default true,
  version integer not null default 1 check (version > 0),
  created_by uuid not null,
  updated_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (company_id, id),
  foreign key (company_id, created_by) references public.memberships(company_id, user_id),
  foreign key (company_id, updated_by) references public.memberships(company_id, user_id)
);
create index drivers_roster_order on public.drivers(company_id, active, display_name, id);
create index drivers_roster_all on public.drivers(company_id, display_name, id);

create table public.vehicles (
  unit_number text not null check (unit_number ~ '^[A-Z0-9][A-Z0-9._ -]{0,39}$'),
  equipment_type text not null check (equipment_type in ('box_truck', 'cargo_van', 'straight_truck', 'tractor_trailer')),
  operating_status text not null check (operating_status in ('in_service', 'maintenance', 'out_of_service')),
  make text check (char_length(make) between 1 and 80),
  model text check (char_length(model) between 1 and 80),
  model_year integer check (model_year between 1900 and 2100),
  unique (company_id, unit_number),
  company_id uuid not null references public.companies(id),
  id uuid not null,
  active boolean not null default true,
  version integer not null default 1 check (version > 0),
  created_by uuid not null,
  updated_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (company_id, id),
  foreign key (company_id, created_by) references public.memberships(company_id, user_id),
  foreign key (company_id, updated_by) references public.memberships(company_id, user_id)
);
create index vehicles_roster_order on public.vehicles(company_id, active, unit_number, id);
create index vehicles_roster_all on public.vehicles(company_id, unit_number, id);

create table public.roster_events (
  company_id uuid not null,
  id uuid not null default gen_random_uuid(),
  driver_id uuid,
  vehicle_id uuid,
  actor_id uuid not null,
  action text not null check (action in ('create', 'edit', 'activate', 'deactivate')),
  version integer not null check (version > 0),
  recorded_at timestamptz not null default now(),
  primary key (company_id, id),
  check ((driver_id is null) <> (vehicle_id is null)),
  foreign key (company_id, driver_id) references public.drivers(company_id, id),
  foreign key (company_id, vehicle_id) references public.vehicles(company_id, id),
  foreign key (company_id, actor_id) references public.memberships(company_id, user_id)
);
create index roster_events_driver on public.roster_events(company_id, driver_id, version);
create index roster_events_vehicle on public.roster_events(company_id, vehicle_id, version);

alter table public.drivers enable row level security;
alter table public.vehicles enable row level security;
alter table public.roster_events enable row level security;
revoke all on public.drivers, public.vehicles, public.roster_events from public, anon, authenticated;
grant select on public.drivers, public.vehicles, public.roster_events to authenticated;
grant insert on public.roster_events to tms_roster_executor;

grant select, insert on public.drivers to tms_roster_executor;
grant update (display_name, work_email, work_phone, relationship, active, version, updated_by, updated_at)
  on public.drivers to tms_roster_executor;
create policy drivers_read on public.drivers for select to authenticated, tms_roster_executor
  using (public.tms_can_dispatch(company_id));
create policy drivers_insert on public.drivers for insert to tms_roster_executor
  with check (public.tms_can_dispatch(company_id)
    and created_by = public.tms_request_user_id() and updated_by = public.tms_request_user_id());
create policy drivers_update on public.drivers for update to tms_roster_executor
  using (public.tms_can_dispatch(company_id))
  with check (public.tms_can_dispatch(company_id) and updated_by = public.tms_request_user_id());

grant select, insert on public.vehicles to tms_roster_executor;
grant update (unit_number, equipment_type, operating_status, make, model, model_year, active, version, updated_by, updated_at)
  on public.vehicles to tms_roster_executor;
create policy vehicles_read on public.vehicles for select to authenticated, tms_roster_executor
  using (public.tms_can_dispatch(company_id));
create policy vehicles_insert on public.vehicles for insert to tms_roster_executor
  with check (public.tms_can_dispatch(company_id)
    and created_by = public.tms_request_user_id() and updated_by = public.tms_request_user_id());
create policy vehicles_update on public.vehicles for update to tms_roster_executor
  using (public.tms_can_dispatch(company_id))
  with check (public.tms_can_dispatch(company_id) and updated_by = public.tms_request_user_id());

create policy roster_events_read on public.roster_events for select to authenticated
  using (public.tms_can_dispatch(company_id));
create policy roster_events_insert on public.roster_events for insert to tms_roster_executor
  with check (public.tms_can_dispatch(company_id) and actor_id = public.tms_request_user_id());

create function public.tms_save_roster(
  p_company uuid, p_kind text, p_action text, p_id uuid, p_version integer, p_data jsonb
) returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  actor uuid := public.tms_request_user_id();
  new_version integer;
  field_name text;
begin
  if actor is null or not public.tms_can_dispatch(p_company) then
    raise exception using errcode = '42501', message = 'Roster access denied';
  end if;
  if p_kind is null or p_kind not in ('drivers', 'vehicles') or p_id is null
    or p_action is null or p_action not in ('create', 'edit', 'activate', 'deactivate')
    or (p_action = 'create' and p_version is not null)
    or (p_action <> 'create' and coalesce(p_version, 0) < 1) then
    raise exception using errcode = '22023', message = 'Invalid roster command';
  end if;
  if p_action in ('create', 'edit') then
    if jsonb_typeof(p_data) is distinct from 'object' or octet_length(p_data::text) > 4096 then
      raise exception using errcode = '22023', message = 'Invalid roster details';
    end if;
    for field_name in select jsonb_object_keys(p_data) loop
      if jsonb_typeof(p_data->field_name) is distinct from 'string'
        or (p_kind = 'drivers' and field_name not in ('display_name', 'work_email', 'work_phone', 'relationship'))
        or (p_kind = 'vehicles' and field_name not in ('unit_number', 'equipment_type', 'operating_status', 'make', 'model', 'model_year')) then
        raise exception using errcode = '22023', message = 'Invalid roster field';
      end if;
    end loop;
  elsif p_data is not null then
    raise exception using errcode = '22023', message = 'Invalid activation command';
  end if;

  if p_kind = 'drivers' then
    if p_action = 'create' then
      insert into public.drivers(company_id, id, created_by, updated_by, display_name, work_email, work_phone, relationship)
        values(p_company, p_id, actor, actor, btrim(p_data->>'display_name'), nullif(btrim(p_data->>'work_email'), ''), nullif(btrim(p_data->>'work_phone'), ''), nullif(p_data->>'relationship', ''))
        returning version into new_version;
    elsif p_action = 'edit' then
      update public.drivers set display_name = btrim(p_data->>'display_name'),
        work_email = nullif(btrim(p_data->>'work_email'), ''),
        work_phone = nullif(btrim(p_data->>'work_phone'), ''),
        relationship = nullif(p_data->>'relationship', ''),
        version = version + 1, updated_by = actor, updated_at = now()
        where company_id = p_company and id = p_id and version = p_version
        returning version into new_version;
    else
      update public.drivers set active = (p_action = 'activate'),
        version = version + 1, updated_by = actor, updated_at = now()
        where company_id = p_company and id = p_id and version = p_version
          and active <> (p_action = 'activate')
        returning version into new_version;
    end if;
  else
    if p_action = 'create' then
      insert into public.vehicles(company_id, id, created_by, updated_by, unit_number, equipment_type, operating_status, make, model, model_year)
        values(p_company, p_id, actor, actor, upper(btrim(p_data->>'unit_number')), p_data->>'equipment_type', p_data->>'operating_status', nullif(btrim(p_data->>'make'), ''), nullif(btrim(p_data->>'model'), ''), nullif(p_data->>'model_year', '')::integer)
        returning version into new_version;
    elsif p_action = 'edit' then
      update public.vehicles set unit_number = upper(btrim(p_data->>'unit_number')),
        equipment_type = p_data->>'equipment_type',
        operating_status = p_data->>'operating_status',
        make = nullif(btrim(p_data->>'make'), ''),
        model = nullif(btrim(p_data->>'model'), ''),
        model_year = nullif(p_data->>'model_year', '')::integer,
        version = version + 1, updated_by = actor, updated_at = now()
        where company_id = p_company and id = p_id and version = p_version
        returning version into new_version;
    else
      update public.vehicles set active = (p_action = 'activate'),
        version = version + 1, updated_by = actor, updated_at = now()
        where company_id = p_company and id = p_id and version = p_version
          and active <> (p_action = 'activate')
        returning version into new_version;
    end if;
  end if;
  if new_version is null then
    raise exception using errcode = '40001', message = 'Roster record unavailable or changed';
  end if;

  insert into public.roster_events(company_id, driver_id, vehicle_id, actor_id, action, version)
    values(p_company, case when p_kind = 'drivers' then p_id end,
      case when p_kind = 'vehicles' then p_id end, actor, p_action, new_version);
  return p_id;
end;
$$;

revoke all on function public.tms_save_roster(uuid, text, text, uuid, integer, jsonb) from public, anon, authenticated;
grant execute on function public.tms_save_roster(uuid, text, text, uuid, integer, jsonb) to authenticated;
grant tms_roster_executor to current_user with set true;
grant create on schema public to tms_roster_executor;
alter function public.tms_save_roster(uuid, text, text, uuid, integer, jsonb) owner to tms_roster_executor;
revoke create on schema public from tms_roster_executor;
revoke set option for tms_roster_executor from current_user;
commit;
