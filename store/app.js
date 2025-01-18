import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
    const hasMeInitialized = ref(false);
    const isSideNavVisible = ref(false);
    const isNotificationSideNavVisible = ref(false);

    const setHasMeInitialized = async(value) => {
        hasMeInitialized.value = value;
    };

    const toggleSideNav = (visible) => {
        isSideNavVisible.value = visible;
    };

    const toggleNotificationSideNav = (visible) => {
        isNotificationSideNavVisible.value = visible;
    };

    return {
        hasMeInitialized, setHasMeInitialized,
        isSideNavVisible, toggleSideNav,
        isNotificationSideNavVisible, toggleNotificationSideNav,
    };
});
