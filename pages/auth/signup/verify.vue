<script setup>
import { useUserStore } from '@/store/user';
import { storeToRefs } from 'pinia';
import { KYC_ELEMENT_ID } from '@/pages/constants';

definePageMeta({
    middleware: ['user-auth'],
});

const { $localePath } = useNuxtApp();
const router = useRouter();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

if (userInfo.identity_verified) {
    router.replace($localePath('/profile'));
}

useKYC({ elId: KYC_ELEMENT_ID.DEFAULT });
</script>

<template>
  <div class="bg-m1-500">
    <div class="text-white text-center pb-250 pt-4 font-bold font-150 uppercase" v-html="$t('profile.verify_title')" />
    <div :id="KYC_ELEMENT_ID.DEFAULT" class="bg-white" />
  </div>
</template>
