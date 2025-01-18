export const useDepositWithdrawButton = async () => {

    const { hasVerifiedIdentity, hasVerifiedEmail } = useProfile();
    const { showToastWithRedirect } = useToastWithRedirect();
    const { $localePath, $i18n } = useNuxtApp();

    const onDepositClick = () => {
        if (hasVerifiedEmail) {
            navigateTo($localePath('/deposit'));
        } else {
            showToastWithRedirect(
                'warning',
                $i18n.t('error.please_verify_email_before_deposit'),
                $localePath('/profile'),
            );
        }
    };

    const onWithdrawClick = () => {
        const runtimeConfig = useRuntimeConfig();
        if (hasVerifiedIdentity || runtimeConfig.public.skipKYC) {
            navigateTo($localePath('/withdrawal'));
        } else {
            showToastWithRedirect(
                'warning',
                $i18n.t('error.please_verify_identity_before_withdraw'),
                $localePath('/auth/signup/verify'),
            );
        }
    };

    return {
        onDepositClick,
        onWithdrawClick,
    };
};
