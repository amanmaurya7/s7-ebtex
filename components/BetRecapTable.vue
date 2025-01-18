<script setup>
defineProps({
    bets: {
        type: Array,
        required: true,
        default: () => [],
    },
});
</script>

<template>
  <div v-if="bets.length === 0" class="bet-recap-empty">
    {{ $t('event_detail.no_quotes') }}
  </div>
  <div v-else class="table-container">
    <table class="bet-recap-table">
      <thead>
        <tr class="bet-row">
          <th class="bet-header-cell font-bold whitespace-nowrap" style="min-width: 70px;">
            {{ $t('betting_recap.trade') }}
          </th>
          <th class="bet-header-cell font-bold">
            {{ $t('betting_recap.outcome') }}
          </th>
          <th class="bet-header-cell font-normal whitespace-nowrap">
            {{ $t('betting_recap.time') }}
          </th>
          <th class="bet-header-cell font-normal whitespace-nowrap">
            {{ $t('betting_recap.probability') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr><td colspan="4" class="bet-row" /></tr>
        <tr><td colspan="4" class="bet-row" /></tr>
        <tr v-for="bet in bets" :key="bet.id" class="bet-row">
          <td class="bet-cell bet-cell-wager">
            {{ formatAmount(bet.wager) }}
          </td>
          <td class="bet-cell bet-cell-outcome-name px-2">
            {{ bet.outcome_name }}
          </td>
          <td class="bet-cell bet-cell-time whitespace-nowrap uppercase">
            {{ bet.time }}
          </td>
          <td class="bet-cell bet-cell-probability font-bold">
            {{ bet.probability }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  padding: 2rem .75rem;
  background: var(--m1-500);
}

.bet-recap-table {
  border-collapse: collapse; 
  width: 100%;
  background: var(--m1-500);
}

.bet-header-cell {
  color: white;
  font-size: 0.75rem;
  padding: 0 0 0.25rem;
  text-align: left;
}

.bet-row {
  padding: 0.25rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--m3-a20);
  }
}

.bet-cell {
  padding: 0.15rem 0.25rem;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
}

.bet-cell-wager {
  color: var(--k1-500);
  font-weight: bold;
}

.bet-cell-outcome-name, .bet-cell-probability {
  color: white;
}

.bet-cell-probability {
  text-align: right;
}

.bet-cell-outcome-name {
  justify-content: flex-start;
}

.bet-cell-time {
  color: white;
  font-size: .75rem;
}

.bet-recap-empty {
  text-align: center;
  color: white;
  font-weight: bold;
  background: var(--m1-500);
  padding: 2rem;
}
</style>
