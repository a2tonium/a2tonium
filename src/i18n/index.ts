import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(HttpBackend) // Подключение backend для загрузки переводов
    .use(LanguageDetector) // Автоматическое определение языка
    .use(initReactI18next) // Интеграция с React
    .init({
        fallbackLng: "en", // Язык по умолчанию
        debug: true, // Для отладки
        backend: {
            loadPath: "/locales/{{lng}}/translation.json", // Путь к файлам переводов
        },
        interpolation: {
            escapeValue: false, // React сам экранирует текст
        },
    });

export default i18n;
