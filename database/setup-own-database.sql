-- Sri Jayam Travels — one-time setup for your own database.
-- Paste everything below into your project's SQL Editor and press Run.

-- 1. Roles
DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users read own roles" ON public.user_roles;
CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Lets the sign-in screen know whether the owner account exists (returns only true/false).
CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
$$;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

-- The first sign-up with the owner email becomes the admin. Nobody else can.
CREATE OR REPLACE FUNCTION public.grant_owner_admin()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'admin@jayamtravels.in'
     AND NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
DROP TRIGGER IF EXISTS on_auth_user_created_grant_admin ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_admin AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_owner_admin();

-- 2. Website settings
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_public boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public settings readable" ON public.site_settings;
CREATE POLICY "Public settings readable" ON public.site_settings FOR SELECT TO anon, authenticated USING (is_public = true);
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS site_settings_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_settings (key, value, is_public) VALUES
  ('brand', '{}', true), ('seo', '{}', true), ('content', '{}', true), ('booking_api', '{"enabled":false}', false)
ON CONFLICT (key) DO NOTHING;

-- 3. Bookings from the website
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  phone text NOT NULL,
  email text,
  pickup text NOT NULL,
  drop_location text,
  trip_date text,
  trip_time text,
  return_date text,
  trip_type text NOT NULL,
  vehicle_type text,
  passengers int NOT NULL DEFAULT 1,
  special_request text,
  service_slug text,
  status text NOT NULL DEFAULT 'PENDING',
  source text NOT NULL DEFAULT 'PUBLIC_WEBSITE',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can submit a booking" ON public.bookings;
CREATE POLICY "Anyone can submit a booking" ON public.bookings FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'PENDING' AND length(phone) BETWEEN 6 AND 20 AND length(customer_name) BETWEEN 1 AND 120);
DROP POLICY IF EXISTS "Admins manage bookings" ON public.bookings;
CREATE POLICY "Admins manage bookings" ON public.bookings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
