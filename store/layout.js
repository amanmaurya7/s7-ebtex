import Ably from 'ably';
import Handlebars from 'handlebars';
import { defineStore, storeToRefs } from 'pinia';
import { useNotificationStore } from './notification';
import { useUserStore } from '@/store/user';
import { useWalletStore } from '@/store/wallet';
import { NOTIFICATIONS } from '~/pages/constants';

export const useLayoutStore = defineStore('layout', () => {
    const { locale } = useNuxtApp().$i18n;
    const { $showToast } = useNuxtApp();
    const { getLayoutParameters: getLayoutParametersRequest } = useApi();
    const { updateNotificationStatus } = useNotificationStore();
    const userStore = useUserStore();
    const { token } = storeToRefs(userStore);
    const { prepareUser } = userStore;
    const { getWallet } = useWalletStore();
    const banners = ref([]);
    const newCollections = ref([]);
    const topCategories = ref([]);
    const ablyParameters = ref(null);
    const ablyRef = ref(null);
    const siteParams = ref(null);

    watch(locale, () => {
        getLayoutParameters();
    });

    const getLayoutParameters = async () => {
        const { data, error } = await getLayoutParametersRequest();
        if (data.value) {
            banners.value = data.value.banners;
            newCollections.value = data.value.new_collections;
            topCategories.value = data.value.top_categories;
            siteParams.value = data.value.params;
        } else {
            console.log(error.value.data);
        }
    };

    const disconnectAbly = () => {
        ablyRef.value?.connection.close();
    };

    const handleAblyEvents = (message) => {
        const notificationConfig = NOTIFICATIONS[message.name];
        if (notificationConfig?.walletRelated) {
            getWallet();
        }
        let notification = message.data;
        if (notification) {
            console.log('notification payload', notification);
            if (!notification.isSilent) {
                const localeSuffix = locale.value === 'en' ? '' : '_jp';
                const titleTemplate = notification.template ? notification.template['app_title' + localeSuffix] : null;
                let title = '--';
                if (titleTemplate) {
                    title = Handlebars.compile(titleTemplate)(notification.context, { allowProtoPropertiesByDefault: true });
                }
                $showToast(
                    notificationConfig?.toastType || 'info',
                    title,
                    null,
                    notificationConfig?.icon,
                );
                updateNotificationStatus();
            }

            if (notification.template.code === 'ACR01' || notification.template.code === 'email-verification') {
                prepareUser();
            }
        }
    };

    const connectToAbly = async () => {
        if (!process.client) {
            return;
        }
        await disconnectAbly();

        const ably = await new Ably.Realtime.Promise({
            authCallback: async (data, callback) => {
                try {
                    const { data } = await getLayoutParametersRequest();
                    if (data.value.ably && token.value) {
                        ablyParameters.value = data.value.ably;
                        console.log('ABLY INITED');
                        callback(null, data.value.ably.token_request);
                    }
                } catch (e) {
                    callback(e, null);
                }
            },
        });

        await ably.connection.on('connected', () => {
            if (!ablyParameters.value?.channel_name) {
                return;
            }
            const channel = ably.channels.get(ablyParameters.value.channel_name);
            channel.subscribe(handleAblyEvents);
        });
        ablyRef.value = ably;
    };

    return { banners, newCollections, topCategories, getLayoutParameters, connectToAbly, disconnectAbly, siteParams };

});
