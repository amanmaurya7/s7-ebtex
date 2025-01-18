import { round, formatDate, htmlToPlainText, formatAmount } from '@/utils/formatters';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.globalProperties.$filters = {
        formatDate,
        round,
        htmlToPlainText,
        formatAmount,
    };
});
