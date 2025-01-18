<script setup>
import { useUserStore } from '@/store/user';
import SignOutArt from '@/assets/svg/EX-Illustration-half-SignOut.svg';
import GradientButton from '~/components/Common/GradientButton.vue';
import IconChevronLeft from '@/assets/svg/EX-Aid-Chevron-left.svg';
import IconSignOut from '@/assets/svg/EX-Icon-Signout.svg';
import TransparentButton from '~/components/Common/TransparentButton.vue';

definePageMeta({
    middleware: ['user-auth'],
});

const { $router, $showToast, $localePath } = useNuxtApp();
const { t } = useI18n();
const { logout } = useUserStore();

const onLogoutClick = () => {
    logout({ isForce: false });
    $showToast('success', t('logout.success'));
    $router.replace($localePath('/'));
};

const onCancelClick = () => {
    $router.back();
};

</script>

<template>
  <div>
    <GatewayIllustration
      :title="$t('logout.title')"
      :image="SignOutArt"
    />
    <div class="text-center flex-1 my-3 font-bold" style="min-height: 10rem;">
      {{ $t('logout.hint') }}
    </div>
    <div class="text-center mb-4 px-4">
      <GradientButton
        tint="yellow"
        @click="onLogoutClick"
      >
        <template #content>
          <img :src="IconSignOut" alt="arrow-right" width="18" height="20">
          <span class="inline-block ml-2">
            {{ $t('logout.confirm_logout') }}
          </span>
        </template>
      </GradientButton>
    </div>
    <div class="auth-secondary-bottom-button py-4" @click="onCancelClick">
      <TransparentButton>
        <template #content>
          <img :src="IconChevronLeft" width="12" height="12" class="lock-icon tint-m3-500-filter mr-2">
          <span class="text-m3-500">{{ $t('logout.go_back') }}</span>
        </template>
      </TransparentButton>
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
</style>