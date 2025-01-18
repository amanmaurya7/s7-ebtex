import { activeWagerPositionSortOptions, inactiveWagerPositionSortOptions } from '@/pages/constants';
import { adaptOutcome } from '@/utils/model-utils';
import { formatDate } from '@/utils/formatters';

export const useWagerPosition = () => {
    const { t } = useNuxtApp().$i18n;
    const { getDashboardEventWagerPositions } = useApi();
    const filterOptions = [
        { name: t('dashboard.filter.active'), code: 'active' },
        { name: t('dashboard.filter.inactive'), code: 'inactive' },
    ];
    const selectedFilter = ref(filterOptions[0]);
    const selectedSort = ref(activeWagerPositionSortOptions[0]);
    watch(selectedFilter, (newValue) => {
        if (newValue.code === 'active' && selectedSort.value?.code === 'recently closed') {
            selectedSort.value = activeWagerPositionSortOptions.find((option) => option.code === 'time to expiration');
        }
        if (newValue.code === 'inactive' && selectedSort.value?.code === 'time to expiration') {
            selectedSort.value = inactiveWagerPositionSortOptions.find((option) => option.code === 'recently closed');
        }
    });
    const currentPage = ref(1);
    const POSITIONS_PER_PAGE = 10;
    const params = computed(() => {
        return {
            status: selectedFilter.value.code,
            sortby: selectedSort.value.code,
            pagination: true,
            page: currentPage.value,
            limit: POSITIONS_PER_PAGE,
        };
    });
    const wagerPositionPagination = ref(null);
    const wagerPositionData = ref([]);
    const activeWagerPositionCount = ref(0);
    const inactiveWagerPositionCount = ref(0);
    const wagerPositionList = computed(() => {
        return wagerPositionData.value.map(data => {
            const event = data.event;
            const outcome = data.event_outcome;
            const selectedOption = outcome ? adaptOutcome(outcome, outcome.index) : null;
            return {
                ...data,
                wagerPositionId: data.wager_position_id,
                eventId: data.event_id,
                outcomeId: data.event_outcome_id,
                title: event?.name || '',
                selectedOption,
                pledge: data.pledge,
                wager: data.wager,
                realizedReturn: data.realized_return,
                predictedReturn: data.wagered_probability,
                wageredAt: formatDate(data.wagered_at, 'YYYY/MM/DD'),
                status: data.status,
                isRefunded: data.is_returned,
                leverage: data.leverage,
                indicativeReturn: data.indicative_return,
            };
        });
    });

    const getNextPageWagerPosition = async () => {
        if (wagerPositionPagination.value.currentPage < wagerPositionPagination.value.totalPages) {
            currentPage.value++;
            await getWagerPosition(true);
        }
    };

    const getWagerPosition = async (append = false) => {
        // reset params
        if (!append) {
            currentPage.value = 1;
        }
        await getDashboardEventWagerPositions(params.value, {
            onResponse(context) {
                const response = context.response;
                const contentRange = response.headers.get('content-range');
                let start = 0, end = 0, total = 0;
                if (contentRange && contentRange !== '*/0') {
                    [start, end, total] = contentRange.match(/(\d+)-(\d+)\/(\d+)/).slice(1).map(Number);
                }
                wagerPositionPagination.value = {
                    start,
                    end,
                    total,
                    currentPage: start / POSITIONS_PER_PAGE + 1,
                    totalPages: Math.ceil(total / POSITIONS_PER_PAGE),
                };
                const data = response._data || [];
                if (append) {
                    wagerPositionData.value = [...wagerPositionData.value, ...data];
                } else {
                    wagerPositionData.value = data;
                }
            },
        });
    };

    const getWagerCount = async () => {
        const params = {
            pagination: true,
            page: currentPage.value,
            limit: POSITIONS_PER_PAGE,
        };
        await getDashboardEventWagerPositions({ ...params, status: 'active' }, {
            onResponse({ response }) {
                const contentRange = response.headers.get('content-range');
                const total = Number(contentRange.match(/(\d+)-(\d+)\/(\d+)/)[3]);
                activeWagerPositionCount.value = total;
            },
        });
        await getDashboardEventWagerPositions({ ...params, status: 'inactive' }, {
            onResponse({ response }) {
                const contentRange = response.headers.get('content-range');
                const total = Number(contentRange.match(/(\d+)-(\d+)\/(\d+)/)[3]);
                inactiveWagerPositionCount.value = total;
            },
        });
    };

    getWagerCount();
    return {
        filterOptions,
        selectedFilter,
        selectedSort,
        wagerPositionList,
        getWagerPosition,
        getNextPageWagerPosition,
        activeWagerPositionCount,
        inactiveWagerPositionCount,
    };
};
