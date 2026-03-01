-- Users table
create table users (
  id bigint generated always as identity primary key,
  name text not null,
  email text unique not null,
  password text not null,
  role text not null check (role in ('admin', 'manager', 'employee')),
  branch text,
  created_at timestamptz default now()
);

-- Sales table
create table sales (
  id text primary key,
  employee_id bigint references users(id) on delete cascade,
  branch text not null,
  date date not null,
  returned boolean default false,
  return_date date,
  note text,
  created_at timestamptz default now()
);

-- Sale lines table
create table sale_lines (
  id text primary key,
  sale_id text references sales(id) on delete cascade,
  category text not null,
  quantity int not null,
  commission numeric not null
);

-- Settings table
create table settings (
  id int primary key default 1,
  rates jsonb not null default '{"New Devices": 75, "Fabrika Devices": 50, "Used Games": 25}',
  lock_days int not null default 7
);

-- Insert default settings
insert into settings (id, rates, lock_days) values (1, '{"New Devices": 75, "Fabrika Devices": 50, "Used Games": 25}', 7);

-- Insert demo users
insert into users (name, email, password, role, branch) values
  ('Ahmed Hassan',    'admin@branch.com',   'admin123',    'admin',    null),
  ('Sara Mohamed',    'cairo@branch.com',   'manager123',  'manager',  'Cairo'),
  ('Khaled Ali',      'alex@branch.com',    'manager456',  'manager',  'Alex'),
  ('Youssef Ibrahim', 'y@branch.com',       'emp123',      'employee', 'Cairo'),
  ('Nour Salah',      'n@branch.com',       'emp456',      'employee', 'Cairo'),
  ('Omar Tarek',      'o@branch.com',       'emp789',      'employee', 'Alex');

-- Disable RLS for simplicity (enable and configure for production)
alter table users     disable row level security;
alter table sales     disable row level security;
alter table sale_lines disable row level security;
alter table settings  disable row level security;
