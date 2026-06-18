
CREATE TABLE public.economic_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  value text NOT NULL,
  unit text,
  source text,
  as_of date,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.economic_indicators TO anon, authenticated;
GRANT ALL ON public.economic_indicators TO service_role;

ALTER TABLE public.economic_indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.economic_indicators FOR SELECT USING (true);
CREATE POLICY "Admins manage" ON public.economic_indicators FOR ALL
  USING (private.has_role(auth.uid(), 'admin'))
  WITH CHECK (private.has_role(auth.uid(), 'admin'));

CREATE TRIGGER set_economic_indicators_updated_at
  BEFORE UPDATE ON public.economic_indicators
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER PUBLICATION supabase_realtime ADD TABLE public.economic_indicators;

INSERT INTO public.economic_indicators (key, label, value, unit, source, as_of) VALUES
  ('national_budget', 'National Budget', '851.8', 'M USD', 'MFDP', CURRENT_DATE),
  ('gdp', 'GDP', '4.8', 'B USD', 'World Bank', CURRENT_DATE);
