<script setup>
import EmailSentArt from '@/assets/svg/EX-Illustration-half-Email-Sent.svg';
import ResendIcon from '@/assets/svg/EX-Aid-Resend.svg';
import ErrorMessage from '~/components/Common/ErrorMessage.vue';

const { onClickEmailVerify } = useProfile();
const loading = ref(false);
const { userInfo } = useProfile();

const onClickResend = async () => {
    loading.value = true;
    await onClickEmailVerify();
    loading.value = false;
};

const email = userInfo.value.email;

</script>

<template>
  <div>
    <GatewayIllustration
      :title="$t('email_verification.title')"
      :image="EmailSentArt"
    />
    <Loading v-if="loading" />
    <div v-else-if="errorMessage" class="py-4 px-3">
      <ErrorMessage
        class="mt-2"
        :message="errorMessage"
      />
    </div>
    <div v-else>
      <div class="text">
        {{ $t('email_verification.request_hint') }}
      </div>
      <div class="email-box">
        {{ email }}
      </div>
      <div class="text">
        {{ $t('email_verification.request_hint_2') }}
      </div>
    </div>
    <div
      class="auth-secondary-bottom-button gap-2" 
      style="margin-top: 5rem;"
      @click="onClickEmailVerify"
    >
      <img :src="ResendIcon" width="12" height="12" class="tint-m3-500-filter">
      {{ $t('troubleshooting.resend_email') }}
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
