<script setup>

definePageMeta({
    middleware: ['user-auth'],
});

const { onDepositClick, onWithdrawClick } = await useDepositWithdrawButton();

</script>

<template>
  <section class="bg-white">
    <h3 class="text-center text-indigo-500 border-indigo-500 border-bottom-1 py-2 px-3">
      {{ $t('deposit_withdrawal.page_title') }}
    </h3>

    <div class="pt-4 pb-2 px-3">
      <div class="flex flex-column gap-4">
        <Button
          rounded
          size="large"
          icon="pi pi-angle-right"
          icon-pos="right"
          :label="$t('button.make_a_deposit')"
          class="p-button-action flex-1"
          @click="onDepositClick"
        />
        <Button
          rounded
          size="large"
          icon="pi pi-angle-right"
          icon-pos="right"
          :label="$t('button.make_a_withdrawal')"
          class="p-button-action flex-1"
          @click="onWithdrawClick"
        />
        <Button
          rounded
          size="large"
          icon="pi pi-angle-right"
          icon-pos="right"
          :label="$t('button.go_deposit_withdrawal_history')"
          class="p-button-action flex-1"
          @click="navigateTo(localePath('/deposit-withdrawal/history'))"
        />
      </div>
      <p class="mt-3 text-xs text-gray-600 text-center">
        {{ $t('deposit_withdrawal.hint') }}
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  margin: 0 1.25rem;
}
</style>
