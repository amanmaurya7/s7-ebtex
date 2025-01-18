import { defineStore } from 'pinia';

export const usePreferenceStore = defineStore('preference', () => {
    const { getPreferences } = useApi();
    const preferences = ref(null);

    const resetPreferences = () => {
        preferences.value = null;
    };

    const getUserPreferences = async() => {
        const { data } = await getPreferences({}, {
            onResponseError: () => {
                // fails silently is ok
            },
        });
        preferences.value = data.value;
        return data.value;
    };

    return { preferences, getUserPreferences, resetPreferences };
});
