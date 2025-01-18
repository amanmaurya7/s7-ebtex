<script setup>
const props = defineProps({
    rows: { type: Array, required: true, default: () => [] },
    columns: { type: Array, required: true, default: () => [] },
    isFetching: { type: Boolean, required: true, default: true },
    noDataLabel: { type: String, required: false, default: '' },
});
const gridContentStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${props.columns.length}, 1fr)`,
};
</script>

<template>
  <div class="inline-table-container">
    <div class="table-headers" :style="gridContentStyle">
      <div v-for="({ value, label }) in columns" :key="value" class="table-header">
        {{ label }}
      </div>
    </div>

    <div id="scroll-wrapper">
      <div v-show="isFetching" class="loading_mask">
        <ProgressSpinner />
      </div>

      <div class="relative h-full">
        <div v-if="!rows.length" class="text-xs text-gray-200 h-full flex align-items-center justify-content-center">
          <p>{{ noDataLabel || $t('general.no_data') }}</p>
        </div>

        <DataTable
          v-else
          :value="rows"
          class="inline-table p-datatable-sm"
          size="small"
          :row-class="(data) => [{ 'row-highlight': data.highlight }]"
          :pt="{
            bodyrow: {
              style: {
                display: 'grid',
                gridTemplateColumns: `repeat(${props.columns.length}, 1fr)`
              }
            }
          }"
        >
          <Column v-for="({ value }) in columns" :key="value" :field="value" :pt="{ headercell: { class: 'hidden'} }" />
        </DataTable>

        <div id="observer-target" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.inline-table-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow: hidden;
  color: #fff;
  font-size: 0.875rem;
  
  :deep(.inline-table) {
    width: 100%;

    .p-datatable-tbody {
      tr {
       color: #fff;
       background-color: transparent;
      }

      td {
        font-size: 0.875rem;
        padding: .5rem .25rem;
        text-align: center;
      }
    }
  }
  
  .table-headers {
    width: 100%;
    background-color: var(--darkgray-600);
    .table-header {
      font-size: 0.875rem;
      padding: .25rem;
      text-align: center;
    }
  }
  
  #scroll-wrapper {
    width: 100%;
    aspect-ratio: 3 / 2;
    background-color: var(--gray-800);
  }

  .loading_mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($color: #000000, $alpha: 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

</style>
