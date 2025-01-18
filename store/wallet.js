import { defineStore } from 'pinia';

export const useWalletStore = defineStore('wallet', () => {
    const { getWallets } = useApi();
    const balance = ref(0);
    const currency = ref('USD');
    const wallet = ref(null);

    const resetWallet = () => {
        balance.value = 0;
        currency.value = 'USD';
        wallet.value = null;
    };

    const getWallet = async () => {
        const { data } = await getWallets(null, {
            onResponseError: () => {
                // noop
            },
        });

        const result = data.value?.length && data.value[0];
        if (result) {
            const result = data.value[0];
            wallet.value = result;
            balance.value =  parseFloat(result.balance);
            currency.value = result.currency;
        } else {
            resetWallet();
        }
    };

    return { balance, currency, wallet, getWallet, resetWallet };
});
