# מדריך הכנת אפליקציה לחנויות (Google Play / App Store)

## שלב 1: הכנת האפליקציה

### א) התקנת תלויות Capacitor
```
npm install
```

### ב) העלאת השרת לאינטרנט (חובה לאפליקציה!)
האפליקציה במובייל לא יכולה להגיע ל-localhost. צריך להעלות את השרת ל-Render/Railway/Vercel:

**אופציה מומלצת - Render.com (חינם):**
1. צור חשבון ב-https://render.com
2. לחץ "New Web Service"
3. חבר את ה-GitHub repository
4. הגדרות:
   - Build Command: `npm install`
   - Start Command: `node server/index.js`
   - הוסף משתנה סביבה: `YOUTUBE_API_KEY=AIzaSy...`
5. שמור את ה-URL שיתקבל (למשל: https://chef-ai.onrender.com)

### ג) עדכון כתובת השרת
צור קובץ `.env.production` בשורש הפרויקט:
```
VITE_API_URL=https://chef-ai.onrender.com
```

## שלב 2: בניית אפליקציית אנדרואיד 🤖

### דרישות:
- Android Studio מותקן (חינם): https://developer.android.com/studio
- JDK 17+

### פקודות:
```
npm run build
npx cap add android
npm run cap:sync
npm run cap:open:android
```

זה יפתח את Android Studio. שם:
1. לחץ Build → Generate Signed Bundle/APK
2. בחר "Android App Bundle" (AAB)
3. צור key store חדש ושמור פרטים
4. קבל קובץ .aab

### העלאה ל-Google Play:
1. צור חשבון מפתח ב: https://play.google.com/console ($25 חד פעמי)
2. צור אפליקציה חדשה
3. העלה את קובץ ה-AAB
4. מלא תיאור, תמונות, מדיניות פרטיות
5. שלח לבדיקה (עד 7 ימים)

## שלב 3: בניית אפליקציית iOS 🍎

### דרישות (חובה!):
- **מחשב Mac** (חובה - לא עובד בווינדוס!)
- Xcode מותקן (חינם מה-App Store)
- חשבון Apple Developer ($99/שנה)

### פקודות (על ה-Mac):
```
npm run build
npx cap add ios
npm run cap:sync
npm run cap:open:ios
```

זה יפתח Xcode. שם:
1. בחר את החשבון שלך בTeam
2. Product → Archive
3. העלה ל-App Store Connect

### העלאה ל-App Store:
1. היכנס ל: https://appstoreconnect.apple.com
2. צור אפליקציה חדשה
3. מלא פרטים, תמונות, תיאור
4. שלח לבדיקה (עד 3 ימים)

## שלב 4: PWA - התקנה מיידית ללא חנויות! ⚡

המשתמש יכול להתקין את האפליקציה **עכשיו** ישירות מהדפדפן:

### בטלפון אנדרואיד (Chrome):
1. פתח את האתר
2. תפריט (3 נקודות) → "הוסף למסך הבית"

### באייפון (Safari):
1. פתח את האתר
2. כפתור שיתוף → "הוסף למסך הבית"

זה יוצר אייקון על המסך הראשי, ונפתח כאפליקציה!

## סיכום עלויות

| פלטפורמה | עלות | חובה מק? |
|---------|------|---------|
| PWA | חינם | לא |
| Google Play | $25 חד פעמי | לא |
| App Store | $99 לשנה | כן |
