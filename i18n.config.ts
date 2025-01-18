import en from './assets/locales/en';
import ja from './assets/locales/ja';

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages: { en, ja },
    warnHtmlMessage: false,
}));
