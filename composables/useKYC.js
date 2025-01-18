import snsWebSdk from '@sumsub/websdk';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';

export default function useKYC({ elId }) {
    const { locale } = useNuxtApp().$i18n;
    const userStore = useUserStore();
    const { userInfo } = storeToRefs(userStore);
    const { getKYCAccessToken } = useApi();

    const launchWebSdk = (accessToken) => {
        const snsWebSdkInstance = snsWebSdk.init(
            accessToken,
            // token update callback, must return Promise
            async () => {
                const { data } = await getKYCAccessToken();
                return data.value?.token;
            },
        )
            .withConf({
                lang: locale.value,
                email: userInfo.email,
                phone: userInfo.phone,
            })
            .on('onError', (error) => {
                console.log('onError', error, payload);
            })
            .onMessage((type, payload) => {
                console.log('onMessage', type, payload);
            })
            .build();
        snsWebSdkInstance.launch(`#${elId}`);
    };

    onMounted(async () => {
        await nextTick();
        const { data } = await getKYCAccessToken();
        if (data.value?.token) {
            launchWebSdk(data.value.token);
        }
    });

    return {};
}
