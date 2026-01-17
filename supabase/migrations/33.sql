-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for training images
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-images', 'training-images', true);

-- Storage policies for training images
CREATE POLICY "Anyone can view training images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'training-images');

CREATE POLICY "Admins can upload training images"
ON storage.objects
FOR INSERT
WITH CHECK (
    bucket_id = 'training-images' 
    AND public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete training images"
ON storage.objects
FOR DELETE
USING (
    bucket_id = 'training-images' 
    AND public.has_role(auth.uid(), 'admin')
);

-- Update students table to allow admin inserts
CREATE POLICY "Admins can insert students"
ON public.students
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update students"
ON public.students
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete students"
ON public.students
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Create training_images table to track uploaded images
CREATE TABLE public.training_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.training_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view training images metadata"
ON public.training_images
FOR SELECT
USING (true);

CREATE POLICY "Admins can insert training images metadata"
ON public.training_images
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete training images metadata"
ON public.training_images
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));