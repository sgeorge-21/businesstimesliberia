CREATE TABLE public.story_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id uuid NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  author_name text NOT NULL CHECK (char_length(trim(author_name)) BETWEEN 1 AND 60),
  body text NOT NULL CHECK (char_length(trim(body)) BETWEEN 1 AND 2000),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX story_comments_story_idx ON public.story_comments(story_id, created_at DESC);

GRANT SELECT, INSERT ON public.story_comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.story_comments TO authenticated;
GRANT ALL ON public.story_comments TO service_role;

ALTER TABLE public.story_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads visible comments" ON public.story_comments
FOR SELECT USING (visible = true OR private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can post a comment" ON public.story_comments
FOR INSERT WITH CHECK (
  visible = true
  AND EXISTS (SELECT 1 FROM public.stories s WHERE s.id = story_id AND s.status = 'published')
);

CREATE POLICY "Admins manage comments" ON public.story_comments
FOR ALL TO authenticated
USING (private.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));