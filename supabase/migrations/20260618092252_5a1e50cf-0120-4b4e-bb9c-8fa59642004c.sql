
-- Repoint ads policies to private.has_role
DROP POLICY IF EXISTS "Admins read all ads" ON public.ads;
DROP POLICY IF EXISTS "Admins manage ads" ON public.ads;
CREATE POLICY "Admins read all ads" ON public.ads FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage ads" ON public.ads FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- Repoint trending_items policies
DROP POLICY IF EXISTS "Admins read all trending" ON public.trending_items;
DROP POLICY IF EXISTS "Admins manage trending" ON public.trending_items;
CREATE POLICY "Admins read all trending" ON public.trending_items FOR SELECT TO authenticated USING (private.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage trending" ON public.trending_items FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- Repoint cbl_rates policies
DROP POLICY IF EXISTS "Admins manage rates" ON public.cbl_rates;
CREATE POLICY "Admins manage rates" ON public.cbl_rates FOR ALL TO authenticated USING (private.has_role(auth.uid(),'admin')) WITH CHECK (private.has_role(auth.uid(),'admin'));

-- Repoint storage.objects media policies
DROP POLICY IF EXISTS "media admin insert" ON storage.objects;
DROP POLICY IF EXISTS "media admin update" ON storage.objects;
DROP POLICY IF EXISTS "media admin delete" ON storage.objects;
CREATE POLICY "media admin insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media' AND private.has_role(auth.uid(),'admin'));
CREATE POLICY "media admin update" ON storage.objects FOR UPDATE USING (bucket_id = 'media' AND private.has_role(auth.uid(),'admin'));
CREATE POLICY "media admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND private.has_role(auth.uid(),'admin'));

-- Remove the public has_role function so it cannot be invoked via RPC
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- Lock down search_path on handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;
