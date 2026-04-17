# i18n System - Complete Fix & Implementation Guide

## ✅ Issues Fixed

### 1. **React Context Error**: "Cannot read properties of null (reading 'useContext')"
   - **Problem**: `useI18n()` was being called outside the `I18nProvider` wrapper
   - **Root Cause**: In `Index.tsx`, the hook was called at the module level instead of inside the component
   - **Fix**: Moved `const { t } = useI18n()` inside the `Index()` component function

### 2. **Language Toggle Not Working**
   - **Problem**: No UI to change language
   - **Fix**: Created `LanguageToggle.tsx` component with dropdown menu
   - **Added to**: Auth page, Landing page, and Settings section

### 3. **Hardcoded Mixed Languages**
   - **Problem**: Text was hardcoded in Swahili, English, and mixed languages throughout the app
   - **Fixed Components**:
     - ✅ `Landing.tsx` - All hardcoded Swahili replaced with translation keys
     - ✅ `Auth.tsx` - Form labels, buttons, and messages now use translations
     - ✅ `BottomNav.tsx` - Navigation labels now use translations
     - ✅ `HeroSection.tsx` - Greeting texts and appointment labels use translations
     - ✅ `SettingsSection.tsx` - All labels now use translations
     - ✅ `Index.tsx` - Section titles use translations

### 4. **Inconsistent Translations**
   - **Problem**: Translation keys were incomplete or missing
   - **Fix**: Expanded translation files with all needed keys organized by feature:
     - `common` - Shared strings (appName, login, logout, language, etc.)
     - `landing` - Landing page content
     - `auth` - Authentication forms
     - `dashboard` - Dashboard components
     - `nav` - Navigation items
     - `overlay` - Overlay section titles
     - `settings` - Settings page items

### 5. **Missing localStorage Persistence**
   - **Problem**: Language selection was not persisted across sessions
   - **Fix**: Enhanced `useI18n` hook to save and load language preference from localStorage

---

## 🎯 System Architecture

### Translation Hook: `useI18n.tsx`

```typescript
interface I18nContextType {
  lang: Language;           // Current language ('en' or 'sw')
  setLang: (lang: Language) => void;  // Function to change language
  t: (path: string) => string;        // Function to get translations
}
```

**Features:**
- ✅ Automatically loads translations from JSON files
- ✅ Saves language preference to localStorage
- ✅ Provides loading state while translations are being fetched
- ✅ Nested key support: `t('dashboard.greetingMorning')`
- ✅ Fallback to key name if translation not found

### Provider Wrapper: `I18nProvider`

Located at top level in `App.tsx`:
```tsx
<I18nProvider>
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
</I18nProvider>
```

---

## 📝 Translation Files

### File Structure
```
src/i18n/
├── en.json          # English translations (comprehensive)
└── sw.json          # Swahili translations (all keys matched)
```

### Example Translation Entry
```json
{
  "dashboard": {
    "title": "MedFlow",
    "greetingMorning": "Good Morning",
    "patients": "Patients"
  }
}
```

---

## 🔧 How to Use

### In Your Components

**1. Import the hook:**
```tsx
import { useI18n } from "@/hooks/useI18n";
```

**2. Use in component:**
```tsx
export function MyComponent() {
  const { t, lang, setLang } = useI18n();

  return (
    <div>
      <h1>{t('common.appName')}</h1>
      <p>Current language: {lang}</p>
      <button onClick={() => setLang('en')}>English</button>
      <button onClick={() => setLang('sw')}>Swahili</button>
    </div>
  );
}
```

### Adding New Translations

**1. Add the key to both translation files:**

`src/i18n/en.json`:
```json
{
  "newFeature": {
    "title": "My New Feature",
    "description": "Feature description"
  }
}
```

`src/i18n/sw.json`:
```json
{
  "newFeature": {
    "title": "Sifa Yangu Mpya",
    "description": "Maelezo ya sifa"
  }
}
```

**2. Use in your component:**
```tsx
<h2>{t('newFeature.title')}</h2>
<p>{t('newFeature.description')}</p>
```

---

## 🎨 Language Toggle Component

### Usage
```tsx
import { LanguageToggle } from "@/components/LanguageToggle";

// Add to your component
<LanguageToggle />
```

### Features
- Dropdown menu with language options
- Shows checkmark for current language
- Automatically updates all UI when language changes
- Persists selection to localStorage

### Currently Placed In:
- 🔗 Navigation bar (Landing page)
- 🔗 Settings section (Dashboard)
- 🔗 Auth page (login/signup)

---

## 🚀 Workflow for Language Updates

### Changing User's Language Preference
```tsx
const { setLang } = useI18n();

// User selects English
setLang('en');

// User selects Swahili
setLang('sw');
```

### Getting Current Language
```tsx
const { lang } = useI18n();
console.log(lang); // "en" or "sw"
```

### Accessing Any Translation
```tsx
const { t } = useI18n();

// Basic translation
t('common.appName')          // "MedFlow"

// Nested keys
t('dashboard.greetingMorning') // "Good Morning" or "Habari za asubuhi"

// If key doesn't exist, returns the key name
t('nonexistent.key')         // "nonexistent.key" (with console warning)
```

---

## 📊 Translation Keys Reference

### Common
- `common.appName` - "MedFlow"
- `common.login` - "Login" / "Ingia"
- `common.logout` - "Logout" / "Ondoka"
- `common.language` - "Language" / "Lugha"

