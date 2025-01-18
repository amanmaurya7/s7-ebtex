import { BETTING_RESULT } from '@/pages/constants';
import { useBettingInfoStore } from '@/store/bettingInfo';
import { storeToRefs } from 'pinia';
import nuxtStorage from 'nuxt-storage';
import { LOGIN_RESUME_KEY } from '@/pages/constants';

export default function useBettingResult() {
    const { t } = useNuxtApp().$i18n;
    const { params: { eventId }, query: { result, message: queryMessage, statusCode } } = useRoute();
    const bettingInfoStoreStore = useBettingInfoStore();
    const { bettingInfo, outcome } = storeToRefs(bettingInfoStoreStore);
    const { clearBettingInfo, debuggingInfo } = bettingInfoStoreStore;
    const isSuccess = computed(() => result === BETTING_RESULT.SUCCESS);
    const title = computed(() => isSuccess.value ? t('betting_result.success') : t('betting_result.failed'));

    onUnmounted(() => {
        nuxtStorage.localStorage.setData(LOGIN_RESUME_KEY, null);
        clearBettingInfo();
    });

    return {
        eventId,
        isSuccess,
        title,
        debuggingInfo,
        bettingInfo,
        outcome,
    };
}
