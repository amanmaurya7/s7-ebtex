import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';

export default defineNuxtRouteMiddleware((to, from) => {
    const { token } = storeToRefs(useUserStore());
    const nuxtApp = useNuxtApp();
    const { $localePath, $i18n } = nuxtApp;
    if (!token.value) {
        return navigateTo({
            path: $localePath('/auth/login'),
            query: {
                hint: $i18n.t('login.must_sign_in_hint'),
                redirectURL: to.fullPath,
            },
        });
    }
});
