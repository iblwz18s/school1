-- إنشاء جدول المعلمين
CREATE TABLE IF NOT EXISTS teachers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- تفعيل RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة للجميع
CREATE POLICY "Allow public read access to teachers"
  ON teachers FOR SELECT
  TO public
  USING (true);

-- السماح بالإدارة للمستخدمين المصادق عليهم
CREATE POLICY "Allow authenticated users to manage teachers"
  ON teachers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- إضافة trigger للتحديث التلقائي
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE
    ON teachers FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
