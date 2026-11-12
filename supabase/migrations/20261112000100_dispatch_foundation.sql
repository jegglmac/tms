begin;

create role tms_dispatch_executor nologin nobypassrls;
grant usage on schema public, auth to tms_dispatch_executor;
grant execute on function auth.uid() to tms_dispatch_executor;

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.users (
  id uuid primary key references auth.users(id),
  display_name text not null,
  disabled_at timestamptz
);

create table public.memberships (
  company_id uuid not null references public.companies(id),
  user_id uuid not null references public.users(id),
  role text not null check (role in ('dispatcher', 'viewer')),
  revoked_at timestamptz,
  primary key (company_id, user_id)
);
create index memberships_by_user on public.memberships(user_id, company_id);

create table public.loads (
  company_id uuid not null references public.companies(id),
  id uuid not null default gen_random_uuid(),
  load_number bigint not null check (load_number > 0),
  status text not null default 'draft' check (status in ('draft', 'ready')),
  version integer not null default 1 check (version > 0),
  counterparty text not null check (char_length(btrim(counterparty)) between 1 and 160),
  reference text not null default '' check (char_length(reference) <= 120),
  rate_cents integer not null check (rate_cents between 0 and 100000000),
  cargo text not null check (char_length(btrim(cargo)) between 1 and 500),
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (company_id, id),
  unique (company_id, load_number),
  foreign key (company_id, created_by) references public.memberships(company_id, user_id)
);
create index loads_dispatch_order on public.loads(company_id, updated_at desc, id);

create table public.load_stops (
  company_id uuid not null,
  load_id uuid not null,
  kind text not null check (kind in ('pickup', 'delivery')),
  address text not null check (char_length(btrim(address)) between 1 and 250),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'America/New_York' check (timezone = 'America/New_York'),
  check (isfinite(starts_at) and isfinite(ends_at) and starts_at <= ends_at),
  primary key (company_id, load_id, kind),
  foreign key (company_id, load_id) references public.loads(company_id, id)
);

create table public.shipment_events (
  company_id uuid not null,
  load_id uuid not null,
  version integer not null,
  from_status text,
  to_status text not null,
  actor_id uuid not null,
  recorded_at timestamptz not null default now(),
  check ((from_status is null and to_status = 'draft') or
         (from_status is not null and from_status = 'draft' and to_status = 'ready')),
  primary key (company_id, load_id, version),
  foreign key (company_id, load_id) references public.loads(company_id, id),
  foreign key (company_id, actor_id) references public.memberships(company_id, user_id)
);

create table public.audit_logs (
  company_id uuid not null,
  load_id uuid not null,
  version integer not null,
  actor_id uuid not null,
  action text not null check (action in ('create', 'edit', 'ready')),
  request_id uuid not null,
  recorded_at timestamptz not null default now(),
  primary key (company_id, load_id, version),
  foreign key (company_id, load_id) references public.loads(company_id, id),
  foreign key (company_id, actor_id) references public.memberships(company_id, user_id)
);

create table public.dispatch_counters (
  company_id uuid primary key references public.companies(id),
  last_number bigint not null check (last_number > 0)
);

create table public.idempotency_keys (
  company_id uuid not null,
  actor_id uuid not null,
  request_id uuid not null,
  request_hash text not null,
  load_id uuid not null,
  primary key (company_id, actor_id, request_id),
  foreign key (company_id, load_id) references public.loads(company_id, id),
  foreign key (company_id, actor_id) references public.memberships(company_id, user_id)
);

revoke all on public.companies, public.users, public.memberships, public.loads,
  public.load_stops, public.shipment_events, public.audit_logs, public.idempotency_keys, public.dispatch_counters
  from public, anon, authenticated;
grant select on public.companies, public.users, public.memberships, public.loads,
  public.load_stops, public.shipment_events, public.audit_logs to authenticated;
grant select on public.companies, public.users, public.memberships, public.loads,
  public.load_stops, public.idempotency_keys to tms_dispatch_executor;
