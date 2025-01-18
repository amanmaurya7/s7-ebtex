import { NA } from '@/pages/constants';
import { COIN_PILE, FINANCIAL_CHART, PAYMENT } from '@/assets/images';
import { round, formatDate } from '@/utils/formatters';

export const adaptEvent = (event) => {
    if (!event) {
        return null;
    }

    const outcomes = event?.outcomes || [];
    const probabilities = outcomes.map((o) => o.trader_info?.estimated_payout);
    const minReturn = round(Math.min(...probabilities)) ?? NA;
    const maxReturn = round(Math.max(...probabilities)) ?? NA;

    const maxLeverages = outcomes.map((o) => o.trader_info?.max_leverage);
    const maxLeverage = Math.max(1, ...maxLeverages) ?? NA;

    const traders = outcomes.reduce((accumulator, o) => accumulator + o.histories.num_users_participated, 0);

    return {
        ...event,
        minReturn,
        maxReturn,
        maxLeverage,
        traders,
        endTime: event.ends_at || NA,
        imageUrl: event.event_images_url && event.event_images_url[0],
        recommendedImageUrl: event.recommended_images_url && event.recommended_images_url[0],
    };
};

export const adaptOutcome = (outcome, index, wagerStatus = null) => {
    if (!outcome) {
        return null;
    }
    return {
        ...outcome,
        title: outcome.name,
        value: String.fromCharCode(index + 'a'.charCodeAt(0)).toUpperCase(),
        expectedProbability: formatProbability(outcome.trader_info?.estimated_probability),
        indicativeReturn: formatPercentage(outcome.trader_info?.estimated_payout),
        wagerStatus,
        maxLeverage: outcome.trader_info?.max_leverage,
    };
};

export const getWagerDetail = ({
    wagerStatus = null,
    indicativePayoutChange = null,
    profit = null,
    profitChange = null,
    wageredAt = null,
    endsAt = null,
    stopProbability = null,
    marketImpact = null,
    reason = null,
    isEventResolved = false,
    isWagerWin = false,
    actualOutcome = null,
    isActive,
    // start: fields checked after revamping/calculation book
    probability, // AW4
    payoutReturnForNewWagers, // AW5
    pledge,
    leverage,
    wager,
    indicativePayout = null, // AW11
    indicativeReturn = null, // AW12
    realizedReturn, // IW12
    realizedPayout, // IW11
    // end: fields checked after revamping/calculation book
}) => {
    const { t } = useNuxtApp().$i18n;
    return [
        {
            type: 'table',
            imageUrl: PAYMENT,
            items: [
                { label: t('investment.cash_used'), value: formatAmount(pledge) },
            ],
            divider: true,
        },
        {
            type: 'table',
            imageUrl: COIN_PILE,
            items: [
                { label: t('investment.wager'), value: formatAmount(wager) },
                { label: t('investment.leverage_used'), value: parseFloat(leverage).toFixed(1) },
            ],
            divider: true,
        },
        {
            type: 'table',
            imageUrl: FINANCIAL_CHART,
            items: [
                { label: t('investment.indicative_payout'), value: formatAmount(isActive ? indicativePayout : realizedPayout) },
                { label: '', value: formatSignedPercentage(isActive ? indicativeReturn : realizedReturn) },
            ],
            divider: true,
            hidden: isEventResolved,
        },
        {
            type: 'table',
            imageUrl: FINANCIAL_CHART,
            items: [
                { label: t('investment.final_payout'), value: formatAmount(realizedPayout) },
                { label: '', value: formatPercentage(realizedReturn) },
            ],
            divider: true,
            hidden: !isEventResolved,
        },
        {
            type: 'list',
            items: [
                {
                    label: t('investment.indicative_stop_probability'),
                    value: stopProbability ? formatProbability(stopProbability) : t(`general.${NA}`),
                    hidden: isEventResolved,
                },
                {
                    label: t('investment.market_impact'),
                    value: formatProbability(marketImpact, 1),
                    hidden: !marketImpact,
                },
                {
                    label: t('investment.time_of_last_wager'),
                    value: wageredAt ? formatDate(wageredAt) : NA,
                    hidden: !wageredAt || isEventResolved,
                },
                {
                    label: t(isWagerWin ? 'investment.time_of_resolution' : 'investment.termination_date'),
                    value: endsAt ? formatDate(endsAt) : NA,
                    hidden: !endsAt || !isEventResolved,
                },
                {
                    label: t('investment.reason_for_termination'),
                    value: reason || NA,
                    hidden: wagerStatus == null || wagerStatus === 0 || wagerStatus === 1,
                },
                {
                    label: t('investment.actual_outcome'),
                    value: actualOutcome,
                    hidden: !actualOutcome || isWagerWin,
                    class: 'text-gold-500 mt-2',
                },
            ],
            divider: false,
        },
    ];
};
