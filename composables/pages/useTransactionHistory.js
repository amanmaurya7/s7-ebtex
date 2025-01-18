import { storeToRefs } from 'pinia';
import { useWalletStore } from '@/store/wallet';
import { TRANSACTION_TYPE } from '@/pages/constants';

export default function useTransactionHistory() {
    const { t } = useNuxtApp().$i18n;
    const { getTransactions } = useApi();
    const { wallet } = storeToRefs(useWalletStore());

    const dataFetchingStatus = reactive({
        isFetchAll: false,
        isFetching: false,
        currentPage: 1,
    });

    const transactions = ref([]);
    const columns = computed(() => {
        return [
            { value: 'datetime', label: t('deposit_withdrawal_history.date') },
            { value: 'amount', label: t('deposit_withdrawal_history.amount') },
            { value: 'transaction_type', label: t('deposit_withdrawal_history.transaction_type') },
        ];
    });

    const params = computed(() => ({
        pagination: true,
        limit: 1000,
        page: dataFetchingStatus.currentPage,
    }));

    const transactionTypes = [TRANSACTION_TYPE.DEPOSIT, TRANSACTION_TYPE.WITHDRAW, TRANSACTION_TYPE.WITHDRAW_ROLLBACK];
    const rowData = computed(() => {
        const rows = transactions.value || [];
        return rows
            .filter(transaction => transactionTypes.includes(transaction.transaction_type))
            .map(transaction => {
                return {
                    datetime: transaction.datetime,
                    amount: formatAmount(transaction.amount),
                    transaction_type: transaction.transaction_type,
                    transaction_type_label: t(`deposit_withdrawal_history.${transaction.transaction_type}`),
                };
            });
    });

    const setupFetch = async () => {
        if (!wallet.value?.id) {
            return;
        }

        dataFetchingStatus.isFetching = true;
        await getTransactions(wallet.value.id, params, {
            onResponse({ response }) {
                dataFetchingStatus.isFetching = false;
                const data = response._data;
                if (data) {
                    dataFetchingStatus.isFetchAll = !data.length;
                    const newArray = [...transactions.value];
                    newArray.push(...data);
                    transactions.value = newArray;
                }
            },
        });
    };

    const fetchTransactionData = async(entries) => {
        const isTargetVisible = entries[0].isIntersecting;

        if(isTargetVisible && !dataFetchingStatus.isFetchAll) {
            dataFetchingStatus.currentPage += 1;
        }
    };

    const createIntersectionObserver = () => {
        const options = {
            root: document.querySelector('#scroll-wrapper'),
            rootMargin: '0px',
            threshold: 0.8,
        };
        const target = document.querySelector('#observer-target');
        if (target) {
            const fetchData = fetchTransactionData;
            const observer = new IntersectionObserver(fetchData, options);
            observer.observe(target);
        }
    };

    onMounted(async () => {
        await nextTick();
        await setupFetch();
        createIntersectionObserver();
    });

    return {
        dataFetchingStatus,
        rowData,
        columns,
    };
}
