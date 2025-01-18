<script setup>
import { activeWagerPositionSortOptions, inactiveWagerPositionSortOptions } from '@/pages/constants';

const emit = defineEmits(['input']);

const props = defineProps({
    selectedFilter: {
        type: String,
        default: 'active',
    },
    options: {
        type: Array,
        default: () => [],
    },
    value: {
        type: Object,
        default: () => {},
    },
});

const selectedSort = ref(props.value);
watch(selectedSort, (newVal) => {
    emit('input', newVal);
});
</script>

<template>
  <Dropdown
    v-model="selectedSort"
    :options="selectedFilter === 'active' ? activeWagerPositionSortOptions : inactiveWagerPositionSortOptions"
    option-label="name"
    :select-on-focus="true"
    :pt="{ 'root': { class: 'filter' }, 'panel': { class: 'filter' } }"
  >
    <template #value="{ value }">
      {{ $t(value.name) }}
    </template>
    <template #option="{ option }">
      {{ $t(option.name) }}
    </template>
  </Dropdown>
</template>