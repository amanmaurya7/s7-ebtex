<script setup>
const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const { showToastWithRedirect } = useToastWithRedirect();
const orderId = route.params.orderId;

onMounted(async () => {
    try {
        const data = await useApi().getWithdrawRequest(orderId);

        if (data.status.toLowerCase() === 'success') {
            await router.replace('/withdrawal/success');
        } else if (data.status.toLowerCase() === 'failed') {
            await router.replace('/withdrawal/failed'); 
        } else {
            await router.replace('/portfolio');
        }
    } catch (error) {
        showToastWithRedirect('error', t('errors.fail_to_get_result'), '/');
    }
});
</script>

<template>
<p class="my-4 py-4 text-lg font-bold text-center">{{ $t('checking') }}</p>
</template>
