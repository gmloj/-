# قائمة التحقق لنشر تطبيق «قبل يفوتك» على App Store & TestFlight

تم إعداد وتجهيز ملفات تكوين الإنتاج لتطبيق **«قبل يفوتك»** (Qably Foutak) وفق معايير Expo Application Services (EAS) ومتجر أبل (Apple App Store).

---

## 1. ما تم تجهيزه داخل المشروع
- [x] **ملف تكوين التطبيق (`app.json`):**
  - اسم التطبيق الرسمي: **«قبل يفوتك»**
  - معرف الحزمة المؤقت (Bundle Identifier): `com.qablyfoutak.app`
  - إصدار التطبيق: `1.0.0` برقم بناء مبدئي `1`
  - وضع العرض: `portrait` مع واجهة داكنة `dark`
  - أيقونة التطبيق: `./assets/icon.png`
  - شاشة البداية (Splash Screen): `./assets/splash.png` بلون خلفية `#070A12`
  - الصلاحيات المحددة فقط:
    - **الكاميرا (`NSCameraUsageDescription`):** لمسح الفواتير وتحليل قرارات الشراء الذكية.
    - **الميكروفون (`NSMicrophoneUsageDescription`):** لتسجيل المصاريف اليومية عبر الأوامر الصوتية السريعة.
    - تم استبعاد صلاحيات الموقع الجغرافي لعدم استخدامها في التطبيق وتجنب رفض المراجعة من أبل.
- [x] **ملف البناء السحابي (`eas.json`):**
  - **ملف التطوير (`development`):** يدعم محاكي iOS وعميل التطوير الداخلي.
  - **ملف المعاينة (`preview`):** مع تفعيل الزيادة التلقائية لرقم البناء (`autoIncrement: true`).
  - **ملف الإنتاج (`production`):** مخصص لحزم إنتاج iOS الحقيقية مع زيادة تلقائية لرقم البناء قبل الرفع لـ TestFlight وApp Store.
- [x] **فحص سلامة TypeScript والإنتاج:** جميع الملفات الحالية تعمل بدون أخطاء برمجية.

---

## 2. معرّف الحزمة (Bundle Identifier)
- **المعرّف الحالي المعتمد:**
  ```text
  com.qablyfoutak.app
  ```
  *(إذا كان لديك Bundle Identifier محجوز مسبقاً في حساب مطوري أبل الخاص بك، يرجى استبداله في `app.json` قبل بدء أول عملية بناء).*

---

## 3. ما بقي مطلوباً من حساب Apple Developer
1. **الاشتراك النشط في Apple Developer Program:**
   - يلزم حساب نشط ($99/سنوياً) على [developer.apple.com](https://developer.apple.com).
2. **تسجيل الدخول إلى Expo EAS:**
   ```bash
   npm install -g eas-cli
   eas login
   ```
3. **الربط التلقائي للشهادات (Apple Credentials):**
   - عند تشغيل أمر البناء لأول مرة، سيطلب منك EAS تسجيل الدخول بحساب Apple Developer لإنشاء:
     - Apple Distribution Certificate
     - Provisioning Profile
     - App Store Connect API Key (لتسهيل الرفع التلقائي)

---

## 4. أوامر البناء السحابي عبر EAS
- **بناء نسخة الإنتاج لـ iOS (لـ TestFlight و App Store):**
  ```bash
  eas build --platform ios --profile production
  ```
- **بناء نسخة تجريبية للمحاكي (اختياري للاختبار المحلي):**
  ```bash
  eas build --platform ios --profile development
  ```

---

## 5. أوامر الرفع إلى TestFlight و App Store
بمجرد انتهاء أمر البناء بنجاح عبر سحابة EAS:
- **رفع الحزمة المبنية مباشرة إلى TestFlight:**
  ```bash
  eas submit --platform ios
  ```
- أو دمج البناء والرفع في خطوة واحدة مستقبلاً:
  ```bash
  eas build --platform ios --profile production --auto-submit
  ```

---

## 6. البيانات المطلوبة داخل App Store Connect
عند فتح التطبيق في [appstoreconnect.apple.com](https://appstoreconnect.apple.com):
1. **اسم التطبيق:** قبل يفوتك
2. **العنوان الفرعي (Subtitle):** رفيق قراراتك المالية واليومية الذكي
3. **الفئة الرئيسية:** Finance (المالية) أو Utilities (الأدوات)
4. **التصنيف العمري (Age Rating):** 4+
5. **رابط سياسة الخصوصية (Privacy Policy URL):** رابط صفحة سياسة الخصوصية الخاصة بك.
6. **لقطات الشاشة (Screenshots):**
   - 6.7" Display (iPhone 16 Pro Max / 15 Pro Max) - إلزامي.
   - 6.5" أو 5.5" Display للأجهزة السابقة (اختياري/موصى به).
7. **معلومات جهة الاتصال للدعم الفني (Support URL & Marketing URL).**

---

## 7. تنبيه مهم للخصوصية والموافقة
- لم يتم تنفيذ أي عملية رفع (`eas submit`) أو بناء تلقائي حفاظاً على سرية بيانات حسابك وأذونات Apple Developer.
- جميع الخطوات أصبحت جاهزة تماماً ومطابقة لمتطلبات متجر أبل.
