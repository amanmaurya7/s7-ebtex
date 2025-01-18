import { useNotificationStore } from '../../store/notification';
import Handlebars from 'handlebars';
import { htmlToPlainText } from '@/utils/formatters';

Handlebars.registerHelper('encodeURIComponent', (input) => {
    return encodeURIComponent(input.toLowerCase());
});

export default function useNotification() {
    const route = useRoute();
    const { t, locale } = useNuxtApp().$i18n;
    const { $localePath } = useNuxtApp();
    const { id: notificationId } = route.params;
    const { getNotifications, updateNotification, getNotification, readNotification, unreadNotification } = useApi();
    const notificationStore = useNotificationStore();
    const { currentNotificationBadgeCount } = storeToRefs(notificationStore);
    const { showToastWithRedirect } = useToastWithRedirect();
    const isFetching = ref(false);
    const hasFetchedAll = ref(false);
    const localeSuffix = computed(() => locale.value === 'en' ? '' : '_jp');
    const currentPage = ref(1);
    const unreadOnly = ref(false);
    const pageParams = computed(() => {
        const result = {
            with_archived: true,
            unread_only: unreadOnly.value,
            pagination: true,
            page: currentPage.value,
            limit: 10,
        };
        return result;
    });

    watch(pageParams, (newVal, oldVal) => {
        if (newVal.unread_only !== oldVal.unread_only) {
            currentPage.value = 1;
            rawNotifications.value = [];
        }
    });

    const rawNotification = ref(null);
    const rawNotifications = ref([]);
    const urgentNotifications = ref([]);
    const notificationDetail = computed(() => {
        return {
            ...rawNotification.value,
            id: rawNotification.value._id,
            title: titleForNotification(rawNotification.value),
            body: textForNotification(rawNotification.value),
        };
    });
    const notifications = computed(() => {
        const result = [...urgentNotifications.value, ...rawNotifications.value];
        return result.map((notification) => {
            return {
                ...notification,
                id: notification._id,
                title: titleForNotification(notification),
                body: htmlToPlainText(textForNotification(notification)),
            };
        });
    });

    const titleForNotification = (notification) => {
        const template = notification.template ? notification.template['app_title' + localeSuffix.value] : null;
        if (template) {
            return Handlebars.compile(template)(notification.context, { allowProtoPropertiesByDefault: true });
        }
        return '--';
    };
    
    const textForNotification = (notification) => {
        const template = notification.template ? notification.template['app_text' + localeSuffix.value] : null;
        if (template) {
            return Handlebars.compile(template)(notification.context, { allowProtoPropertiesByDefault: true });
        }
        return '--';
    };

    const getUserNotifications = (force = false) => {
        if (!force && (isFetching.value || hasFetchedAll.value)) {
            return;
        }

        isFetching.value = true;
        if (pageParams.value.page === 1) {
            rawNotifications.value = [];
        }

        const { refresh } = getNotifications(pageParams.value, {
            onResponse({ response }) {
                if (!response.ok) {
                    return;
                }

                const data = response._data || [];
                rawNotifications.value.push(...data);
                rawNotifications.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                hasFetchedAll.value = !data.length;
                isFetching.value = false;
            },
        });
        return refresh;
    };

    const getNotificationDetail = async () => {
        if (notificationId) {
            const { data } = await getNotification(notificationId, { pagination: false });
            if (data.value) {
                rawNotification.value = data.value;
                if (!rawNotification.value.is_read && rawNotification.value._id) {
                    await readNotification(rawNotification.value._id);
                    await updateNotificationStatus();
                    rawNotification.value.is_read = true;
                }
            }
        }
    };

    const toggleNotificationsIsArchived = async (notification) => {
        if (notificationDetail.value.id) {
            await updateNotification(notificationDetail.value.id, { is_archived: !notification.is_archived });
            await updateNotificationStatus();
            showToastWithRedirect(
                'success',
                t(notification.is_archived ? 'notification.unarchive_success' : 'notification.archive_success'),
                $localePath('/notification'),
            );
        }
    };

    const toggleNotificationsIsRead = async (notification) => {
        rawNotification.value.is_read = !notification.is_read;
        if (rawNotification.value._id) {
            if (rawNotification.value.is_read) {
                await readNotification(rawNotification.value._id);
            } else {
                await unreadNotification(rawNotification.value._id);
            }
            await updateNotificationStatus();
            showToastWithRedirect(
                'success',
                t(rawNotification.value.is_read ? 'notification.read_success' :'notification.unread_success'),
                $localePath('/notification'),
            );
        }
    };

    return {
        isFetching,
        rawNotification,
        rawNotifications,
        notifications,
        notificationDetail,
        currentPage,
        hasFetchedAll,
        unreadOnly,
        getUserNotifications,
        getNotificationDetail,
        toggleNotificationsIsArchived,
        toggleNotificationsIsRead,
        currentNotificationBadgeCount,
        readNotification,
        updateNotificationStatus: notificationStore.updateNotificationStatus,
    };
}