grant insert on public.loads, public.load_stops, public.shipment_events,
  public.audit_logs, public.idempotency_keys to tms_dispatch_executor;
grant update on public.loads, public.load_stops to tms_dispatch_executor;
grant select, insert, update on public.dispatch_counters to tms_dispatch_executor;

alter table public.companies enable row level security;
alter table public.users enable row level security;
alter table public.memberships enable row level security;
alter table public.loads enable row level security;
alter table public.load_stops enable row level security;
alter table public.shipment_events enable row level security;
alter table public.audit_logs enable row level security;
alter table public.idempotency_keys enable row level security;
alter table public.dispatch_counters enable row level security;

create policy own_profile on public.users for select to authenticated, tms_dispatch_executor
  using (id = (select auth.uid()) and disabled_at is null);
create policy own_memberships on public.memberships for select to authenticated, tms_dispatch_executor
  using (user_id = (select auth.uid()) and revoked_at is null
    and exists (select 1 from public.users u where u.id = user_id));
create policy company_members on public.companies for select to authenticated, tms_dispatch_executor
  using (active and exists (select 1 from public.memberships m where m.company_id = id));

-- The helper is invoker-scoped, so the membership and company policies remain active.
create function public.tms_can_dispatch(p_company uuid) returns boolean
language sql stable security invoker set search_path = ''
as $$
  select exists (
    select 1 from public.memberships m join public.companies c on c.id = m.company_id
    where m.company_id = p_company and m.user_id = (select auth.uid()) and m.role = 'dispatcher'
  );
$$;
revoke all on function public.tms_can_dispatch(uuid) from public, anon, authenticated;
grant execute on function public.tms_can_dispatch(uuid) to authenticated, tms_dispatch_executor;

create policy counter_dispatch on public.dispatch_counters for all to tms_dispatch_executor
  using (public.tms_can_dispatch(company_id)) with check (public.tms_can_dispatch(company_id));

create policy load_read on public.loads for select to authenticated, tms_dispatch_executor
  using (public.tms_can_dispatch(company_id));
create policy stop_read on public.load_stops for select to authenticated, tms_dispatch_executor
  using (public.tms_can_dispatch(company_id));
create policy history_read on public.shipment_events for select to authenticated
  using (public.tms_can_dispatch(company_id));
create policy audit_read on public.audit_logs for select to authenticated
  using (public.tms_can_dispatch(company_id));
create policy key_read on public.idempotency_keys for select to tms_dispatch_executor
  using (public.tms_can_dispatch(company_id) and actor_id = (select auth.uid()));
create policy load_insert on public.loads for insert to tms_dispatch_executor
  with check (public.tms_can_dispatch(company_id) and created_by = (select auth.uid()));
create policy load_update on public.loads for update to tms_dispatch_executor
  using (public.tms_can_dispatch(company_id)) with check (public.tms_can_dispatch(company_id));
create policy stop_insert on public.load_stops for insert to tms_dispatch_executor
  with check (public.tms_can_dispatch(company_id));
create policy stop_update on public.load_stops for update to tms_dispatch_executor
  using (public.tms_can_dispatch(company_id)) with check (public.tms_can_dispatch(company_id));
create policy event_insert on public.shipment_events for insert to tms_dispatch_executor
  with check (public.tms_can_dispatch(company_id) and actor_id = (select auth.uid()));
create policy audit_insert on public.audit_logs for insert to tms_dispatch_executor
  with check (public.tms_can_dispatch(company_id) and actor_id = (select auth.uid()));
create policy key_insert on public.idempotency_keys for insert to tms_dispatch_executor
  with check (public.tms_can_dispatch(company_id) and actor_id = (select auth.uid()));

