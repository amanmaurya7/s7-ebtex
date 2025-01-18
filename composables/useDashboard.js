import { useUserStore } from '@/store/user';
import { defaultAvatar } from '@/assets/images';
import { storeToRefs } from 'pinia';
import { NA } from '@/pages/constants';

export const useDashboard = () => {
    const { t, locale } = useNuxtApp().$i18n;
    const { getDashboard } = useApi();
    const userStore = useUserStore();
    const { userInfo } = storeToRefs(userStore);
    const isJP = computed(() => locale.value === 'ja');
    const userCardData = ref({});
    const walletData = ref({});

    getDashboard({}, {
        onResponse({ response }) {
            if (response.error) {
                console.error(response.error);
                return;
            }

            const data = response._data;
            const {
                num_trophies,
                num_ranking,
                rate_return,
                rate_winning,
                fund_available,
                profit,
                wager_value_24hr_change,
                best_case_fund_available,
                best_case_cumulative_profit,
                best_case_fund_available_24hr_change,
                expected_fund_available,
                expected_fund_available_24hr_change,
                expected_cumulative_profit,
                fund_available_24hr_change,
            } = data;

            userCardData.value = {
                name: userInfo.value?.display_name,
                avatar: userInfo.value?.avatar || defaultAvatar,
                investStat: [
                    {
                        key: 'TROPHY',
                        label: t('dashboard.trophy'),
                        value: num_trophies
                            ? isJP.value ? `${num_trophies}個` : num_trophies
                            : NA,
                    },
                    {
                        key: 'RANK',
                        label: t('dashboard.rank'),
                        value: num_ranking
                            ? isJP.value ? `${num_ranking}位` : `№${num_ranking}`
                            : NA,
                    },
                    {
                        key: 'WIN_RATE',
                        label: t('dashboard.win_rate'),
                        value: formatPercentage(rate_winning * 100, 1),
                    },
                    {
                        key: 'RETURN',
                        label: t('dashboard.return'),
                        value: formatPercentage(rate_return * 100),
                    },
                ],
            };

            walletData.value = {
                balance:  fund_available || 0,
                accumulated_profit_loss: profit || 0,
                one_day_change: fund_available_24hr_change || 0,
                best_case_fund_available: best_case_fund_available || 0,
            };
        },
    });

    return {
        userCardData,
        walletData,
    };
};
