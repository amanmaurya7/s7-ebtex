import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
import { useWalletStore } from '@/store/wallet';
import { useAppStore } from '@/store/app';
import { usePreferenceStore } from '@/store/preference';

export default defineNuxtRouteMiddleware(async () => {
    const userStore = useUserStore();
    const walletStore = useWalletStore();
    const preferenceStore = usePreferenceStore();
    const { token } = storeToRefs(userStore);
    const { getMe }= useApi();
    const { setToken, setUserInfo } = userStore;
    const { getWallet, resetWallet } = walletStore;
    const { getUserPreferences, resetPreferences } = preferenceStore;
    const { hasMeInitialized, setHasMeInitialized } = useAppStore();

    if(!hasMeInitialized && token.value) {
        const { data, error } = await getMe({}, {
            onRequest({ options }) {
                options.headers = {
                    Authorization: `Bearer ${token.value}`,
                };
            },
        });

        if(!error.value && data.value) {
            setUserInfo(data.value);
            getWallet();
            getUserPreferences();
        } else {
            setToken(null);
            resetWallet();
            resetPreferences();
        }
    }
    setHasMeInitialized(true);
});
