import { storeToRefs } from 'pinia';
import { useBettingInfoStore } from '@/store/bettingInfo';
import { useWalletStore } from '@/store/wallet';
import { BETTING_RESULT } from '@/pages/constants';

export default function useBetting() {
    const { postWager, getEventMarketHistory } = useApi();
    const { $showToast, $localePath, $i18n: { t } } = useNuxtApp();
    const { params: { eventId } } = useRoute();
    const walletStore = useWalletStore();
    const { wallet } = storeToRefs(walletStore);
    const bettingInfoStoreStore = useBettingInfoStore();
    const { clearBettingInfo, updateDebuggingInfo } = bettingInfoStoreStore;
    const {
        formData,
        event,
        outcome,
        quote,
    } = storeToRefs(bettingInfoStoreStore);

    const isSubmitting = ref(false);
    const isConfirmed = ref(false);
    const bettingInfo = computed(() => {
        if (!quote.value || !outcome.value) {
            return [];
        }

        if (quote.value.after_pledge !== quote.value.before_pledge) {
            return {
                isActive: true,
                pledge: quote.value.after_pledge,
                wager: quote.value.after_wager,
                leverage: quote.value.after_leverage,
                indicativePayout: quote.value.after_payout,
                indicativeReturn: quote.value.after_return,
                stopProbability: quote.value.after_stop_probability,
                marketImpact: quote.value.probability_change,
                newProbability: quote.value.new_probability,
                oldLeverage: quote.value.before_leverage,
            };
        }

        return {
            isActive: true,
            pledge: quote.value.pledge,
            wager: quote.value.wager,
            leverage: quote.value.leverage,
            indicativePayout: quote.value.indicative_payout,
            indicativeReturn: quote.value.indicative_return,
            stopProbability: quote.value.after_stop_probability,
            marketImpact: quote.value.probability_change,
            newProbability: quote.value.new_probability,
            oldLeverage: quote.value.before_leverage,
        };
    });
    const { showToastWithRedirect } = useToastWithRedirect();

    const onSubmitOrder = async() => {
        if (!wallet.value || wallet.value.balance < formData.value.pledge) {
            showToastWithRedirect(
                'error',
                t('error.wallet_no_enough_money'),
                $localePath('/deposit'),
            );
            return;
        }

        const query = {};
        isSubmitting.value = true;
        const { error } = await postWager({
            wallet_id: wallet.value?.id,
            max_payout: quote.value?.indicative_payout,
            ...formData.value,
        }, {
            onResponseError: () => {
                isSubmitting.value = false;
            },
        });

        if(error.value) {
            const { statusCode, message, blackbox_api_agent: blackboxAPIAgent = null } = error.value.data;
            query.result = BETTING_RESULT.FAILED;
            query.message = message;
            query.statusCode = statusCode;
            const isDev = window.location.hostname.split('.')[0] === 'dev';
            if (isDev && blackboxAPIAgent) {
                updateDebuggingInfo(blackboxAPIAgent);
            }
            $showToast('error', t('message.error.order_submit'));
        } else {
            query.result = BETTING_RESULT.SUCCESS;
            $showToast('success', t('message.success.order_submit'));
            await walletStore.getWallet();
        }
        navigateTo({
            path: $localePath(`/betting/${eventId}/result`),
            query,
        });
    };

    const onClickCancel = () => {
        clearBettingInfo();
        if (window.history.length > 1) {
            window.history.back();
        } else {
            navigateTo($localePath(`/events/${eventId}`));
        }
    };

    const isFetchingChartData = ref(false);
    const rawChartData = ref(null);
    const getOutcomesProbAndReturnChartData = async () => {
        isFetchingChartData.value = true;
        const chartDate = useDateRange(7 * 24);
        const chartParams = {
            precision: 'hour',
            to: chartDate.to,
            from: chartDate.from,
            focused_event_outcome_id: outcome.value._id,
        };
        const { data, error } = await getEventMarketHistory(eventId, chartParams);
        isFetchingChartData.value = false;

        if (error.value) {
            console.log('error when loading data', error.value);
        } else if (!data || data.length === 0) {
            console.log('Empty data params', chartParams);
            isFetchingChartData.value = false;
        } else {
            rawChartData.value = data.value;
        }
    };

    // Only fetch chart data for leveraged betting
    if (quote.value?.leverage > 0) {
        getOutcomesProbAndReturnChartData();
    }

    return {
        onSubmitOrder,
        onClickCancel,
        isFetchingChartData,
        rawChartData,
        isSubmitting,
        bettingInfo,
        outcome,
        event,
        quote,
        isConfirmed,
    };
}
