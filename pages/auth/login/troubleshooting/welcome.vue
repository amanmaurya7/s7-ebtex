<script setup>
import GatewayIllustration from '@/components/Gateway/Illustration';
import ForgetPasswordArt from '@/assets/svg/EX-Illustration-half-Password-Reset.svg';
import GradientButton from '@/components/Common/GradientButton';
import { useUserStore } from '@/store/user';
import { useWalletStore } from '@/store/wallet';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import OrLine from '@/components/Common/OrLine';
import IconEmail from '@/assets/svg/EX-Icon-Email.svg';
import IconPortfolio from '@/assets/svg/EX-Icon-Portfolio.svg';
import IconExplore from '@/assets/svg/EX-Icon-Explore.svg';
import IconDeposit from '@/assets/svg/EX-Icon-Deposit.svg';
import { LOGIN_RESUME_KEY } from '@/pages/constants';
import nuxtStorage from 'nuxt-storage';


const userStore = useUserStore();
const router = useRouter();
const { userInfo, token } = storeToRefs(userStore);
const { balance } = storeToRefs(useWalletStore());
const emailJustVerified = !!useRoute().query.email_verified;

if (!token.value) {
    router.push('/auth/login');
}

const emailVerificationRequired = computed(() => {
    return !(userInfo.value?.email_verified);
});
const depositRequired = computed(() => balance.value === 0);
const resumeStringifiedData = nuxtStorage.localStorage.getData(LOGIN_RESUME_KEY);
const havePendingWager = !!resumeStringifiedData;
</script>

<template>
  <div>
    <GatewayIllustration
      :title="$t(emailJustVerified ? 'troubleshooting.title_email_verified' : 'troubleshooting.title_welcome')"
      :image="ForgetPasswordArt"
    />
    <div class="wrapper">
      <div v-if="!emailJustVerified" class="message" v-html="$t('troubleshooting.you_password_has_been_reset')" />
      <div
        v-if="emailJustVerified"
        class="message"
        v-html="$t('troubleshooting.email_just_verification_hint')"
      />
      <div
        v-if="emailVerificationRequired"
        class="message"
        v-html="$t('troubleshooting.email_verification_hint')"
      />
      <div
        v-else-if="depositRequired"
        class="message"
        v-html="$t('troubleshooting.deposit_hint')"
      />
      <div
        v-else-if="havePendingWager"
        class="message"
        v-html="$t('troubleshooting.pending_wagers_hint')"
      />
    </div>

    <div style="padding: .5rem 1rem">
      <GradientButton v-if="emailVerificationRequired" tint="yellow" @click="$router.push(localePath('/profile'))">
        <template #content>
          <div class="flex gap-2">
            <img :src="IconEmail" alt="verify email" widh="18" height="18">
            <span style="font-size:0.9375rem !important;">
              {{ $t('troubleshooting.verify_your_email') }}
            </span>
          </div>
        </template>
      </GradientButton>
      <GradientButton v-else-if="depositRequired" tint="yellow" @click="$router.push(localePath('/deposit'))">
        <template #content>
          <div class="flex gap-2">
            <img :src="IconDeposit" alt="deposit" widh="18" height="18">
            <span style="font-size:0.9375rem !important;">
              {{ $t('troubleshooting.make_a_deposit') }}
            </span>
          </div>
        </template>
      </GradientButton>

      <OrLine />

      <GradientButton v-if="havePendingWager" @click="resumeWager">
        <template #content>
          <div class="flex gap-2">
            <img :src="IconPortfolio" alt="view pending wager" widh="18" height="18">
            <span style="font-size:0.9375rem !important;">
              {{ $t('troubleshooting.view_pending_wager') }}
            </span>
          </div>
        </template>
      </GradientButton>
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

<style scoped lang="scss">
.wrapper {
    padding: 1.25rem 1rem;
}
.message {
    font-size: 0.9375rem;
    text-align: center;
    line-height: 1.25rem;
}

</style>