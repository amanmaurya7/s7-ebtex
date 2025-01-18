<script setup>
import moment from 'moment';
import { TRANSACTION_TYPE } from '@/pages/constants';

const humanizeTimestamp = (timestamp) => {
    const now = moment();
    return moment
        .duration(moment(timestamp).diff(now))
        .humanize(true);
};


defineProps({
    transactions: {
        type: Array,
        required: true,
        default: () => [],
    },
});
</script>

<template>
  <div v-if="transactions.length === 0" class="transaction-history-empty">
    {{ $t('portfolio.no_transactions') }}
  </div>
  <div v-else class="transaction-history-table">
    <div v-for="transaction in transactions" :key="transaction.id" class="transaction-row">
      <div class="transaction-cell transaction-cell-icon">
        <img 
          :src="transaction.type === TRANSACTION_TYPE.WITHDRAW ? '/images/v1.5/icon-chevron-down.png' : '/images/v1.5/icon-chevron-up.png'" 
          :alt="transaction.type"
          width="12"
        >
      </div>
      <div class="transaction-cell transaction-cell-type uppercase font-75">
        {{ transaction.transaction_type_label }}
      </div>
      <div class="transaction-cell transaction-cell-amount">
        {{ transaction.amount }}
      </div>
      <div class="transaction-cell transaction-cell-time">
        {{ humanizeTimestamp(transaction.datetime) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaction-history-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: black;
  padding: 1.375rem .25rem;
  padding: 1.5rem 1rem;
}

.transaction-row {
  display: grid;
  grid-template-columns: 24px 1fr 1fr 1fr;
  padding: 0.25rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--m3-a20);
  }
}

.transaction-cell {
  padding: 0.15rem 0.25rem;
  display: flex;
  align-items: center;
}

.transaction-cell-icon {
  justify-content: center;
}

.transaction-cell-type {
  color: white;
  font-weight: bold;
}

.transaction-cell-amount {
  color: var(--k1-500);
  font-weight: bold;
  justify-content: flex-start;
}

.transaction-cell-time {
  color: white;
  font-size: .75rem;
  justify-content: flex-end;
}

.transaction-history-empty {
  text-align: center;
  color: white;
  font-weight: bold;
  background: var(--m1-500);
  padding: 2rem;
}

</style>
