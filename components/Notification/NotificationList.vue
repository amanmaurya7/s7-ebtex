<script setup>
import moment from 'moment';
import { NEW_NOTIFICATION_ICONS } from '@/assets/svg';
import { NOTIFICATIONS } from '@/pages/constants';
import TransparentButton from '@/components/Common/TransparentButton.vue';
import { useAppStore } from '@/store/app';

const { $localePath } = useNuxtApp();
const { toggleNotificationSideNav } = useAppStore();
const emit = defineEmits(['expandNotification', 'scrollEnd']);

defineProps({
    notifications: {
        type: Array,
        required: true,
    },
});

const expandedNotificationId = ref(null);

const toggleNotification = (notification) => {
    if (expandedNotificationId.value === notification.id) {
        expandedNotificationId.value = null;
    } else {
        expandedNotificationId.value = notification.id;
        emit('expandNotification', notification);
    }
};

const now = moment();
const humanizeTimestamp = (notification) => {
    const duration =  moment.duration(moment(notification.created_at).diff(now));
    if (duration.days() > 7) {
        return moment(notification.created_at).format('DD MMM YYYY');
    }
    return duration.humanize(true);
};

const openWallet = () => {
    navigateTo($localePath('/portfolio'));
    toggleNotificationSideNav(false);
};

const notificationListRef = ref(null);
const listEndMarkerRef = ref(null);
const observer = ref(null);

onMounted(() => {
    observer.value = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            emit('scrollEnd');
        }
    }, {
        root: notificationListRef.value,
        threshold: 0.8, // Trigger when 10% of the target is visible
    });

    if (listEndMarkerRef.value) {
        observer.value.observe(listEndMarkerRef.value);
    }
});

onBeforeUnmount(() => {
    if (observer.value) {
        observer.value.disconnect();
    }
});


watch(notificationListRef, (newValue, oldValue) => {
    if (oldValue) {
        oldValue.removeEventListener('scroll', onScroll);
    }
    if (newValue) {
        newValue.addEventListener('scroll', onScroll);
        checkIfNoScroll();
    }
});

const checkIfNoScroll = () => {
    if (!notificationListRef.value) {
        return;
    }
    const element = notificationListRef.value;
    const scrollPosition = element.scrollTop + element.clientHeight;
    if (scrollPosition === element.scrollHeight) {
        emit('scrollEnd');
    }
};

const onScroll = () => {
    if (!notificationListRef.value) return;
    
    const element = notificationListRef.value;
    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    
    // Check if scrolled to the bottom (with a small threshold)
    if (scrollHeight - scrollPosition <= 20) {
        emit('scrollEnd');
    }
};

</script>

<template>
  <div v-if="!notifications.length" class="text-center py-4">
    {{ $t('notification.no_notifications_found') }}
  </div>
  <div v-else ref="notificationListRef" class="notification-list tint-scrollbar">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification-card"
      :class="{ 'unread': !notification.is_read, 'urgent': notification.is_urgent, 'status': notification.is_status, 'archived': notification.is_archived }"
      @click="toggleNotification(notification)"
    >
      <div class="notification-icon-container">
        <img class="icon" :src="NEW_NOTIFICATION_ICONS[NOTIFICATIONS[notification.notification_code]?.icon || 'EVERY_X']">
      </div>
      <div class="flex-grow-1">
        <div class="notification-title">
          <span>{{ notification.title }}</span>
          <div class="notification-marker-icon">
            <img v-if="notification.is_read" src="/images/v1.5/icon-notification-check.png" width="12" height="10">
            <img v-else src="/images/v1.5/icon-expand-arrow-down.png" width="8" height="4">
          </div>
        </div>
        <div class="notification-timestamp">
          <img src="/images/v1.5/icon-clock.png" width="12" height="12" class="tint-m3-500-filter opacity-50">
          {{ humanizeTimestamp(notification) }}
        </div>
        <div v-if="expandedNotificationId === notification.id" class="notification-body" v-html="notification.body" />
        <div v-if="expandedNotificationId === notification.id">
          <TransparentButton
            v-if="NOTIFICATIONS[notification.notification_code]?.walletRelated"
            class="mt-3"
            @click="openWallet"
          >
            <template #content>
              <span class="text-m3-500">{{ $t('notification.go_to_wallet') }}</span>
              <img src="/images/v1.5/icon-chevron-right.png" width="10" height="12" class="tint-m3-500-filter ml-2">
            </template>
          </TransparentButton>
        </div>
      </div>
    </div>
    <div ref="listEndMarkerRef" />
  </div>
</template>

<style scoped lang="scss">

  .notification-list {
    height: calc(100vh - 100px);
    overflow-y: auto;
  }

  .notification-card {
    padding: 10px 25px;
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: flex-start;
    border-radius: 5px;

    border-top: 1px solid var(--m3-a20);
    &:first-child {
      border-top: none;
    }
    &:last-child {
      border-bottom: 1px solid var(--m3-a20);
    }

    &.unread {
      background-color: var(--w2-500);
      .notification-icon-container {
        background-color: var(--k1-500);
      }
    }

    .notification-icon-container {
        flex-grow: 0;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        margin-right: 16px;
        background-color: var(--w2-500);
        border-radius: 6px;
    }

    .notification-title {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      font-weight: bold;
      font-size: 0.9375rem;
      gap: 0.25rem;
      word-break: break-word;
    }
  }

  .notification-body {
    font-size: 0.75rem;
    line-height: 0.9375rem;
    margin-top: 1rem;
    word-break: break-word;
  }

  .notification-timestamp {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-size: 0.75rem;
    gap: .25rem;
    margin-top: .25rem;
    text-transform: uppercase;
    color: var(--m3-a50);
    font-weight: bold;
  }

  .icon {
    max-width: 20px;
    max-height: 20px;
  }

  :not(.unread) .notification-icon-container > img {
    filter: brightness(0) saturate(100%) invert(30%) sepia(58%) saturate(1607%) hue-rotate(149deg) brightness(101%) contrast(104%);
  }
  .unread .notification-icon-container > img {
    filter: none;
  }
  </style>