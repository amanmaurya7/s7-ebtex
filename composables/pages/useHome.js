import { eventSortOptions } from '../../pages/constants';
import { adaptEvent } from '../../utils/model-utils';

export default function useHome() {
    const selectedSortOption = ref(eventSortOptions.find((o) => o.code === 'newest'));
    const { getEvents } = useApi();

    const topParams = computed(() => ({
        purpose: 'top',
        pagination: false,
        sortby: selectedSortOption.value.code,
    }));

    const { data: topEvents } = getEvents(topParams, {
        transform: (events) => {
            return events.map(event => adaptEvent(event));
        },
    });

    const featuredParams = computed(() => ({
        purpose: 'featured',
        pagination: false,
        sortby: 'newest',
    }));
    const { data: featuredEvents } = getEvents(featuredParams, {
        transform: (events) => {
            return events.map(event => adaptEvent(event));
        },
    });

    return {
        topEvents,
        featuredEvents,
    };
}
