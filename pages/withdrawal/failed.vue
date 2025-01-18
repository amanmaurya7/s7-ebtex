<script setup>
import DepositWithdrawResult from '../../components/Transactions/DepositWithdrawResult.vue';
</script>

<template>
  <DepositWithdrawResult
    :is-success="false"
    type="withdrawal"
  />
</template>

