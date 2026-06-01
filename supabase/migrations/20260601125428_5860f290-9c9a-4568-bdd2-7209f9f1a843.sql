-- Extend app_role enum with blog roles
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'reporter';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'contributor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'author';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'subscriber';