create function public.tms_save_load(
  p_company uuid, p_request uuid, p_action text, p_load uuid default null,
  p_version integer default null, p_data jsonb default null
) returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  v_actor uuid := auth.uid();
  v_id uuid;
  v_number bigint;
  v_field text;
  v_version integer;
  v_hash text;
  v_previous_hash text;
  v_pickup_start timestamptz;
  v_pickup_end timestamptz;
  v_delivery_start timestamptz;
  v_delivery_end timestamptz;
begin
  if v_actor is null or not public.tms_can_dispatch(p_company) then
    raise exception using errcode = '42501', message = 'Dispatch access denied';
  end if;
  if p_request is null or p_action is null or p_action not in ('create', 'edit', 'ready') or
    (p_action = 'create' and (p_load is not null or p_version is not null)) or
    (p_action <> 'create' and (p_load is null or coalesce(p_version, 0) < 1)) then
    raise exception using errcode = '22023', message = 'Invalid dispatch command';
  end if;
  if p_action <> 'ready' then
    if jsonb_typeof(p_data) is distinct from 'object' or octet_length(p_data::text) > 8192 then
      raise exception using errcode = '22023', message = 'Invalid load details';
    end if;
    foreach v_field in array array['counterparty', 'reference', 'cargo', 'pickupAddress', 'deliveryAddress'] loop
      if jsonb_typeof(p_data->v_field) is distinct from 'string' then
        raise exception using errcode = '22023', message = 'Invalid load details';
      end if;
    end loop;
    if jsonb_typeof(p_data->'rateCents') is distinct from 'number' or
      (p_data->>'rateCents') !~ '^[0-9]{1,9} (p_data->>'pickupStart')::timestamptz;
    v_pickup_end := (p_data->>'pickupEnd')::timestamptz;
    v_delivery_start := (p_data->>'deliveryStart')::timestamptz;
    v_delivery_end := (p_data->>'deliveryEnd')::timestamptz;
    if v_pickup_start is null or v_pickup_end is null or v_delivery_start is null or v_delivery_end is null
      or v_pickup_start > v_pickup_end or v_delivery_start > v_delivery_end or v_pickup_end > v_delivery_start then
      raise exception using errcode = '22023', message = 'Invalid appointment windows';
    end if;
  elsif p_data is not null then
    raise exception using errcode = '22023', message = 'Invalid status command';
  end if;

  v_hash := encode(sha256(convert_to(jsonb_build_array(p_action, p_load, p_version, p_data)::text, 'UTF8')), 'hex');
  perform pg_advisory_xact_lock(hashtextextended(p_company::text || v_actor::text || p_request::text, 0));
  select k.load_id, k.request_hash into v_id, v_previous_hash from public.idempotency_keys k
    where k.company_id = p_company and k.actor_id = v_actor and k.request_id = p_request;
  if found then
    if v_previous_hash <> v_hash then
      raise exception using errcode = '23505', message = 'Request already used with different data';
    end if;
    return v_id;
  end if;

  if p_action = 'create' then
    insert into public.dispatch_counters(company_id, last_number) values (p_company, 1)
      on conflict (company_id) do update set last_number = dispatch_counters.last_number + 1
      returning last_number into v_number;
    insert into public.loads(company_id, load_number, counterparty, reference, rate_cents, cargo, created_by)
      values(p_company, v_number, btrim(p_data->>'counterparty'), coalesce(btrim(p_data->>'reference'), ''),
        (p_data->>'rateCents')::integer, btrim(p_data->>'cargo'), v_actor)
      returning id, version into v_id, v_version;
    insert into public.load_stops(company_id, load_id, kind, address, starts_at, ends_at)
      values (p_company, v_id, 'pickup', btrim(p_data->>'pickupAddress'), v_pickup_start, v_pickup_end),
             (p_company, v_id, 'delivery', btrim(p_data->>'deliveryAddress'), v_delivery_start, v_delivery_end);
  elsif p_action = 'edit' then
    update public.loads set counterparty = btrim(p_data->>'counterparty'),
      reference = coalesce(btrim(p_data->>'reference'), ''), rate_cents = (p_data->>'rateCents')::integer,
      cargo = btrim(p_data->>'cargo'), version = version + 1, updated_at = now()
      where company_id = p_company and id = p_load and version = p_version
      returning id, version into v_id, v_version;
    if found then
      update public.load_stops set address = btrim(p_data->>'pickupAddress'),
        starts_at = v_pickup_start, ends_at = v_pickup_end
        where company_id = p_company and load_id = v_id and kind = 'pickup';
      if not found then raise exception 'Missing pickup stop'; end if;
      update public.load_stops set address = btrim(p_data->>'deliveryAddress'),
        starts_at = v_delivery_start, ends_at = v_delivery_end
        where company_id = p_company and load_id = v_id and kind = 'delivery';
      if not found then raise exception 'Missing delivery stop'; end if;
    end if;
  else
    update public.loads set status = 'ready', version = version + 1, updated_at = now()
      where company_id = p_company and id = p_load and version = p_version and status = 'draft'
      returning id, version into v_id, v_version;
  end if;

  if v_id is null then
    raise exception using errcode = '40001', message = 'Load unavailable or changed';
  end if;
  if p_action in ('create', 'ready') then
    insert into public.shipment_events(company_id, load_id, version, from_status, to_status, actor_id)
      values(p_company, v_id, v_version, case when p_action = 'ready' then 'draft' end,
        case when p_action = 'ready' then 'ready' else 'draft' end, v_actor);
  end if;
  insert into public.audit_logs(company_id, load_id, version, actor_id, action, request_id)
    values(p_company, v_id, v_version, v_actor, p_action, p_request);
  insert into public.idempotency_keys(company_id, actor_id, request_id, request_hash, load_id)
    values(p_company, v_actor, p_request, v_hash, v_id);
  return v_id;
