import { defineStore } from 'pinia';

export const useCategoryStore = defineStore('category', () => {
    const categories = ref([]);

    const getCategories = async () => {
        const { getLayoutParameters } = useApi();
        const { data } = await getLayoutParameters();
        categories.value = data.value.categories;
    };

    return { categories, getCategories };
});
