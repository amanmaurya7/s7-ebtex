import { defineStore } from 'pinia';

export const useBettingInfoStore = defineStore('bettingInfo', () => {
    const event = ref(null);
    const outcome = ref(null);
    const quote = ref(null);
    const formData = ref({});
    const debuggingInfo = ref(null);

    function updatedBettingInfo(mainData, otherData) {
        formData.value = mainData;
        event.value = otherData.event;
        outcome.value = otherData.outcome;
        quote.value = otherData.quote;
    }

    function updateDebuggingInfo(data) {
        debuggingInfo.value = data;
    }

    function clearBettingInfo() {
        formData.value = {};
        event.value = null;
        outcome.value = null;
        quote.value = null;
        debuggingInfo.value = null;
    }

    return {
        formData,
        event,
        outcome,
        quote,
        debuggingInfo,
        updatedBettingInfo,
        updateDebuggingInfo,
        clearBettingInfo,
    };
}, {
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'bettingInfo',
                storage: process.client ? localStorage : null,
            },
        ],
    },
});
