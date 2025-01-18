import { storeToRefs, defineStore } from 'pinia';
import { useUserStore } from '@/store/user';

export const useNotificationStore = defineStore('notification', () => {
    const { token } = storeToRefs(useUserStore());
    const currentNotificationBadgeCount = ref(0);
    const hasUrgentNotification = ref(false);

    const clearNotifications = () => {
        hasUrgentNotification.value = false;
        currentNotificationBadgeCount.value = 0;
    };

    const updateNotificationStatus = async () => {
        if (!token.value) {
            return;
        }

        const { getNotificationStat } = useApi();
        const { data } = await getNotificationStat();
        if (data.value) {
            hasUrgentNotification.value = data.value.urgent_count > 0;
            currentNotificationBadgeCount.value = data.value.unread_count;
        }
    };

    return {
        currentNotificationBadgeCount,
        hasUrgentNotification,
        updateNotificationStatus,
        clearNotifications,
    };
});
