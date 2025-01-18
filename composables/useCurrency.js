import { useWalletStore } from '@/store/wallet';
import { storeToRefs } from 'pinia';

export const useCurrency = () => {
    const { t } = useNuxtApp().$i18n;
    const { currency } = storeToRefs(useWalletStore());
    return t(`currency.${currency.value}`);
};
