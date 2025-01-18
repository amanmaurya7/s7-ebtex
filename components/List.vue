<script setup>
const props = defineProps({
    rows: { type: Array, required: true, default: () => [] },
});

const filteredRows = computed(() => {
    return props.rows.filter((row) => !row.hidden);
});
</script>

<template>
  <div v-for="(row, rowIndex) in filteredRows" :key="rowIndex">
    <div class="list-item" :class="{'divider' : row.divider}">
      <template v-if="row.type === 'table'">
        <div class="flex gap-2 align-items-center">
          <img
            v-if="row.imageUrl"
            :src="row.imageUrl"
            alt="table image"
            class="flex-shrink-0"
            width="36"
            height="36"
          >
          <div v-for="(item, itemIndex) in row.items" :key="itemIndex" :class="{'text-right': itemIndex > 0, 'flex-1': itemIndex === 0}">
            <div class="text-sm text-white">
              {{ item.label }}
            </div>
            <div class="font-bold">
              {{ item.value }}
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex flex-column gap-2 text-white text-xs">
          <div
            v-for="(item, itemIndex) in row.items"
            :key="itemIndex"
            class="gap-2 justify-content-between"
            :class="{ hidden: item.hidden, flex: !item.hidden, [item.class]: item.class }"
          >
            <div>{{ item.label }}</div>
            <div class="flex-1 text-right font-bold">
              {{ item.value }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-item {
  padding: .5rem .75rem;
  background-color: var(--blue-500);
  color: var(--gold-500);

  &.divider {
    border-bottom: .5px solid #000;
  }
}
</style>
