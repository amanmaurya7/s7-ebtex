import { MY_AFFILIATE_CACHE_KEY  } from '@/pages/constants';

export default defineNuxtRouteMiddleware((to) => {
    if (process.server) {
        return;
    }
    if (to.query.referral) {
        window.localStorage.setItem(MY_AFFILIATE_CACHE_KEY, to.query.referral);
    }
});