
CREATE TABLE public.ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  link_url text,
  placement text NOT NULL DEFAULT 'top' CHECK (placement IN ('top','sidebar')),
  active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ads TO authenticated;
GRANT ALL ON public.ads TO service_role;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active ads" ON public.ads FOR SELECT USING (active = true AND (start_at IS NULL OR start_at <= now()) AND (end_at IS NULL OR end_at >= now()));
CREATE POLICY "Admins read all ads" ON public.ads FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage ads" ON public.ads FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.trending_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text,
  position int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trending_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trending_items TO authenticated;
GRANT ALL ON public.trending_items TO service_role;
ALTER TABLE public.trending_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active trending" ON public.trending_items FOR SELECT USING (active = true);
CREATE POLICY "Admins read all trending" ON public.trending_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage trending" ON public.trending_items FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.cbl_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency text NOT NULL UNIQUE,
  buy_rate numeric(12,4),
  sell_rate numeric(12,4),
  source text DEFAULT 'cbl.org.lr',
  fetched_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.cbl_rates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cbl_rates TO authenticated;
GRANT ALL ON public.cbl_rates TO service_role;
ALTER TABLE public.cbl_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads rates" ON public.cbl_rates FOR SELECT USING (true);
CREATE POLICY "Admins manage rates" ON public.cbl_rates FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER ads_set_updated_at BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trending_set_updated_at BEFORE UPDATE ON public.trending_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER cbl_set_updated_at BEFORE UPDATE ON public.cbl_rates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.cbl_rates (currency, buy_rate, sell_rate) VALUES
  ('USD', 188.50, 192.00),
  ('EUR', 205.20, 210.50),
  ('GBP', 240.10, 245.80)
ON CONFLICT (currency) DO NOTHING;