### Dashboard
- `dashboard.greetingMorning` - Morning greeting
- `dashboard.patients` - "Patients" / "Wagonjwa"
- `dashboard.alerts` - "Alerts" / "Arifa"
- `dashboard.records` - "Records" / "Rekodi"

### Navigation
- `nav.home` - Home button
- `nav.patients` - Patients button
- `nav.records` - Records button
- `nav.alerts` - Alerts button
- `nav.settings` - Settings button

### Auth
- `auth.login` - "Login" / "Ingia"
- `auth.signup` - "Sign Up" / "Jisajili"
- `auth.email` - "Email" / "Barua Pepe"
- `auth.password` - "Password" / "Nenosiri"

---

## ✨ Best Practices

### 1. **Always Use Translation Keys**
```tsx
// ✅ Good
<button>{t('common.login')}</button>

// ❌ Avoid
<button>Login</button>
```

### 2. **Add Keys to Both Files Simultaneously**
```tsx
// When adding a new feature, update BOTH en.json and sw.json
// This ensures consistency across languages
```

### 3. **Use Nested Keys Logically**
```json
// ✅ Good - organized by feature
{
  "settings": {
    "title": "Settings",
    "notifications": "Notifications",
    "privacy": "Privacy"
  }
}

// ❌ Avoid - flat structure with long names
{
  "settings_title": "Settings",
  "settings_notifications": "Notifications"
}
```

### 4. **Context Must Be Available**
```tsx
// ✅ Works - inside I18nProvider context
function Index() {
  const { t } = useI18n(); // OK
}

// ❌ Won't work - outside context
const t = useI18n(); // ❌ Error
function Index() {
  return <Component />; // Won't render
}
```

### 5. **Provide Fallbacks When Appropriate**
```tsx
// If a translation might not exist, provide a fallback
<img src={icon} alt={t(`settings.${itemName}`) || itemName} />
```

---

## 🔍 Checking Current Setup

### Verify the Provider is Wrapping App:
```tsx
// ✅ In App.tsx
<I18nProvider>
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
</I18nProvider>
```

### Verify localStorage Persistence:
```tsx
// You can test in browser console:
localStorage.getItem('lang'); // Returns "en" or "sw"

// Change language in UI
// Refresh page - language should persist
```

### Debug Missing Translations:
```tsx
// Open browser console - warnings for missing keys:
// "Missing translation key: some.missing.key"
```

---

## 🐛 Troubleshooting

### Issue: "useI18n must be used within I18nProvider"
**Solution**: Ensure component is rendered inside the I18nProvider hierarchy (in App.tsx)

### Issue: Language doesn't persist after refresh
**Solution**: Check if localStorage is enabled in browser and if `setLang()` is being called properly

### Issue: Seeing key names instead of translations (e.g., "dashboard.title")
**Solution**: The translation key doesn't exist. Check JSON files for exact spelling and nesting

### Issue: Slow page load when changing language
**Solution**: This is expected as translations are loaded dynamically. Loading spinner is shown during this time

---

## 📦 Files Modified/Created

### Created:
✅ `src/components/LanguageToggle.tsx` - Language dropdown component

### Modified:
✅ `src/hooks/useI18n.tsx` - Enhanced with better error handling & loading states
✅ `src/i18n/en.json` - Expanded with comprehensive keys
✅ `src/i18n/sw.json` - Expanded with comprehensive keys
✅ `src/pages/Index.tsx` - Fixed useI18n hook position
✅ `src/pages/Landing.tsx` - Replaced hardcoded Swahili with translations
✅ `src/pages/Auth.tsx` - Replaced hardcoded mixed text with translations
✅ `src/components/BottomNav.tsx` - Uses translation keys for labels
✅ `src/components/sections/HeroSection.tsx` - Uses translation keys
✅ `src/components/sections/SettingsSection.tsx` - Uses translation keys + LanguageToggle

---

## 🎓 Complete Example Component

```tsx
import { useI18n } from "@/hooks/useI18n";
import { LanguageToggle } from "@/components/LanguageToggle";

export function ExampleComponent() {
  const { t, lang, setLang } = useI18n();

  return (
    <div className="space-y-4">
      {/* Header with current language */}
      <h1>{t('common.appName')}</h1>
      <p>Current language: {lang}</p>

      {/* Language toggle */}
      <LanguageToggle />

      {/* Dynamic content based on language */}
      <div>
        <h2>{t('dashboard.patients')}</h2>
        <p>{t('dashboard.greetingMorning')}</p>
      </div>

      {/* Manual language switching */}
      <button onClick={() => setLang('en')}>
        {t('common.english')}
      </button>
      <button onClick={() => setLang('sw')}>
        {t('common.swahili')}
      </button>
    </div>
  );
}
```

---

## ✅ Verification Checklist

- [x] No more "useContext is null" errors
- [x] Language toggle appears in all key locations
- [x] Text updates immediately when language changes
- [x] Language selection persists after page refresh
- [x] All visible text uses translation keys
- [x] Translations exist for all keys in both languages
- [x] App starts without compilation errors
- [x] Loading spinner shows while translations load
- [x] localStorage saves language preference

---

## 📚 Summary

Your i18n system is now:
- **Professional**: Properly structured with React Context
- **Scalable**: Easy to add new languages
- **Persistent**: Remembers user's language preference
- **Complete**: All UI text uses translation system
- **Error-Free**: No console errors or warnings
- **User-Friendly**: Clean language toggle in UI

Happy translating! 🌍
