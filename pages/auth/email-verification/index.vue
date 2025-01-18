<script setup>
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
import EmailErrorArt from '@/assets/svg/EX-Illustration-half-Email-Issue.svg';
import GradientButton from '@/components/Common/GradientButton.vue';
import OrLine from '@/components/Common/OrLine.vue';
import IconExplore from '@/assets/svg/EX-Icon-Explore.svg';

const { showToastWithRedirect } = useToastWithRedirect();
const { t } = useI18n();
const route = useRoute();
const { $router, $localePath } = useNuxtApp();
const { verifyEmail } = useApi();
const userStore = useUserStore();
const { userInfo, token: userToken } = storeToRefs(userStore);

const shouldShowError = ref(false);

const errorMessage = ref('');
const { email, token } = route.query;
if (!email || !token) {
    errorMessage.value = t('email_verification.failed');
    shouldShowError.value = true;
} else if (userInfo.value && userInfo.value.email !== email) {
    errorMessage.value = t('email_verification.failed_email_mismatch');
    shouldShowError.value = true;
} else {
    const { error } = await verifyEmail(email.replaceAll(' ', '+'), token);
    if (!error.value) {
        if (userToken.value) {
            await userStore.prepareUser();
            $router.replace($localePath('/auth/login/troubleshooting/welcome?email_verified=1'));
        } else {
            setTimeout(() => {
                showToastWithRedirect(
                    'success',
                    t('email_verification.success_please_login'),
                    $localePath('/auth/login'),
                );
            }, 100);
        }
    } else {
        errorMessage.value = t('email_verification.failed');
        shouldShowError.value = true;
    }
}
</script>

<template>
  <div v-show="shouldShowError" stlye="padding-bottom: 2rem;">
    <GatewayIllustration
      :title="$t('troubleshooting.title_something_went_wrong')"
      :image="EmailErrorArt"
    />
    <div class="text-center wrapper" v-html="$t('troubleshooting.hint_failed')" />

    <div class="wrapper">
      <GradientButton tint="yellow" @click="$router.replace(localePath('/profile'))">
        <template #content>
          <div class="flex gap-2">
            <img src="/images/v1.5/icon-mail.png" alt="deposit" widh="18" height="18">
            <span style="font-size:0.9375rem !important;">
              {{ $t('troubleshooting.try_again') }}
            </span>
          </div>
        </template>
      </GradientButton>
      <OrLine />
      <GradientButton class="mb-3" @click="$router.push(localePath('/explore/categories'))">
        <template #content>
          <div class="flex gap-2">
            <img :src="IconExplore" alt="explore" widh="18" height="18">
            <span style="font-size:0.9375rem !important;">
              {{ $t('troubleshooting.explore_events') }}
            </span>
          </div>
        </template>
      </GradientButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.p-card) {
  margin: 0 1.25rem;
}

:deep(.result) {
  min-height: 195px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.wrapper {
    padding: 1.25rem 1rem;
}
</style>
