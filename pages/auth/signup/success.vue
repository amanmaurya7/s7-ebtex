<script setup>
import EmailSentArt from '@/assets/svg/EX-Illustration-half-Email-Sent.svg';
import ResendIcon from '@/assets/svg/EX-Aid-Resend.svg';
import IconExplore from '@/assets/svg/EX-Icon-Explore.svg';
import OrLine from '@/components/Common/OrLine.vue';
import GradientButton from '@/components/Common/GradientButton.vue';
import Loading from '@/components/Loading.vue';
import TransparentButton from '@/components/Common/TransparentButton.vue';
const { $showToast, $localePath } = useNuxtApp();
const { requestEmailVerification } = useApi();

const route = useRoute();
const email = decodeURIComponent(route.query.email) || '';

const onExploreHotEventClick = () => {
    navigateTo($localePath('/explore/tags/hot'));
};

const isLoading = ref(false);
const onClickResend = async () => {
    isLoading.value = true;
    const { error } = await requestEmailVerification({ email });
    if (error.value) {
        $showToast('error', error.value);
    }
    isLoading.value = false;
};
</script>

<template>
  <div>
    <GatewayIllustration
      :title="$t('signup.title')"
      :image="EmailSentArt"
    />
    <Loading v-if="isLoading" />
    <div v-else>
      <div class="wrapper">
        <div class="text-center">
          <div class="text">
            {{ $t('signup.we_sent_a_confirmation_email_to') }}
          </div>
          <div class="email-box my-4">
            {{ email }}
          </div>
          <div class="text">
            {{ $t('signup.email_verification_hint') }}
          </div>
        </div>
      </div>
      <OrLine />
      <div class="mx-3">
        <GradientButton @click="onExploreHotEventClick">
          <template #content>
            <img :src="IconExplore" alt="arrow-right" width="18">
            <span class="inline-block ml-2">
              {{ $t('signup.explore_hot_events') }}
            </span>
          </template>
        </GradientButton>
      </div>
      <div
        class="auth-secondary-bottom-button gap-2 mt-4 py-3" 
        @click="onClickResend"
      >
        <TransparentButton @click="onClickResend">
          <template #content>
            <img :src="ResendIcon" width="12" height="12" class="tint-m3-500-filter">
            <span class="ml-2 text-m3-500">{{ $t('troubleshooting.resend_email') }}</span>
          </template>
        </TransparentButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.wrapper {
  padding: 2rem 1.5rem 0;
}

.text {
  font-size: 0.9375rem;
  text-align: center;
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
