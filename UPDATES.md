# تحديثات نظام إدارة العملاء (CRM)

## التحديثات المنجزة

### 1. إدارة الأقسام للادمن ✅

#### الملفات المضافة:

- `src/types/department.ts` - نوع البيانات للأقسام
- `src/stores/departments.ts` - store لإدارة الأقسام
- `src/views/AdminDepartmentsView.vue` - صفحة إدارة الأقسام

#### الميزات:

- إضافة قسم جديد (اسم، وصف، مدير)
- تعديل الأقسام الموجودة
- حذف الأقسام
- البحث والفرز في الأقسام
- تصدير بيانات الأقسام

#### التحديثات المطلوبة:

- إضافة راوت `/admin/departments` في `src/router/index.ts`
- إضافة رابط "الأقسام" في `src/components/AdminLayout.vue`

### 2. تحديث نظام الموظفين ✅

#### الملفات المحدثة:

- `src/types/employee.ts` - إضافة `departmentId` و `departmentName`
- `src/stores/employees.ts` - دعم الأقسام وتوليد كلمات المرور
- `src/views/EmployeesView.vue` - إضافة حقول القسم والمسمى الوظيفي

#### الميزات الجديدة:

- تحديد قسم الموظف عند الإنشاء
- إضافة المسمى الوظيفي
- توليد كلمة مرور عشوائية للموظفين الجدد
- عرض كلمة المرور للموظف الجديد
- ربط الموظفين بالأقسام

### 3. نظام عروض الأسعار مع دعم الملفات ✅

#### الملفات المضافة:

- `src/types/priceOffer.ts` - نوع البيانات لعروض الأسعار
- `src/stores/priceOffers.ts` - store لإدارة عروض الأسعار
- `src/components/PriceOffersManager.vue` - مكون إدارة عروض الأسعار

#### الميزات:

- رفع ملف PDF من الادمن لكل عرض سعر
- عرض وتحميل ملفات PDF
- للموظفين: رفع ملف العقد الممضي بعد إتمام الاتفاق
- إدارة حالة العروض (معلق، مقبول، مرفوض، منتهي الصلاحية)
- عرض تفاصيل كاملة لكل عرض سعر

#### التحديثات المطلوبة:

- تحديث `src/views/AdminDealsView.vue` لاستخدام المكون الجديد
- تحديث `src/views/employee/PriceOffersView.vue` للموظفين

### 4. تحديثات عامة ✅

#### الملفات المحدثة:

- `src/types/index.ts` - إضافة الأنواع الجديدة
- `src/router/index.ts` - إضافة راوت الأقسام

## كيفية الاستخدام

### للادمن:

1. **إدارة الأقسام**: انتقل إلى "الأقسام" في الـ sidebar
2. **إضافة موظف جديد**: اختر القسم والمسمى الوظيفي
3. **عروض الأسعار**: ارفع ملف PDF مع كل عرض سعر

### للموظف:

1. **عرض عروض الأسعار**: يمكن رؤية ملفات PDF المرفوعة من الادمن
2. **رفع ملف ممضي**: بعد إتمام الاتفاق، يمكن رفع ملف العقد الممضي

## الملفات المطلوبة للتنفيذ

### Backend API:

- `POST /api/departments` - إنشاء قسم جديد
- `GET /api/departments` - جلب جميع الأقسام
- `PUT /api/departments/:id` - تحديث قسم
- `DELETE /api/departments/:id` - حذف قسم

- `POST /api/price-offers` - إنشاء عرض سعر
- `GET /api/price-offers` - جلب عروض الأسعار
- `PUT /api/price-offers/:id` - تحديث عرض سعر
- `POST /api/price-offers/:id/upload` - رفع ملف

### Database Schema:

```sql
-- جدول الأقسام
CREATE TABLE departments (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  manager VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- تحديث جدول الموظفين
ALTER TABLE employees ADD COLUMN department_id VARCHAR(36);
ALTER TABLE employees ADD COLUMN position VARCHAR(255);
ALTER TABLE employees ADD FOREIGN KEY (department_id) REFERENCES departments(id);

-- جدول عروض الأسعار
CREATE TABLE price_offers (
  id VARCHAR(36) PRIMARY KEY,
  client_id VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'expired') DEFAULT 'pending',
  date DATE NOT NULL,
  admin_file VARCHAR(500),
  admin_file_name VARCHAR(255),
  employee_file VARCHAR(500),
  employee_file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id)
);
```

## ملاحظات مهمة

1. **الملفات**: حالياً يتم استخدام بيانات وهمية (mock data). يجب ربط النظام بـ API حقيقي
2. **رفع الملفات**: يجب إعداد نظام رفع ملفات حقيقي (مثل AWS S3 أو ملفات محلية)
3. **الأمان**: يجب إضافة التحقق من نوع الملفات وحجمها
4. **التصميم**: يمكن تحسين واجهة المستخدم حسب الحاجة

## الخطوات التالية

1. ربط النظام بـ API حقيقي
2. إعداد نظام رفع الملفات
3. إضافة المزيد من التحقق والتحسينات
4. اختبار النظام بشكل شامل
