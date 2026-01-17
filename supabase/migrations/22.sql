-- Remove unique constraint on phone_number to allow siblings with same parent
ALTER TABLE public.students DROP CONSTRAINT students_phone_number_key;