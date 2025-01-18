import { adaptEvent, adaptOutcome } from '@/utils/model-utils';
import { EVENT_STATUS, WAGER_STATUS, eventSortOptions } from '@/pages/constants';

export default function useWager() {
    const route = useRoute();
    const { id: wagerPositionId } = route.params;
    const { getRelatedEvents, getWagerPosition } = useApi();

    const wager = ref(null);
    const rawEvent = computed(() => wager.value?.event);
    const event = computed(() => adaptEvent(rawEvent.value));
    const relatedEvents = ref([]);
    const outcome = computed(() => {
        if (wager.value?.event?.outcomes) {
            const outcomes = wager.value.event.outcomes;
            const index = wager.value.event_outcome?.index;
            return adaptOutcome(outcomes[index], index, wager.value.status);
        } else {
            return null;
        }
    });

    const loadWager = async () => {
        if (wagerPositionId) {
            const { data } = await getWagerPosition(wagerPositionId);
            if (data.value) {
                wager.value = {
                    ...data.value,
                    isActive: data.value.status === WAGER_STATUS.DEFAULT,
                    probability: data.value.probability, // AW4
                    payoutReturnForNewWagers: data.value.payout_return_for_new_wagers, // AW5
                    pledge: data.value.pledge, // AW8
                    wager: data.value.wager, // AW9
                    leverage: data.value.leverage, //AW10
                    indicativePayout: data.value.indicative_payout, // AW11
                    indicativeReturn: data.value.indicative_return, // AW12
                    stopProbability: data.value.stop_probability,
                    finalIndicativeReturn: data.value.final_indicative_return, // IW5
                    realizedReturn: data.value.realized_return, // IW12
                    realizedPayout: data.value.realized_payout, // IW11
                    event_status: data.value.event_status,
                };
                const code = data.value.event?.code;
                if (code) {
                    if (data.value.event.status === EVENT_STATUS.RESOLVED) {
                        setRelatedEvents(code);
                    }
                }
            }
        }
    };

    const setRelatedEvents = async (eventId) => {
        const { data } = await getRelatedEvents(eventId, {
            sortby: eventSortOptions[0].code,
        });
        if (data.value) {
            relatedEvents.value = data.value.map((event) => adaptEvent(event) || []);
        }
    };

    return {
        wager,
        event,
        outcome,
        loadWager,
    };
}
