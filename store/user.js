import { defineStore } from 'pinia';
import { useAppStore } from '@/store/app';
import { useNotificationStore } from '@/store/notification';
import { useWalletStore } from '@/store/wallet';
import { useLayoutStore } from '@/store/layout';
import { usePreferenceStore } from './preference';

export const useUserStore = defineStore('user', () => {
    const token = ref(null);
    const userInfo = ref(null);
    const signupForm = ref({
        display_name: '',
        country: '',
        email: '',
        password: '',
        referral_code: '',
        progress: 0,
        phone: '+1-',
        external_user_id: null,
    });

    const clearSignupForm = () => {
        signupForm.value = {
            display_name: '',
            email: '',
            password: '',
            referral_code: '',
            progress: 0,
            phone: '+1-',
            external_user_id: null,
        };
    };

    const setToken = async (value) => {
        token.value = value;

        if (value) {
            await prepareUser();
            const { connectToAbly } = useLayoutStore();
            const { updateNotificationStatus } = useNotificationStore();
            const { getWallet } = useWalletStore();
            const { getUserPreferences } = usePreferenceStore();
            await Promise.all([
                getUserPreferences(),
                updateNotificationStatus(),
                getWallet(),
            ]);
            connectToAbly();
        }

        signupForm.value = {
            country: '',
            display_name: '',
            email: '',
            password: '',
            referral_code: '',
            progress: 0,
        };
    };

    const logout = ({ isForce }) => {

        if (!token.value) {
            return;
        }

        const { setHasMeInitialized } = useAppStore();
        const { clearNotifications } = useNotificationStore();
        const { resetWallet } = useWalletStore();
        const { resetPreferences } = usePreferenceStore();
        const { disconnectAbly } = useLayoutStore();
        const { $showToast, $i18n, $router, $localePath } = useNuxtApp();


        clearNotifications();
        setToken(null);
        setUserInfo(null);
        resetWallet();
        resetPreferences();
        disconnectAbly();
        setHasMeInitialized(false);

        if (isForce) {
            $showToast('error', $i18n.t('message.session_invalid'));
            setTimeout(() => $router.push($localePath('/')));
        }
    };

    const setUserInfo = async(userData) => {
        if (userData) {
            userInfo.value = {
                ...userData,
                fullName: userData.full_name,
            };
        } else {
            userInfo.value = null;
        }
    };

    const prepareUser = async () => {
        const { getMe } = useApi();
        const { data } = await getMe(null, {
            onResponseError: () => {
                // noop
            },
        });

        if (data.value) {
            setUserInfo(data.value);
        }
    };

    return {
        token, setToken,
        userInfo, setUserInfo,
        prepareUser,
        logout,
        signupForm,
        clearSignupForm,
    };
}, {
    persist: {
        storage: persistedState.cookiesWithOptions({
            sameSite: 'strict',
        }),
    },
});
