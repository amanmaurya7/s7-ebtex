import { storeToRefs } from 'pinia';
import { usePreferenceStore } from '@/store/preference';
import { useUserStore } from '@/store/user';

export default function useSetting() {
    const {
        updateNotificationPreference,
        updateWagerPreference,
        updateFavoriteTagsPreference,
        updatePreference,
        updateNotificationMethodPreference,
    } = useApi();
    const userStore = useUserStore();
    const { token } = storeToRefs(userStore);
    const { t, locale, locales } = useNuxtApp().$i18n;
    const { $showToast } = useNuxtApp();
    const router = useRouter();
    const switchLocalePath = useSwitchLocalePath();
    const preferenceStore = usePreferenceStore();
    const { preferences } = storeToRefs(preferenceStore);
    const { getUserPreferences } = preferenceStore;
    const isFetched = ref(false);
    const isSaving = ref(false);
    const allNotifications = computed(() => {
        return preferences.value?.notification_types.flatMap(type => type.notifications);
    });

    const updateUserNotificationPreferences = async () => {
        for (const key in notificationPreferencesForm.value) {
            const before = allNotifications.value.find(notification => notification.notification_code === key);
            if (before && notificationPreferencesForm.value[key] !== before.enabled) {
                await updateNotificationPreference(key, {
                    enabled: notificationPreferencesForm.value[key],
                });
            }
        }
    };

    const updateUserWagerPreference = async () => {
        const payload = {};
        Object.keys(wagerPreferencesForm).reduce((accum, key) => {
            if (wagerPreferencesForm[key] !== null) {
                payload[key] = wagerPreferencesForm[key];
            }
            return accum;
        }, payload);
        await updateWagerPreference(payload);
    };

    const updateUserTagsPreferences = async () => {
        for (const key in wagerFavoritePreferencesForm.value) {
            const before = preferences.value?.favorite_tags.find(tag => tag.tag.slug === key);
            if (before && wagerFavoritePreferencesForm.value[key] !== before.enabled) {
                await updateFavoriteTagsPreference(key, {
                    enabled: wagerFavoritePreferencesForm.value[key],
                });
            }
        }
    };

    const updateUserPreference = async (payload) => {
        await updatePreference({
            ...payload,
            locale: payload.locale === 'ja' ? 'jp' : payload.locale,
        });
    };

    const updateUserNotificationMethodPreferences = async () => {
        await Promise.all(otherCommunicationPreferences.map(method => {
            return updateNotificationMethodPreference(method.key, {
                enabled: otherCommunicationPreferencesForm.value[method.key],
            });
        }));
    };

    // -------- Notification
    const notificationPreferences = ref([]);
    const notificationPreferencesForm = ref({});

    // ------- Wager
    const wagers = [{
        key: 'default_wager_size',
        unit: '$',
        max: 1000,
    }, {
        key: 'default_leverage',
        unit: 'x',
        max: 10,
    }, {
        key: 'warn_when_market_impact_exceeds',
        unit: '%',
    }];

    const wagerPreferences = wagers.map(item => ({
        label: t(`setting.wager.${item.key}`),
        key: item.key,
        unit: item.unit,
        max: item.max,
    }));

    const wagerPreferencesForm = reactive(wagerPreferences.reduce((accumulator, currentValue) => {
        const { key } = currentValue;
        return { ...accumulator, [key]: null };
    }, {}));

    const wagerFavoritePreferences = ref([]);
    const wagerFavoritePreferencesForm = ref({});

    // ------------ Other
    const localeOptions = locales.value.map(locale => ({
        label: t(`general.${locale.code}`),
        value: locale.code,
    }));
    const otherSettingsPreferences = [
        {
            key: 'locale',
            options: localeOptions,
        },
    ];
    const otherSettingsPreferencesForm = reactive(otherSettingsPreferences.reduce((accumulator, currentValue) => {
        const { key } = currentValue;
        return { ...accumulator, [key]: null };
    }, {}));
    otherSettingsPreferencesForm.locale = locale.value;

    const notificationMethods = ['email'];
    const otherCommunicationPreferences = notificationMethods.map(method => ({
        label: t(`form.${method}`),
        key: method,
    }));
    const otherCommunicationPreferencesForm = ref(otherCommunicationPreferences.reduce((accumulator, currentValue) => {
        const { key } = currentValue;
        return { ...accumulator, [key]: false };
    }, {}));

    const preparePreferenceData = async (force = false) => {
        if (!force && (!preferences.value || isFetched.value)) {
            return;
        }

        if (!token.value) {
            return;
        }

        await getUserPreferences();
        if (!preferences.value) {
            return;
        }
        isFetched.value = true;
        // -------- Notification
        notificationPreferences.value = preferences.value.notification_types.flatMap(type => {
            const options = type.notifications.map(notification => ({
                label: t(`setting.notifications.${notification.notification_code}`),
                key: notification.notification_code,
                enabled: notification.enabled,
            }));

            return options;
        });
        notificationPreferencesForm.value = notificationPreferences.value.reduce((accumulator, currentValue) => {
            const { key, enabled } = currentValue;
            return { ...accumulator, [key]: enabled };
        }, {});

        // ------- Wager
        wagerPreferences.forEach(preference => {
            if (preferences.value.wager[preference.key] !== undefined) {
                wagerPreferencesForm[preference.key] = preferences.value.wager[preference.key];
            }
        });
        wagerFavoritePreferences.value = preferences.value.favorite_tags?.map(tag => {
            return {
                label: tag.tag.name,
                key: tag.tag.slug,
                enabled: tag.enabled,
            };
        });
        wagerFavoritePreferencesForm.value = wagerFavoritePreferences.value.reduce((accumulator, currentValue) => {
            const { key, enabled } = currentValue;
            return { ...accumulator, [key]: enabled };
        }, {});

        // ------------ Other
        otherSettingsPreferencesForm.locale = preferences.value.locale === 'jp'
            ? 'ja'
            : preferences.value.locale || locale.value;
        otherCommunicationPreferencesForm.value = Object.assign(otherCommunicationPreferencesForm.value, preferences.value.notification_methods);
    };

    const onSaveSetting = async () => {
        if (preferences.value) {
            isSaving.value = true;
            await Promise.all([
                updateUserNotificationPreferences(),
                updateUserTagsPreferences(),
                updateUserWagerPreference(),
                updateUserPreference(otherSettingsPreferencesForm),
                updateUserNotificationMethodPreferences(),
            ]).finally(() => {
                isSaving.value = false;
            });
            await getUserPreferences();
        }
        $showToast(
            'success',
            t('setting.settings_updated'),
            null,
            null,
            'DISK',
        );
        router.replace(switchLocalePath(otherSettingsPreferencesForm.locale));
    };

    onMounted(async () => {
        await preparePreferenceData(true);
    });

    // watch(preferences, async () => {
    //     await preparePreferenceData();
    // });

    watch(locale, () => {
        if (!preferences.value) {
            otherSettingsPreferencesForm.locale = locale.value;
        }
    });

    return  {
        notificationPreferences,
        notificationPreferencesForm,
        wagerPreferences,
        wagerPreferencesForm,
        wagerFavoritePreferences,
        wagerFavoritePreferencesForm,
        otherSettingsPreferences,
        otherSettingsPreferencesForm,
        otherCommunicationPreferences,
        otherCommunicationPreferencesForm,
        updateUserPreference,
        preferences,
        onSaveSetting,
        isSaving,
    };
}
