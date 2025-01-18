<script setup>
import EmailSentArt from '@/assets/svg/EX-Illustration-half-Email-Sent.svg';
import ResendIcon from '@/assets/svg/EX-Aid-Resend.svg';
import ErrorMessage from '~/components/Common/ErrorMessage.vue';
import TransparentButton from '@/components/Common/TransparentButton.vue';

const { requestPasswordReset } = useApi();
const route = useRoute();
const { email } = route.query;
const errorMessage = ref(null);
const loading = ref(false);
const { $router, $localePath } = useNuxtApp();

if (!email) {
    $router.push($localePath('/auth/login'));
}

const onClickResend = async () => {
    errorMessage.value = null;
    loading.value = true;
    const { error } = await requestPasswordReset({ email });
    errorMessage.value = error.value?.data?.message;
    loading.value = false;
};

</script>

<template>
  <div>
    <GatewayIllustration
      :title="$t('troubleshooting.title')"
      :image="EmailSentArt"
    />
    <Loading v-if="loading" />
    <div v-else-if="errorMessage" class="py-4 px-3">
      <ErrorMessage
        :message="$t('troubleshooting.sorry_fail_to_resend')"
      />
      <ErrorMessage
        class="mt-2"
        :message="errorMessage"
      />
    </div>
    <div v-else>
      <div class="text">
        {{ $t('troubleshooting.we_sent_a_password_email_to') }}
      </div>
      <div class="email-box">
        {{ email }}
      </div>
      <div class="text">
        {{ $t('troubleshooting.hint') }}
      </div>
    </div>
    <div class="auth-secondary-bottom-button py-4  gap-2" @click="onClickResend" style="margin-top: 5rem;">
      <TransparentButton>
        <template #content>
          <img :src="ResendIcon" width="12" height="12" class="tint-m3-500-filter">
          <span class="ml-2 text-m3-500">{{ $t('troubleshooting.resend_email') }}</span>
        </template>
      </TransparentButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text {
  font-size: 0.9375rem;
  text-align: center;
  padding: 1rem 0;
  line-height: 1.25rem;
  margin-right: 2rem;
  margin-left: 2rem;
}

.email-box {
  padding: 1rem 2rem;
  font-weight: bold;
  text-align: center;
  border: 1px solid var(--m3-a20);
  margin: 0 1rem;
  border-radius: 0.4rem;
  word-wrap: break-word;
}
</style>
