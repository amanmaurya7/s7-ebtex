import { eventSortOptions } from '../../../pages/constants';
import { adaptEvent } from '@/utils/model-utils';

export const selectedSortOption = ref(eventSortOptions.find(option => option.code === 'newest'));

const params = computed(() => ({
    sortby: selectedSortOption.value.code,
}));

export const getRelatedEvents = async (eventId) => {
    const { getRelatedEvents } = useApi();
    const { data, error } = await getRelatedEvents(eventId, params);

    if(error.value) {
        console.error('getRelatedEvents', error.value);
    }

    return computed(() => data.value?.map(event => adaptEvent(event) || []));
};
