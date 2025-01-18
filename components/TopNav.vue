<script setup>
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { useNotificationStore } from '@/store/notification';
import { useUserStore } from '@/store/user';
import { EX } from 'assets/svg';
import BlackButton from '@/components/Common/BlackButton.vue';
import SignInButtonArt from '@/assets/svg/EX-Icon-Signin.svg';

const { currentNotificationBadgeCount } = storeToRefs(useNotificationStore());
const appStore = useAppStore();
const userStore = useUserStore();
const { $router } = useNuxtApp();

const { isSideNavVisible, isNotificationSideNavVisible } = storeToRefs(appStore);
const { toggleSideNav, toggleNotificationSideNav } = appStore;
const { token } = storeToRefs(useUserStore());


const { signupForm } = storeToRefs(userStore);
const isInSignupPage = computed(() => {
    return $router.currentRoute.value?.path.match('/auth/signup$');
});

</script>

<template>
  <div class="top-nav bg-m1-500">
    <div class="left-items">
      <Button
        class="top-nav-button"
        @click="() => toggleSideNav(!isSideNavVisible.value)"
      >
        <template #icon>
          <img width="22" height="22" :src="EX.EX_MENU">
        </template>
      </Button>
    </div>

    <nuxt-link :to="localePath('/')" class="logo">
      <img src="/images/v1.5/logo-top.png" width="60">
    </nuxt-link>

    <div class="right-items">
      <div v-if="isInSignupPage" class="progress-bar">
        <span class="progress-bar-label">{{ signupForm.progress + '%' }}</span>
        <ProgressBar
          style="width: 40px;height:10px;"
          :value="signupForm.progress === 0 ? 10 : signupForm.progress"
          :show-value="false"
        />
      </div>
      <div v-else-if="token">
        <Button
          class="top-nav-button relative overflow-visible"
          @click="() => toggleNotificationSideNav(!isNotificationSideNavVisible.value)"
        >
          <img width="22" height="22" :src="EX.EX_NOTIFICATIONS">
          <div v-if="currentNotificationBadgeCount > 0" class="badge">{{ currentNotificationBadgeCount }}</div>
        </Button>
      </div>
      <div v-else>
        <BlackButton class="transparent-btn" @click="$router.push(localePath('/auth/login'))">
          <template #content>
            {{ $t('login.button') }}
            <img :src="SignInButtonArt" width="20" height="20" class="ml-2">
          </template>
        </BlackButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.top-nav {
  z-index: 99;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1.25rem 0.625rem;
  gap: 1rem;
  background-color: var(--primary-500);
  height: 60px;

  .logo {
    position: absolute;
    left: calc(100vw / 2 - 30px);
    height: 32px;

    img {
      object-fit: contain;
      display: block;
      height: 100%;
    }
  }

  .balance-tag {
    cursor: pointer;
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 99px;
    padding: .25rem .5rem;
    min-width: 80px;
    text-align: center;
  }

  .btn-login {
    min-width: 90px;
  }
}

.top-nav-button {
  border: none;
  background: transparent;
}

.badge {
  position: absolute;
  top: 0px;
  right: 0px;
}

.progress-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.progress-bar-label {
  color: white;
  font-weight: bold;
  font-size: 0.9375rem;
}
</style>
