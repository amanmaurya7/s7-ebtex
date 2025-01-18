<script setup>

</script>

<template>
  <InputNumber class="leverage-input" />
</template>

<style scoped lang="scss">
  :deep(.p-inputnumber) {
    .p-inputtext {
        font-weight: bold;
        border-bottom: 2px solid var(--m3-a20);
        border-radius: 0;
        padding: .25rem .5rem 0;
        width: 100%;
        font-size: 1.875rem;
        position: relative;

        &:focus {
          color: var(--k1-500);
          border-bottom: 2px solid var(--k1-500);
        }
    }

    &.leverage-input {
      position: relative;
      display: inline-block;
    }

    &.leverage-input .p-inputtext {
      padding-left: 1rem;
      display: inline-block;
    }
    &.leverage-input::after {
      font-weight: bold;
      font-size: .75rem;
      display: block;
      margin-right: .25rem;
      color: var(--text-color);
      position: absolute;
      bottom: 0;
      left: 0;
      transform: translateY(-50%);
    }
    
    &.leverage-input::after {
      content: 'X';
    }
  }
</style>