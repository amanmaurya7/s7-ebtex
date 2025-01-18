import { useUserStore } from '../../store/user';
import { useBettingInfoStore } from '../../store/bettingInfo';
import { adaptEvent, adaptOutcome } from '@/utils/model-utils';
import { storeToRefs } from 'pinia';
import moment from 'moment';
import { MIN_PLEDGE } from '@/pages/constants';
import lodash from '@/node_modules/lodash/lodash.js';
import { useWalletStore } from '@/store/wallet';
import { usePreferenceStore } from '@/store/preference';
import nuxtStorage from 'nuxt-storage';
import { LOGIN_RESUME_KEY } from '@/pages/constants';
import { formatDuration, DURATION_MODE } from '@/utils/formatters';

export default function useEventDetail() {
    const { locale } = useI18n();
    const { t } = useNuxtApp().$i18n;
    const { debounce } = lodash;
    const route = useRoute();
    const { id: eventId } = route.params;
    const { deposit_target_outcome_id: depositTargetOutcomeId } = route.query;
    const debuggingInfo = ref(null);
    const {
        getEventDetail,
        getEventRecentWagers,
        getEventMarketHistory,
        postQuote,
    } = useApi();
    const { token, userInfo } = storeToRefs(useUserStore());
    const { preferences } = storeToRefs(usePreferenceStore());

    const isQuotesFetching = ref(false);
    const recapBets = ref([]);
    const selectedOutcome = ref(null);
    const rawEvent = ref(null);
    const event = computed(() => adaptEvent(rawEvent.value));
    const outcomeOptions = computed(() => rawEvent.value?.outcomes?.map((outcome, index) => adaptOutcome(outcome, index)) || []);
    const wagerPreference = computed(() => preferences.value?.wager);
    const shouldWarnMarketImpactWarning = computed(() => {
        if (!selectedOutcome.value || !currentQuote.value) {
            return false;
        }

        const warningMarketImpactThreshold = wagerPreference.value?.warn_when_market_impact_exceeds;
        if (warningMarketImpactThreshold) {
            return currentQuote.value.market_impact > warningMarketImpactThreshold;
        }
        return false;
    });

    const marketImpactWarningText = computed(() => {
        if (!shouldWarnMarketImpactWarning.value) {
            return null;
        }

        const warningMarketImpactThreshold = wagerPreference.value?.warn_when_market_impact_exceeds;
        return t('event_detail.market_impact_higher_than_warning_level', {
            marketImpact: formatPercentage(currentQuote.value.market_impact, 1),
            warningLevel: formatPercentage(warningMarketImpactThreshold, 1),
        });
    });

    const fetchEventDetail = async () => {
        const { data } = await getEventDetail(eventId);
        rawEvent.value = data.value;
        getQuotes();
    };

    const isChartDataFetched = ref(false);
    const isFetchingChartData = ref(false);
    const chartDate = useDateRange(7 * 24);
    const chartParams = {
        precision: 'hour',
        to: chartDate.to,
        from: chartDate.from,
    };
    const rawChartData = ref(null);
    const getOutcomesProbAndReturnChartData = async () => {
        if (!eventId) {
            return;
        }
        isFetchingChartData.value = true;
        const targetOutcomeId = selectedOutcome.value?._id;
        const { data, error } = await getEventMarketHistory(eventId, {
            ...chartParams,
            focused_event_outcome_id: targetOutcomeId,
        });
        if (error.value) {
            console.log('error when loading data', error.value);
            isFetchingChartData.value = false;
            return;
        }
        if (!data || data.length === 0) {
            console.log('Empty data params', chartParams);
            isFetchingChartData.value = false;
            return;
        }
        if (selectedOutcome.value && targetOutcomeId !== selectedOutcome.value._id) {
            console.log('outcome changed skip');
            isFetchingChartData.value = false;
            return;
        }
        rawChartData.value = data.value;
        isFetchingChartData.value = false;
    };

    const isFetchAll = ref(false);
    const currentQuotesPage = ref(1);
    const getQuotesParams = computed(() => ({
        pagination: true,
        page: currentQuotesPage.value,
        limit: 5,
    }));

    const getQuotes = async() => {
        isQuotesFetching.value = true;
        await getEventRecentWagers(eventId, getQuotesParams, {
            onResponse({ response }) {
                isQuotesFetching.value = false;
                const data = response._data;
                if (data) {
                    isFetchAll.value = !data.length;
                    recapBets.value = data.map((item) => {
                        const outcome = rawEvent.value?.outcomes.find(o => o._id  == item.event_outcome_id);
                        const time = formatDuration(moment.duration(moment(item.datetime).diff(moment())), locale.value, DURATION_MODE.COMPACT);
                        return {
                            wager: item.wager,
                            outcome_name: outcome.name,
                            time,
                            probability: outcome?.trader_info.estimated_probability ? formatPercentage(outcome?.trader_info.estimated_probability * 100) : '-',
                        };
                    });
                }
            },
        });
    };

    const currentQuote = ref(null);
    const minPledge = computed(() => {
        return +currentQuote.value?.min_pledge || +selectedOutcome.value?.trader_info?.min_pledge || MIN_PLEDGE;
    });
    const maxPledge = computed(() => {
        const { balance, wallet } = useWalletStore();
        if (wallet) {
            return Math.max(
                minPledge.value,
                Math.min(
                    balance,
                    Math.max(+currentQuote.value?.max_pledge || +selectedOutcome.value?.trader_info?.max_pledge),
                ),
            );
        }
        return Math.max(+currentQuote.value?.max_pledge || +selectedOutcome.value?.trader_info?.max_pledge, minPledge.value);
    });
    const maxLeverage = computed(() => +currentQuote.value?.max_leverage || +selectedOutcome.value?.trader_info?.max_leverage || 1);
    console.log(minPledge?.value, maxPledge?.value);
    const quickPledgeOptions = computed(() => {
        const options = [10, 20, 50, 100];
        return options.map(option => ({
            value: option,
            label: formatAmount(option),
            disabled: !selectedOutcome.value || option < minPledge.value || option > maxPledge.value,
        }));
    });
    const defaultLeverage = computed(() => {
        const defaultLeverage = wagerPreference.value?.default_leverage;
        if (defaultLeverage && defaultLeverage <= maxLeverage.value) {
            return defaultLeverage;
        } else {
            return null;
        }
    });
    const defaultPledge = computed(() => {
        const preferenceDefault = wagerPreference.value?.default_wager_size || null;
        if (preferenceDefault !== null && preferenceDefault <= maxPledge.value && preferenceDefault > minPledge.value) {
            return preferenceDefault;
        } else {
            return minPledge.value;
        }
    });

    const formData = reactive({
        event_id: eventId,
        event_outcome_id: null,
        leverage: 1,
        pledge: MIN_PLEDGE,
        wager: 0,
        loan: 0,
        force_leverage: !!depositTargetOutcomeId,
    });

    const loan = computed(() => formData.leverage > 1 ? Math.round(formData.pledge * (formData.leverage - 1)) : 0);
    const wager = computed(() => formData.pledge + loan.value);

    const dynamicIndicator = computed(() => {
        if (!currentQuote.value) {
            return null;
        }

        const result = [
            {
                name: t('event_detail.potential_payout'),
                value: formatAmount(currentQuote.value?.indicative_payout),
                percentage: formatSignedPercentage(currentQuote.value?.indicative_return),
            },
            {
                name: t('event_detail.new_probability'),
                value: formatProbability(currentQuote.value?.new_probability),
                percentage: formatSignedProbability(currentQuote.value?.probability_change, 1),
            },
        ];
        if (formData.leverage > 1 || formData.force_leverage) {
            return [
                {
                    name: t('event_detail.indicative_stop_level'),
                    tooltip: t('betting.indicative_stop_level_tooltip'),
                    value: formatProbability(currentQuote.value?.after_stop_probability !== null ? currentQuote.value?.after_stop_probability : currentQuote.value?.stop_probability),
                    percentage: null,
                }, ...result];
        }
        return result;
    });

    const isFetchingDynamicIndicator = ref(false);
    const shouldApplyDefaultLeverage = ref(false);
    const getDynamicIndicator = async (reset = false) => {
        if (!eventId || !selectedOutcome.value) {
            return;
        }
        isFetchingDynamicIndicator.value = true;
        const form = {
            ...formData,
            event_id: eventId,
            event_outcome_id: selectedOutcome.value._id,
            loan: loan.value,
            wager: wager.value,
        };

        const { data } = await postQuote(form, {
            onResponseError: async (error) => {
                const statusCode = error.response.status;
                const { blackbox_api_agent: blackboxAPIAgent = null } = await error.response._data;
                const isDev = window.location.hostname.split('.')[0] === 'dev';
                if (isDev && blackboxAPIAgent) {
                    debuggingInfo.value = blackboxAPIAgent;
                }
                if (reset) {
                    // noop
                    formData.leverage = 1;
                    formData.pledge = defaultPledge.value;
                    formData.wager = defaultPledge.value;
                    shouldApplyDefaultLeverage.value = true;
                } else {
                    if (statusCode === 400) {
                        // noop for 400 for now
                    } else {
                        useCommonErrorHandler(error.response);
                    }
                }
            },
        });

        if(data.value) {
            currentQuote.value = data.value;
            currentQuote.value.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
        }
        isFetchingDynamicIndicator.value = false;
    };

    const onSubmitBet = async() => {
        const { $localePath } = useNuxtApp();
        const saveWagerInfo = () => {
            nuxtStorage.localStorage.setData(LOGIN_RESUME_KEY, JSON.stringify({
                eventId: eventId,
                eventOutcomeId: selectedOutcome.value?._id,
                pledge: formData.pledge || MIN_PLEDGE,
                leverage: formData.leverage || 1,
            }), 5, 'm');
        };

        saveWagerInfo();

        // should login
        if (!token.value) {
            return navigateTo({
                path: $localePath('/auth/login'),
                query: {
                    hint: t('login.must_sign_in_hint'),
                    redirectURL: `/events/${eventId}`,
                },
            });
        }

        // should verify email
        if (!userInfo.value?.email_verified) {
            return navigateTo({
                path: $localePath('/profile'),
            });
        }

        // should deposit more
        const { balance } = useWalletStore();
        if (balance - formData.pledge < 0) {
            return navigateTo({
                path: $localePath('/deposit'),
            });
        }

        formData.event_id = eventId;
        formData.event_outcome_id = selectedOutcome.value?._id;
        formData.loan = loan.value;
        formData.wager = wager.value;
        formData.expected_payout = currentQuote.value.expected_payout;
        formData.force_leverage = !!depositTargetOutcomeId;
        const otherDynamicData = {
            event: event.value,
            outcome: selectedOutcome.value,
            quote: currentQuote.value,
        };

        const store = useBettingInfoStore();
        store.updatedBettingInfo(formData, otherDynamicData);

        navigateTo($localePath(`/betting/${eventId}`));
    };

    const onQuickPledge = (option) => {
        if (option.disabled) {
            return;
        }
        formData.pledge = option.value;
    };

    const fetchNewQuotes = async(entries) => {
        const isTargetVisible = entries[0].isIntersecting;
    
        if(isTargetVisible && !isFetchAll.value) {
            currentQuotesPage.value += 1;
        }
    };

    watch(selectedOutcome, () => {
        getOutcomesProbAndReturnChartData();
    });

    let formDataToResume = null;
    onMounted(async () => {
        await nextTick();
        await fetchEventDetail();


        const unallowedStatus = ['resolved', 'resolving', 'closed', 'closing'];
        if (unallowedStatus.includes(rawEvent.value.status)) {
            const { $localePath, $showToast } = useNuxtApp();
            $showToast(
                'error',
                t(`event_detail.sorry_event_is_${rawEvent.value.status}`),
            );

            if (window.history.length > 1) {
                window.history.back();
            } else {
                navigateTo($localePath('/'));
            }
            return;
        }
        await getOutcomesProbAndReturnChartData();

        const options = {
            root: document.querySelector('#scroll-wrapper'),
            rootMargin: '0px',
            threshold: 0.8,
        };
        const target = document.querySelector('#observer-target');
        if (target) {
            const observer = new IntersectionObserver(fetchNewQuotes, options);
            observer.observe(target);
        }
        if (defaultLeverage.value) {
            formData.leverage = defaultLeverage.value;
        }

        const resumeStringifiedData = nuxtStorage.localStorage.getData(LOGIN_RESUME_KEY);
        if (resumeStringifiedData) {
            const data = JSON.parse(resumeStringifiedData);
            if (data.eventId === eventId) {
                selectedOutcome.value = outcomeOptions.value.find(o => o._id === data.eventOutcomeId);
                formDataToResume = {
                    pledge: data.pledge,
                    leverage: data.leverage,
                };
            }
            nuxtStorage.localStorage.setData(LOGIN_RESUME_KEY, null);
        }
    });

    watch(selectedOutcome, async () => {
        if (event.value && selectedOutcome.value) {
            // reset when changing outcome
            formData.pledge = MIN_PLEDGE;
            formData.wager = 0;
            formData.leverage = 1;
            formData.loan = 0;

            if (!isChartDataFetched.value) {
                formData.pledge = formDataToResume?.pledge ||  defaultPledge.value;
                formData.leverage = formDataToResume?.leverage || 1;
                formData.wager = formData.pledge * formData.leverage;
                await Promise.all([
                    getOutcomesProbAndReturnChartData(),
                    getDynamicIndicator(),
                ]).finally(() => {
                    isChartDataFetched.value = true;
                });
            } else {
                isChartDataFetched.value = false;
                await getDynamicIndicator(true);
                await getOutcomesProbAndReturnChartData();
                isChartDataFetched.value = true;
            }
        }
    });
    
    watch(formData, debounce(() => {
        getDynamicIndicator().then(() => {
            if (shouldApplyDefaultLeverage.value && defaultLeverage.value) {
                shouldApplyDefaultLeverage.value = false;
                if (defaultLeverage.value) {
                    formData.leverage = defaultLeverage.value;
                }
            }
        });
    }, 500));

    const depositingTargetOutcome = computed(() => {
        if (!depositTargetOutcomeId) {
            return null;
        }
        return outcomeOptions.value.find(o => o._id === depositTargetOutcomeId);
    });

    watch(depositingTargetOutcome, () => {
        selectedOutcome.value = depositingTargetOutcome.value;
    });

    return {
        isFetchingChartData,
        currentQuote,
        event,
        outcomeOptions,
        selectedOutcome,
        formData,
        isFetchingDynamicIndicator,
        dynamicIndicator,
        minPledge,
        maxPledge,
        maxLeverage,
        shouldWarnMarketImpactWarning,
        marketImpactWarningText,
        quickPledgeOptions,
        isChartDataFetched,
        onSubmitBet,
        onQuickPledge,
        debuggingInfo,
        recapBets,
        rawChartData,
        depositTargetOutcomeId,
        depositingTargetOutcome,
    };
}
