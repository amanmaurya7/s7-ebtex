<script setup>
definePageMeta({
    layout: 'full',
});

const route = useRoute();
const router = useRouter();
const { getDepositRequest, getWithdrawRequest } = useApi();

// deposit or withdraw
const type = route.query.type;
const orderId = route.query.orderId;

const checkStatus = async () => {
    try {
        const result = await (type === 'deposit' ? getDepositRequest(orderId) : getWithdrawRequest(orderId));
        
        if (result.status === 'success') {
            router.replace('/deposit/success');
        } else if (result.status === 'failed') {
            router.replace('/deposit/failed');
        }
    } catch (error) {
        // silently fail
        router.replace('/');
    }
};

// Poll every 3 seconds
const pollInterval = setInterval(checkStatus, 3000);

// Clean up interval on component unmount
onUnmounted(() => {
    clearInterval(pollInterval);
});

</script>

<template>
  <div class="py-4 text-lg font-bold text-center text-white bg-m1-500" style="min-height: calc(100vh - 60px);">
    <div class="my-4 font-1375 uppercase">
      {{ $t('transaction.processing') }}
    </div>
    <div class="font-100 font-bold">
      {{ $t('transaction.waiting_for_confirmation') }}
    </div>
    <img src="/images/v1.5/logo-list-loading.png" alt="loading" width="40" height="40" class="inline-block my-4">
  </div>
</template>