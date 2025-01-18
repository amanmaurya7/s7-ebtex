import { defineStore } from 'pinia';

export const usePaymentFlowStore = defineStore('paymentFlow', () => {
    const depositFormData = ref({});
    const withdrawFormData = ref({});

    function updateDepositFormData(formData) {
        if (formData) {
            depositFormData.value = { ...formData };
        }
    }

    function updateWithdrawFormData(formData) {
        if (formData) {
            withdrawFormData.value = { ...formData };
        }
    }

    function clearDepositFormData() {
        depositFormData.value = {};
    }

    function clearWithdrawFormData() {
        withdrawFormData.value = {};
    }

    return {
        depositFormData,
        withdrawFormData,
        updateDepositFormData,
        updateWithdrawFormData,
        clearDepositFormData,
        clearWithdrawFormData,
    };
}, {
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'paymentFlow',
                storage: process.client ? localStorage : null,
            },
        ],
    },
});
