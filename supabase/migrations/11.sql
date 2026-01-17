-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  phone_number TEXT NOT NULL UNIQUE,
  pin_code TEXT NOT NULL,
  grade TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read students (for login verification)
CREATE POLICY "Anyone can read students" 
ON public.students 
FOR SELECT 
USING (true);

-- Create student_progress table for future use
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  standard_id TEXT NOT NULL,
  sub_indicator_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on progress table
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read/insert progress (no auth required for this educational app)
CREATE POLICY "Anyone can read progress" 
ON public.student_progress 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert progress" 
ON public.student_progress 
FOR INSERT 
WITH CHECK (true);