end;
$$;

-- PostgreSQL requires CREATE on the containing schema for the new owner.
grant create on schema public to tms_dispatch_executor;
alter function public.tms_save_load(uuid, uuid, text, uuid, integer, jsonb) owner to tms_dispatch_executor;
revoke create on schema public from tms_dispatch_executor;
revoke all on function public.tms_save_load(uuid, uuid, text, uuid, integer, jsonb) from public, anon, authenticated;
grant execute on function public.tms_save_load(uuid, uuid, text, uuid, integer, jsonb) to authenticated;
commit;
 then
      raise exception using errcode = '22023', message = 'Invalid rate';
    end if;
    foreach v_field in array array['pickupStart', 'pickupEnd', 'deliveryStart', 'deliveryEnd'] loop
      if coalesce(p_data->>v_field, '') !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:00Z (p_data->>'pickupStart')::timestamptz;
    v_pickup_end := (p_data->>'pickupEnd')::timestamptz;
    v_delivery_start := (p_data->>'deliveryStart')::timestamptz;
    v_delivery_end := (p_data->>'deliveryEnd')::timestamptz;
    if v_pickup_start is null or v_pickup_end is null or v_delivery_start is null or v_delivery_end is null
      or v_pickup_start > v_pickup_end or v_delivery_start > v_delivery_end or v_pickup_end > v_delivery_start then
      raise exception using errcode = '22023', message = 'Invalid appointment windows';
    end if;
  elsif p_data is not null then
    raise exception using errcode = '22023', message = 'Invalid status command';
  end if;

  v_hash := encode(sha256(convert_to(jsonb_build_array(p_action, p_load, p_version, p_data)::text, 'UTF8')), 'hex');
  perform pg_advisory_xact_lock(hashtextextended(p_company::text || v_actor::text || p_request::text, 0));
  select k.load_id, k.request_hash into v_id, v_previous_hash from public.idempotency_keys k
    where k.company_id = p_company and k.actor_id = v_actor and k.request_id = p_request;
  if found then
    if v_previous_hash <> v_hash then
      raise exception using errcode = '23505', message = 'Request already used with different data';
    end if;
    return v_id;
  end if;

  if p_action = 'create' then
    insert into public.loads(company_id, counterparty, reference, rate_cents, cargo, created_by)
      values(p_company, btrim(p_data->>'counterparty'), coalesce(btrim(p_data->>'reference'), ''),
        (p_data->>'rateCents')::integer, btrim(p_data->>'cargo'), v_actor)
      returning id, version into v_id, v_version;
    insert into public.load_stops(company_id, load_id, kind, address, starts_at, ends_at)
      values (p_company, v_id, 'pickup', btrim(p_data->>'pickupAddress'), v_pickup_start, v_pickup_end),
             (p_company, v_id, 'delivery', btrim(p_data->>'deliveryAddress'), v_delivery_start, v_delivery_end);
  elsif p_action = 'edit' then
    update public.loads set counterparty = btrim(p_data->>'counterparty'),
      reference = coalesce(btrim(p_data->>'reference'), ''), rate_cents = (p_data->>'rateCents')::integer,
      cargo = btrim(p_data->>'cargo'), version = version + 1, updated_at = now()
      where company_id = p_company and id = p_load and version = p_version
      returning id, version into v_id, v_version;
    if found then
      update public.load_stops set address = btrim(p_data->>'pickupAddress'),
        starts_at = v_pickup_start, ends_at = v_pickup_end
        where company_id = p_company and load_id = v_id and kind = 'pickup';
      if not found then raise exception 'Missing pickup stop'; end if;
      update public.load_stops set address = btrim(p_data->>'deliveryAddress'),
        starts_at = v_delivery_start, ends_at = v_delivery_end
        where company_id = p_company and load_id = v_id and kind = 'delivery';
      if not found then raise exception 'Missing delivery stop'; end if;
    end if;
  else
    update public.loads set status = 'ready', version = version + 1, updated_at = now()
      where company_id = p_company and id = p_load and version = p_version and status = 'draft'
      returning id, version into v_id, v_version;
  end if;

  if v_id is null then
    raise exception using errcode = '40001', message = 'Load unavailable or changed';
  end if;
  if p_action in ('create', 'ready') then
    insert into public.shipment_events(company_id, load_id, version, from_status, to_status, actor_id)
      values(p_company, v_id, v_version, case when p_action = 'ready' then 'draft' end,
        case when p_action = 'ready' then 'ready' else 'draft' end, v_actor);
  end if;
  insert into public.audit_logs(company_id, load_id, version, actor_id, action, request_id)
    values(p_company, v_id, v_version, v_actor, p_action, p_request);
  insert into public.idempotency_keys(company_id, actor_id, request_id, request_hash, load_id)
    values(p_company, v_actor, p_request, v_hash, v_id);
  return v_id;
