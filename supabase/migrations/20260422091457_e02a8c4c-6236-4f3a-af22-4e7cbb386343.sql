-- Roles enum
CREATE TYPE public.app_role AS ENUM ('user', 'rider', 'admin');

-- Ride status enum
CREATE TYPE public.ride_status AS ENUM ('pending', 'accepted', 'completed', 'cancelled');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Rides
CREATE TABLE public.rides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rider_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  pickup TEXT NOT NULL,
  drop_location TEXT NOT NULL,
  status public.ride_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.rides ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Authenticated can view profiles"
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Admins can delete profiles"
ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User_roles policies
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Rides policies
CREATE POLICY "Users view own rides"
ON public.rides FOR SELECT TO authenticated
USING (
  auth.uid() = user_id
  OR (public.has_role(auth.uid(), 'rider') AND (status = 'pending' OR rider_id = auth.uid()))
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users create own rides"
ON public.rides FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND public.has_role(auth.uid(), 'user'));

CREATE POLICY "Users cancel own pending rides; riders accept/complete; admin all"
ON public.rides FOR UPDATE TO authenticated
USING (
  (auth.uid() = user_id)
  OR public.has_role(auth.uid(), 'rider')
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  (auth.uid() = user_id)
  OR public.has_role(auth.uid(), 'rider')
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Users delete own pending; admin all"
ON public.rides FOR DELETE TO authenticated
USING (
  (auth.uid() = user_id AND status = 'pending')
  OR public.has_role(auth.uid(), 'admin')
);

-- Trigger: create profile + role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', ''),
    NEW.email
  );

  _role := COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'user');
  IF _role NOT IN ('user', 'rider') THEN
    _role := 'user';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
