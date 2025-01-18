<script setup>
import { useUserStore } from '@/store/user';
import { useAppStore } from '@/store/app';
import { useNotificationStore } from '@/store/notification';
import { sideNavIcons } from '@/assets/svg/index';
import { storeToRefs } from 'pinia';
import { usePreferenceStore } from '@/store/preference';
import useSetting from '~/composables/pages/useSetting';
import NotificationSidebar from '@/components/Notification/NotificationSidebar.vue';
import { useWalletStore } from '@/store/wallet'; // Added import for wallet store

const appStore = useAppStore();
const { isSideNavVisible, isNotificationSideNavVisible } = storeToRefs(appStore);
const { toggleSideNav } = appStore;
const { close } = sideNavIcons;
const router = useRouter();
const { locale } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const { token } = storeToRefs(useUserStore());
const preferenceStore = usePreferenceStore();
const { preferences } = storeToRefs(preferenceStore);
const { getUserPreferences } = preferenceStore;
const { updateNotificationStatus } = useNotificationStore();
const { updateUserPreference } = useSetting();
const walletStore = useWalletStore(); // Initialize wallet store
const { balance } = storeToRefs(walletStore); // Get balance from wallet store

const navItems = computed(() => {
    const helpItem = { key: 'HELP', label: 'sidenav.help', icon: sideNavIcons.SIDEMENU_FAQ, to: 'help' };
    const portfolioItem = {
        key: 'PORTFOLIO',
        label: 'sidenav.portfolio',
        icon: sideNavIcons.SIDEMENU_PORTFOLIO,
        to: 'portfolio',
        badgeCount: balance.value, // Show balance as badge count
    };
    const items = [
        { key: 'HOME', label: 'navbar.home', icon: sideNavIcons.SIDEMENU_HOME, to: 'index' },
        token.value ? portfolioItem : helpItem,
        { key: 'EXPLORE', label: 'sidenav.explore', icon: sideNavIcons.SIDEMENU_EXPLORE, to: { name: 'explore-tab', params: { tab: 'categories' } } },
        { key: 'SEARCH', label: 'sidenav.search', icon: sideNavIcons.SIDEMENU_SEARCH, to: 'search' },
        token.value ? helpItem : null,
    ].filter(item => item);
    return items;
});

const sidenavItems = computed(() => {
    const items = [
        { key: 'HOME', label: 'sidenav.home', icon: sideNavIcons.SIDEMENU_HOME, to: 'index' },
        { key: 'EXPLORE', label: 'sidenav.explore', icon: sideNavIcons.SIDEMENU_EXPLORE, to: { name: 'explore-tab', params: { tab: 'categories' } }  },
        { key: 'SEARCH', label: 'sidenav.search', icon: sideNavIcons.SIDEMENU_SEARCH, to: 'search' },
        { key: 'HELP', label: 'sidenav.help', icon: sideNavIcons.SIDEMENU_HELP, to: 'help' },
        { key: 'separator' },
    ];
    if (token.value) {
        return [
            ...items,
            { key: 'PORTFOLIO', label: 'sidenav.portfolio', icon: sideNavIcons.SIDEMENU_PORTFOLIO, to: 'portfolio', badgeCount: balance.value }, // Show balance as badge count
            { key: 'PROFILE', label: 'sidenav.profile', icon: sideNavIcons.SIDEMENU_PROFILE, to: 'profile' },
            { key: 'SETTING', label: 'sidenav.preferences', icon: sideNavIcons.SIDEMENU_SETTINGS, to: 'setting' },
            { key: 'SIGN_OUT', label: 'sidenav.sign_out', icon: sideNavIcons.SIDEMENU_SIGN_OUT, to: '/logout' },
        ];
    } else {
        return [
            ...items,
            {
                key: 'SIGN_IN', label: 'sidenav.sign_in', icon: sideNavIcons.SIDEMENU_SIGN_IN, to: '/auth/login',
            },
        ];
    }
});

const onClickSidenavItem = () => {
    toggleSideNav(false);
};

const localeForm = reactive({
    locale: preferences.value?.locale === 'jp'
        ? 'ja'
        : preferences.value?.locale || locale.value,
});

const updateLocale = async () => {
    await nextTick();
    if (preferences.value) {
        await updateUserPreference(localeForm);
        await getUserPreferences();
    }
    router.replace(switchLocalePath(localeForm.locale));
};

watch(preferences, () => {
    if (preferences.value) {
        localeForm.locale = preferences.value.locale === 'jp' ? 'ja' : preferences.value.locale;
    }
});

watch(locale, () => {
    if (!preferences.value) {
        localeForm.locale = locale.value;
    }
});

router.afterEach(() => {
    toggleSideNav(false);
});


const logoPath = '/images/v1.5/logo-side-menu.png';

await updateNotificationStatus();
</script>

