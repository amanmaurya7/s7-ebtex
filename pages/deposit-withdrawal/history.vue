<script setup>
import useTransactionHistory from '../../composables/pages/useTransactionHistory';

definePageMeta({
    middleware: ['user-auth'],
});

const { onDepositClick, onWithdrawClick } = await useDepositWithdrawButton();

const {
    dataFetchingStatus,
    rowData,
    columns,
} = useTransactionHistory();
</script>

<template>
  <section class="bg-white">
    <h3 class="text-center text-indigo-500 border-indigo-500 border-bottom-3 py-2 px-3">
      {{ $t('deposit_withdrawal_history.page_title') }}
    </h3>

    <div class="border-indigo-500 border-top-1">
      <InlineTable
        :rows="rowData"
        :columns="columns"
        :is-fetching="dataFetchingStatus.isFetching"
      />
    </div>

    <div class="flex gap-3 px-2 py-3">
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
    </div>
  </section>
</template>

<style lang="scss" scoped>
section {
  margin: 0 1.25rem;
}
</style>
