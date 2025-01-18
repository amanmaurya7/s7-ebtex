<script setup>
import { useAppStore } from '@/store/app';
import { sideNavIcons } from '@/assets/svg/index';
import useNotification from './useNotification.js';
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { token } = storeToRefs(userStore);
const { isNotificationSideNavVisible, toggleNotificationSideNav } = useAppStore();
const {
    isFetching,
    currentPage,
    notifications,
    getUserNotifications,
    unreadOnly,
    currentNotificationBadgeCount,
    readNotification,
    updateNotificationStatus,
} = useNotification();

const onTabChange = (event) => {
    currentPage.value = 1;
    unreadOnly.value = event.index === 1;
    getUserNotifications(true);
};

const reloadNotifications = () => {
    currentPage.value = 1;
    if (token.value) {
        getUserNotifications();
    }
};

watch(token, (newValue) => {
    if (newValue) {
        reloadNotifications();
    }
});

const onExpandNotification = async (notification) => {
    if (notification.is_read) {
        return;
    }
    await readNotification(notification.id);
    notification.is_read = true;
    updateNotificationStatus();
};

const onScrollEnd = () => {
    if (isFetching.value) {
        return;
    }
    currentPage.value += 1;
    getUserNotifications();
};

onMounted(async () => {
    reloadNotifications();
});

const onShowNotificationSideNav = () => {
    unreadOnly.value = false;
    reloadNotifications();
};

</script>

<template>
  <Sidebar
    v-model:visible="isNotificationSideNavVisible"
    position="right"
    :block-scroll="true"
    :pt="{
      root: {
        class: 'bg-white',
      },
      header: {
        class: 'flex justify-content-between align-items-center',
        style: 'padding: 24px 20px 8px 24px;'
      },
      content: {
        class: 'p-0'
      }
    }"
    @show="onShowNotificationSideNav"
  >
    <template #header>
      <div class="outer-icon-button">
        <img :src="sideNavIcons.SIDEMENU_NOTIFICATIONS" width="20" height="20" alt="" @click="toggleNotificationSideNav(false)">
      </div>
      <div class="flex justify-content-between align-items-center">
        <div class="font-125 font-bold">
          {{ $t('notification.page_title') }}
        </div>
        <div class="badge mx-50">
          {{ currentNotificationBadgeCount }}
        </div>
      </div>
    </template>

    <template #closeicon>
      <img src="/images/v1.5/icon-notification-close-green.png" width="18" height="15" alt="" @click="toggleNotificationSideNav(false)">
    </template>

    <div class="sidebar-content">
      <TabView @tab-change="onTabChange">
        <TabPanel>
          <template #header>
            <div class="font-75">
              {{ $t('notification.all') }}
            </div>
          </template>
          <NotificationList :notifications="notifications" @expand-notification="onExpandNotification" @scroll-end="onScrollEnd" />
        </TabPanel>
        <TabPanel>
          <template #header>
            <div class="font-75">
              {{ $t('notification.unread') }}
            </div>
          </template>
          <NotificationList :notifications="notifications" @expand-notification="onExpandNotification" @scroll-end="onScrollEnd" />
        </TabPanel>
      </TabView>
    </div>
  </Sidebar>
</template>

<style lang="scss" scoped>

.outer-icon-button {
  width: 40px;
  height: 40px;
  background-color: var(--m1-500);
  position: absolute;
  top: 24px;
  left: -48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  box-shadow: 0 0 10px 1px var(--m4-500);
}


:deep(.p-tabview-header-action) {
  padding-bottom: .5rem !important;
}

:deep(.p-highlight .p-tabview-header-action), :deep(.p-tabview-header-action:hover) {
  .badge {
    background-color: var(--m4-500);
    opacity: 1;
  }
}

:deep(.p-tabview-header-action:focus) {
  box-shadow: none !important;
}

:deep(.p-tabview-header-action) {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

:deep(.p-tabview .p-tabview-nav li) {
  flex: none;
}

:deep(.p-tabview-nav) {
  padding: 0 1.25rem;
}

</style>
