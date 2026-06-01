import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// استيراد مباشر بدون كلمة locales لأن الملفات في نفس المجلد تماماً
// @ts-ignore
import translationAR from './ar.json';
// @ts-ignore
import translationEN from './en.json';

const resources = {
  ar: { translation: translationAR },
  en: { translation: translationEN }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;