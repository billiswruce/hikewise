import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./locales/en/translation.json";
import translationSV from "./locales/sv/translation.json";
import translationJA from "./locales/ja/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationES from "./locales/es/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEN,
    },
    sv: {
      translation: translationSV,
    },
    ja: {
      translation: translationJA,
    },
    fr: {
      translation: translationFR,
    },
    es: {
      translation: translationES,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
