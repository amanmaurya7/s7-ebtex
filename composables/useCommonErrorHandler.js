export const useCommonErrorHandler = (response) => {
    const nuxtApp = useNuxtApp();
    const { $showToast } = nuxtApp;
    const { t } = nuxtApp.$i18n;
    let message = response?._data?.message;

    if (response?.status === 401) {
        message = t('message.session_invalid');
        // sign out
    }
    console.error('error', response);

    return $showToast('error', message || t('message.api_error'));
};