<template>
  <div class="navbar">
    <NotificationSidebar v-model:visible="isNotificationSideNavVisible" />
    <Sidebar
      v-model:visible="isSideNavVisible"
      class="sidebar"
      :block-scroll="true"
      :pt="{
        root: {
          class: 'bg-m4-500 sidebar',
          style: 'padding: 24px 20px;width: 21rem;'
        },
        header: {
          class: 'flex justify-content-between align-items-center'
        },
        content: {
          class: 'p-0'
        }
      }"
    >
      <template #header>
        <img :src="logoPath" width="120" alt="">
      </template>

      <template #closeicon>
        <img :src="close" alt="" @click="toggleSideNav(false)">
      </template>

      <div class="sidebar-content">
        <template v-for="({ key, label, icon, to, badgeCount, cb }, i) in sidenavItems">
          <hr v-if="key === 'separator'" :key="key + i" class="separator">
          <NuxtLink
            v-else-if="to"
            :key="key"
            class="sidebar-item"
            active-class="sidebar-item-active"
            :to="localePath(to)"
            @click="onClickSidenavItem(key)"
          >
            <img :src="icon" alt="" width="20" height="20">
            <p class="flex-grow-1">{{ $t(label) }}</p>
            <div v-if="typeof badgeCount === 'number'" class="balance-badge">
              {{ formatAmount(badgeCount) }}
            </div>
          </NuxtLink>
          <a v-else :key="key + 'a'" href="javascript:void(0)" class="sidebar-item" @click="cb()">
            <img :src="icon" alt="" width="20" height="20">
            <p>{{ $t(label) }}</p>
          </a>
        </template>

        <div class="sidenav-bottom">
          <div>
            <small class="">{{ $t('general.version', { version: $config.public.clientVersion }) }}</small>
          </div>
          <div class="flex sidebar-item lang-switcher pl-0">
            <div>{{ $t('general.en') }}</div>
            <InputSwitch
              id="locale"
              v-model="localeForm['locale']"
              style="width: 54px;"
              true-value="ja"
              false-value="en"
              @change="updateLocale"
            />
            <div>{{ $t('general.ja') }}</div>
          </div>
          <div>
            <nuxt-link class="text-link" :to="localePath('about')">
              {{ $t('sidenav.about_us') }}
            </nuxt-link>
            |
            <nuxt-link class="text-link" :to="localePath('privacy')">
              {{ $t('sidenav.privacy') }}
            </nuxt-link>
            |
            <nuxt-link class="text-link" :to="localePath('terms')">
              {{ $t('sidenav.terms') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </Sidebar>

    <NuxtLink
      v-for="{ key, label, icon, to, itemClass, onClick } in navItems"
      :key="key"
      class="nav-item bottom-nav-item"
      :class="itemClass"
      :to="localePath(to)"
      @click="onClick && onClick()"
    >
      <div class="icon-wrapper">
        <img :src="icon" width="20" height="20">
      </div>
      <div class="bottom-nav-label">
        {{ $t(label) }}
      </div>
    </NuxtLink>
  </div>
</template>

<style lang="scss" scoped>

.navbar {
  z-index: 99;
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  display: flex;
  padding: 10px 15px;
  justify-content: space-evenly;

  background: url('/images/v1.5/bg-bottom-nav.png') no-repeat;
  background-size: cover;

  .nav-item {
    justify-content: center;
    flex: 1 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    min-height: 40px;
    
    p {
      color: var(--gray-400);
      font-size: 0.875rem !important;
      letter-spacing: 0.07px;
    }
  }
}

.separator {
  margin: 15px -5px;
  display: block;
  height: 1px;
  border: 0;
  border-top: 1px solid var(--m5-500);
  opacity: 0.2;
  padding: 0;
}

.sidebar-content {
  margin: 30px 10px;
  display: flex;
  flex-direction: column;
  color: #fff;

  .sidebar-item {
    user-select: none;
    font-size: 15px;

    display: flex;
    align-items: center;
    padding: 10px 10px;
    border-radius: 5px;
    text-decoration: none;
    color: #fff;
    p {
      font-weight: 700;
    }

    &.sidebar-item-active {
      background-color: var(--m1-500);
    }
    img {
      display: inline-block;
      margin-right: 15px;
    }
  }
}

.lang-switcher {
  gap: 0.75rem;
  font-weight: bold;
  font-size: 0.75rem !important;
  margin-bottom: 1.25rem;
}

.sidenav-bottom {
  position: fixed;
  bottom: 1.25rem;
  margin: 0 -5px;

  .text-link {
    font-size: 0.75rem !important;
    padding: .25rem .25rem;

    &:hover {
      background-color: var(--m1-500);
    }
  }
}

.bottom-nav-item {
  gap: 0 !important;
  margin: 0;
  padding: 0rem !important;

  &.router-link-active {
    background: var(--m1-500);
    border-radius: 5px;
  }
  
  .icon-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    flex-grow: 0;
    margin-bottom: 0.25rem;
    width: 16px;
    height: 16px;
    img {
      object-fit: contain;
      display: block;
      height: 100%;
    }
  }

  .bottom-nav-label {
    font-size: 0.625rem !important;
    color: white;
    font-weight: bold;
  }
}

.balance-badge {
  background: var(--m1-500);
  color: var(--k1-500);
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.25rem 0.25rem;
  justify-self: end;
  border-radius: 5px;
}

</style>