end;
$$;

-- PostgreSQL requires CREATE on the containing schema for the new owner.
grant create on schema public to tms_dispatch_executor;
alter function public.tms_save_load(uuid, uuid, text, uuid, integer, jsonb) owner to tms_dispatch_executor;
revoke create on schema public from tms_dispatch_executor;
revoke all on function public.tms_save_load(uuid, uuid, text, uuid, integer, jsonb) from public, anon, authenticated;
grant execute on function public.tms_save_load(uuid, uuid, text, uuid, integer, jsonb) to authenticated;
commit;
 then
        raise exception using errcode = '22023', message = 'Invalid appointment';
      end if;
    end loop;
    v_pickup_start := (p_data->>'pickupStart')::timestamptz;
    v_pickup_end := (p_data->>'pickupEnd')::timestamptz;
    v_delivery_start := (p_data->>'deliveryStart')::timestamptz;
    v_delivery_end := (p_data->>'deliveryEnd')::timestamptz;
    if v_pickup_start is null or v_pickup_end is null or v_delivery_start is null or v_delivery_end is null
      or v_pickup_start > v_pickup_end or v_delivery_start > v_delivery_end or v_pickup_end > v_delivery_start then
      raise exception using errcode = '22023', message = 'Invalid appointment windows';
    end if;
  elsif p_data is not null then
    raise exception using errcode = '22023', message = 'Invalid status command';
  end if;

  v_hash := encode(sha256(convert_to(jsonb_build_array(p_action, p_load, p_version, p_data)::text, 'UTF8')), 'hex');
  perform pg_advisory_xact_lock(hashtextextended(p_company::text || v_actor::text || p_request::text, 0));
  select k.load_id, k.request_hash into v_id, v_previous_hash from public.idempotency_keys k
    where k.company_id = p_company and k.actor_id = v_actor and k.request_id = p_request;
  if found then
    if v_previous_hash <> v_hash then
      raise exception using errcode = '23505', message = 'Request already used with different data';
    end if;
    return v_id;
  end if;

  if p_action = 'create' then
    insert into public.loads(company_id, counterparty, reference, rate_cents, cargo, created_by)
      values(p_company, btrim(p_data->>'counterparty'), coalesce(btrim(p_data->>'reference'), ''),
        (p_data->>'rateCents')::integer, btrim(p_data->>'cargo'), v_actor)
      returning id, version into v_id, v_version;
    insert into public.load_stops(company_id, load_id, kind, address, starts_at, ends_at)
      values (p_company, v_id, 'pickup', btrim(p_data->>'pickupAddress'), v_pickup_start, v_pickup_end),
             (p_company, v_id, 'delivery', btrim(p_data->>'deliveryAddress'), v_delivery_start, v_delivery_end);
  elsif p_action = 'edit' then
    update public.loads set counterparty = btrim(p_data->>'counterparty'),
      reference = coalesce(btrim(p_data->>'reference'), ''), rate_cents = (p_data->>'rateCents')::integer,
      cargo = btrim(p_data->>'cargo'), version = version + 1, updated_at = now()
      where company_id = p_company and id = p_load and version = p_version
      returning id, version into v_id, v_version;
    if found then
      update public.load_stops set address = btrim(p_data->>'pickupAddress'),
        starts_at = v_pickup_start, ends_at = v_pickup_end
        where company_id = p_company and load_id = v_id and kind = 'pickup';
      if not found then raise exception 'Missing pickup stop'; end if;
      update public.load_stops set address = btrim(p_data->>'deliveryAddress'),
        starts_at = v_delivery_start, ends_at = v_delivery_end
        where company_id = p_company and load_id = v_id and kind = 'delivery';
      if not found then raise exception 'Missing delivery stop'; end if;
    end if;
  else
    update public.loads set status = 'ready', version = version + 1, updated_at = now()
      where company_id = p_company and id = p_load and version = p_version and status = 'draft'
      returning id, version into v_id, v_version;
  end if;

  if v_id is null then
    raise exception using errcode = '40001', message = 'Load unavailable or changed';
  end if;
  if p_action in ('create', 'ready') then
    insert into public.shipment_events(company_id, load_id, version, from_status, to_status, actor_id)
      values(p_company, v_id, v_version, case when p_action = 'ready' then 'draft' end,
        case when p_action = 'ready' then 'ready' else 'draft' end, v_actor);
  end if;
  insert into public.audit_logs(company_id, load_id, version, actor_id, action, request_id)
    values(p_company, v_id, v_version, v_actor, p_action, p_request);
  insert into public.idempotency_keys(company_id, actor_id, request_id, request_hash, load_id)
    values(p_company, v_actor, p_request, v_hash, v_id);
  return v_id;
end;
$$;

-- PostgreSQL requires CREATE on the containing schema for the new owner.
grant create on schema public to tms_dispatch_executor;
alter function public.tms_save_load(uuid, uuid, text, uuid, integer, jsonb) owner to tms_dispatch_executor;
revoke create on schema public from tms_dispatch_executor;
revoke all on function public.tms_save_load(uuid, uuid, text, uuid, integer, jsonb) from public, anon, authenticated;
grant execute on function public.tms_save_load(uuid, uuid, text, uuid, integer, jsonb) to authenticated;
commit;
