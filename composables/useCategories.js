import { useCategoryStore } from '../store/category';
import { storeToRefs } from 'pinia';

export const getAllCategories = () => {
    const store = useCategoryStore();
    const { categories } = storeToRefs(store);
    return categories;
};

export const getCategoryBySlug = (slug) => {
    if (!slug) {
        return null;
    }
    const store = useCategoryStore();
    const { categories } = storeToRefs(store);
    return categories.value.find(category => category.slug === slug);
};
