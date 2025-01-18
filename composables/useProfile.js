import { useUserStore } from '@/store/user';
import moment from 'moment';
import { storeToRefs } from 'pinia';

export default function useProfile() {
    const { t } = useNuxtApp().$i18n;
    const { $localePath, $showToast } = useNuxtApp();
    const { uploadFile, updateProfile, requestEmailVerification, getKYC } = useApi();
    const userStore = useUserStore();
    const { userInfo } = storeToRefs(userStore);
    const { prepareUser } = userStore;

    let hasPendingKYC = ref(false);
    getKYC({
        // noop on kyc 404
        onResponseError: () => {},
        onResponse: ({ response }) => {
            if (!userInfo.value.identity_verified && !!response._data.is_pending) {
                hasPendingKYC = true;
            }
        },
    });

    const hasVerifiedIdentity = userInfo.value.identity_verified;
    const hasVerifiedEmail = userInfo.value.email_verified;
    const isMyReferralCodeValid = computed(() => {
        const isExpired = !!userInfo.value.referral_code_expires_at && moment().isAfter(userInfo.value.referral_code_expires_at);
        return userInfo.value.referral_code && userInfo.value.referral_code_quota > 0 && !isExpired;
    });
    const identityVerificationHint = computed(() => {
        return hasVerifiedIdentity
            ? t('profile.identity_verified_hint')
            : hasPendingKYC
                ? t('profile.pending_kyc_hint')
                : t('profile.identity_unverified_hint');
    });

    const previewAvatar = ref();
    const formData = reactive({
        first_name: userInfo.value?.first_name || '',
        last_name: userInfo.value?.last_name || '',
        display_name: userInfo.value?.display_name || '',
        avatar: userInfo.value?.avatar || '',
    });
    const fieldsInvalid = computed(() => ({
        // first_name: !formData.first_name,
        // last_name: !formData.last_name,
    }));
    
    const invalidFields = computed(() => Object.keys(fieldsInvalid.value).filter(key => fieldsInvalid.value[key]));

    const isSaving = ref(false);
    const onSaveProfile = async (profileFormData) => {
        isSaving.value = true;
        const avatarFile = profileFormData.avatar;
        const { ...formDataToPost } = profileFormData;
        if (avatarFile && avatarFile !== userInfo.value.avatar) {
            const { data, error } = await uploadFile(avatarFile);
            if (!error.value) {
                formDataToPost.avatar = data.value.url;
            } else {
                isSaving.value = false;
                $showToast('error', t('error.failed_to_upload_avatar'), null, null, 'PROFILE');
                return;
            }
        }
        const payload = { ...formDataToPost };
        if (userInfo.value.identity_verified) {
            delete payload.first_name;
            delete payload.middle_name;
            delete payload.last_name;
        }
        const { error } = await updateProfile(payload);
        if (!error.value) {
            await prepareUser();
            formData.avatar = '';
            $showToast('success', t('message.profile_updated'));
        }
        isSaving.value = false;
    };

    const onClickSave = async () => {
        await onSaveProfile(formData);
    };

    const onClickVerify = async () => {
        if (!userInfo.value.redo_kyc && invalidFields.value.length) {
            $showToast('error', t('error.please_fill_in_required_fields'));
            return;
        }
        navigateTo($localePath('/auth/signup/verify'));
    };

    const goEmailVerify = () => {
        requestEmailVerification();
        navigateTo({
            path: $localePath('/auth/email-verification/request'),
            query: { email: userInfo.value.email },
        });
    };

    const onClickEmailVerify = async () => {
        const { error } = await requestEmailVerification();
        if (!error.value) {
            $showToast('success', t('message.verification_email_sent'));
        }
    };

    const onSelectAvatar = (event) => {
        if (!event.target.files.length) {
            return;
        }
        const file = event.target.files[0];
        const avatarForm = new FormData();
        avatarForm.append('file', file);
        formData.avatar = avatarForm;
        previewAvatar.value = URL.createObjectURL(file);
    };

    const onClickDeleteAvatar = () => {
        formData.avatar = '';
        previewAvatar.value = null;
    };

    const copyReferralCode = async () => {
        try {
            await navigator.clipboard.writeText(userInfo.value.referral_code);
            $showToast('success', t('message.success_copy'));
        } catch (err) {
            $showToast('error', t('error.failed_to_copy'));
        }
    };

    return  {
        isSaving,
        prepareUser,
        userInfo,
        hasPendingKYC,
        formData,
        previewAvatar,
        hasVerifiedIdentity,
        hasVerifiedEmail,
        isMyReferralCodeValid,
        onClickSave,
        onClickVerify,
        goEmailVerify,
        onClickEmailVerify,
        onSelectAvatar,
        onClickDeleteAvatar,
        copyReferralCode,
        identityVerificationHint,
    };
}
