# دليل استخدام القالب - Nafspro1

## نبذة عن المشروع

**Nafspro1** هو قالب قابل لإعادة الاستخدام لإنشاء منصات اختبارات محاكية لاختبارات نافس الوطنية. تم تصميمه ليكون سهل التخصيص والنشر لمدارس مختلفة.

---

## كيفية إنشاء مشروع جديد لمدرسة أخرى

### الخطوة 1: نسخ المشروع

```bash
# استنساخ القالب
git clone https://github.com/iblwz/Nafspro1.git اسم-مدرستك
cd اسم-مدرستك

# حذف ارتباط Git القديم
rm -rf .git

# إنشاء مستودع Git جديد
git init
```

---

### الخطوة 2: إنشاء قاعدة بيانات Supabase جديدة

#### أ. إنشاء مشروع جديد
1. سجّل الدخول إلى [Supabase](https://app.supabase.com)
2. انقر على **New Project**
3. اختر اسمًا للمشروع وكلمة مرور قوية لقاعدة البيانات
4. اختر المنطقة الأقرب لك

#### ب. تشغيل ملفات الهجرة (Migrations)
1. بعد إنشاء المشروع، اذهب إلى **SQL Editor**
2. افتح كل ملف من مجلد `supabase/migrations` بالترتيب
3. انسخ محتوى كل ملف وشغّله في SQL Editor
4. تأكد من تنفيذ جميع الملفات بنجاح

الملفات بالترتيب:
- `20251231195706_11e8572d-49d1-47cb-b44a-63be0bec5a5b.sql`
- `20251231195957_8d8ce2ad-1874-4d95-af36-d230b6017b04.sql`
- `20260103202418_ca59eb84-f5df-4bf5-83da-e61ed02acdd3.sql`

---

### الخطوة 3: إعداد المتغيرات البيئية

#### أ. نسخ ملف المثال
```bash
cp .env.example .env
```

#### ب. الحصول على بيانات Supabase
1. في لوحة تحكم Supabase، اذهب إلى **Settings** → **API**
2. انسخ القيم التالية:
   - **Project URL**: من قسم "Project URL"
   - **anon/public key**: من قسم "Project API keys"
   - **Project ID**: من رابط المشروع (الجزء بعد `/project/`)

#### ج. تحديث ملف .env
افتح ملف `.env` وأضف القيم:

```env
VITE_SUPABASE_PROJECT_ID=your_actual_project_id
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_actual_anon_key
```

---

### الخطوة 4: تخصيص المشروع (اختياري)

#### تحديث اسم المشروع
قم بتحديث الملفات التالية حسب الحاجة:
- `package.json`: غيّر `name` و `description`
- `README.md`: حدّث العنوان والوصف
- `index.html`: حدّث عنوان الصفحة

#### تخصيص الشعار والصور
- استبدل الملفات في مجلد `src/assets/` بشعار وصور مدرستك
- حدّث `public/favicon.ico` بأيقونة مدرستك

---

### الخطوة 5: تثبيت الاعتماديات وتشغيل المشروع

```bash
# تثبيت الاعتماديات
npm install

# تشغيل خادم التطوير
npm run dev
```

سيعمل المشروع على: `http://localhost:5173`

---

### الخطوة 6: نشر المشروع

#### أ. إنشاء مستودع GitHub جديد
1. أنشئ مستودعًا جديدًا على GitHub
2. اربط المشروع المحلي بالمستودع:

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

#### ب. النشر على Vercel
1. سجّل الدخول إلى [Vercel](https://vercel.com)
2. انقر على **New Project**
3. اختر المستودع الذي أنشأته
4. في **Environment Variables**، أضف:
   - `VITE_SUPABASE_PROJECT_ID`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
5. انقر على **Deploy**

---

## بنية قاعدة البيانات

المشروع يستخدم الجداول التالية في Supabase:

### 1. students (الطلاب)
- `id`: معرف فريد
- `student_name`: اسم الطالب
- `parent_name`: اسم ولي الأمر
- `phone_number`: رقم الهاتف
- `pin_code`: رمز PIN للدخول
- `grade`: الصف الدراسي
- `created_at`: تاريخ الإنشاء

### 2. student_progress (تقدم الطلاب)
- `id`: معرف فريد
- `student_id`: معرف الطالب (مرتبط بجدول students)
- `standard_id`: معرف المعيار
- `sub_indicator_id`: معرف المؤشر الفرعي
- `score`: الدرجة
- `total_questions`: عدد الأسئلة
- `completed_at`: تاريخ الإكمال

### 3. training_images (صور التدريب)
- `id`: معرف فريد
- `file_name`: اسم الملف
- `file_path`: مسار الملف
- `uploaded_by`: معرف المستخدم الذي رفع الصورة
- `created_at`: تاريخ الرفع

### 4. user_roles (أدوار المستخدمين)
- `id`: معرف فريد
- `user_id`: معرف المستخدم
- `role`: الدور (admin أو user)
- `created_at`: تاريخ الإنشاء

---

## استكشاف الأخطاء الشائعة

### خطأ في الاتصال بـ Supabase
- تأكد من صحة القيم في ملف `.env`
- تحقق من أن المشروع نشط في Supabase
- تأكد من أن المفاتيح صحيحة ولم تنتهي صلاحيتها

### خطأ في قاعدة البيانات
- تأكد من تشغيل جميع ملفات الهجرة بالترتيب
- تحقق من صلاحيات الوصول في Supabase
- راجع سجل الأخطاء في لوحة تحكم Supabase

### مشاكل في البناء (Build)
- تأكد من تثبيت جميع الاعتماديات: `npm install`
- احذف مجلد `node_modules` وأعد التثبيت
- تأكد من استخدام إصدار Node.js المناسب (v18+)

---

## الدعم والمساعدة

إذا واجهت أي مشاكل:
1. راجع ملف [SETUP.md](./SETUP.md) للحصول على تعليمات مفصلة
2. تحقق من [توثيق Supabase](https://supabase.com/docs)
3. راجع [توثيق Vite](https://vitejs.dev/)

---

## الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام التعليمي.
