import snsWebSdk from '@sumsub/websdk';
import { useApi } from '@/composables/useApi';

const { createPhoneVerificationKyc } = useApi();

export default function usePhoneVerificationKYC({ elId, onVerified }) {
    const { locale } = useNuxtApp().$i18n;

    const launchWebSdk = (token, phoneNumber) => {
        const snsWebSdkInstance = snsWebSdk.init(
            token,
            // token update callback, must return Promise
            async () => {
                const { data } = await createPhoneVerificationKyc();
                return data.value?.token;
            },
        )
            .withConf({
                lang: locale.value,
                phone: phoneNumber,
            })
            .on('onError', (error) => {
                console.log('onError', error, payload);
            })
            .onMessage((type) => {
                if (type === 'idCheck.applicantReviewComplete') {
                    onVerified();
                }
            })
            .build();
        snsWebSdkInstance.launch(`#${elId}`);
    };

    return {
        launchWebSdk,
    };
}
