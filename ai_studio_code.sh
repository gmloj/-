# 1. بناء ملفات الإنتاج للتطبيق
npm run build

# 2. تثبيت أدوات Capacitor الخاصة بـ iOS
npm install @capacitor/core @capacitor/cli @capacitor/ios

# 3. تهيئة التطبيق باسم وهوية مخصصة
npx cap init "دبّرني" "com.dabbirni.app" --web-dir dist

# 4. إضافة منصة iOS
npx cap add ios

# 5. نسخ الملفات وفتح المشروع في Xcode
npx cap sync
npx cap open ios