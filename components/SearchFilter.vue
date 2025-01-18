<script setup>
const emit = defineEmits(['category-slugs-update', 'tag-slugs-update']);
const props = defineProps({
    tagOptions: { type: Array, default: () => [] },
    categoryOptions: { type: Array, default: () => [] },
    preselectedTagSlugs: { type: Array, default: () => [] },
    preselectedCategorySlugs: { type: Array, default: () => [] },
});

const selectedTagSlugs = ref(props.preselectedTagSlugs);
const selectedCategorySlugs = ref(props.preselectedCategorySlugs);

const overlayPanel = ref();
const overlayOpened = computed(() => overlayPanel.value?.visible);
const currentFilterCount = computed(() => selectedCategorySlugs.value.length + selectedTagSlugs.value.length);

const toggleOverlay = (event) => {
    overlayPanel.value.toggle(event);
};

const onToggleCategory = (category) => {
    const updated = [...selectedCategorySlugs.value];
    const slug = category.value;
    if (selectedCategorySlugs.value.includes(slug)) {
        updated.splice(selectedCategorySlugs.value.indexOf(slug), 1);
    } else {
        updated.push(slug);
    }
    selectedCategorySlugs.value = updated;
};

const onToggleTag = (tag) => {
    const updated = [...selectedTagSlugs.value];
    const slug = tag.value;
    if (selectedTagSlugs.value.includes(slug)) {
        updated.splice(selectedTagSlugs.value.indexOf(slug), 1);
    } else {
        updated.push(slug);
    }
    selectedTagSlugs.value = updated;
};

const clear = () => {
    selectedTagSlugs.value = [];
    selectedCategorySlugs.value = [];
    emitSelection();
};

const emitSelection = () => {
    emit('category-slugs-update', selectedCategorySlugs.value);
    emit('tag-slugs-update', selectedTagSlugs.value);
};

</script>
<template>
  <div
    class="filter-button-container"
    :class="{'overlay-open': overlayOpened}"
    @click="toggleOverlay"
  >
    <div v-if="currentFilterCount" class="filter-count-badge">
      {{ currentFilterCount }}
    </div>
    <span>{{ $t('search_filter.filter') }}</span>
    <img class="dropdownicon" src="/images/v1.5/icon-chevron-down.png" alt="down-arrow" width="6" height="5">
  </div>
  <OverlayPanel
    ref="overlayPanel"
    append-to=".filter-button-container"
  >
    <div class="filter-panel-container">
      <div class="category-filter">
        <div class="filter-header">
          <img src="/images/v1.5/icon-category-green.png" width="12" height="12">
          {{ $t('search_filter.by_category') }}
        </div>
        <div class="filter-item-list">
          <div
            v-for="category in categoryOptions"
            :key="category.value"
            class="filter-item"
            :class="{'active': selectedCategorySlugs.indexOf(category.value) >= 0}"
            @click.stop.prevent="onToggleCategory(category)"
          >
            {{ category.label }}
          </div>
        </div>
        <div class="clear-button" @click="clear">
          {{ $t('search_filter.clear') }}
        </div>
      </div>
      <div class="tag-filter">
        <div class="filter-header">
          <img src="/images/v1.5/icon-tag-green.png" width="12" height="12">
          {{ $t('search_filter.by_tag') }}
        </div>
        <div class="filter-item-list">
          <div
            v-for="tag in tagOptions"
            :key="tag.value"
            class="filter-item"
            :class="{'active': selectedTagSlugs.indexOf(tag.value) >= 0}"
            @click.stop.prevent="onToggleTag(tag)"
          >
            {{ tag.label }}
          </div>
        </div>
        <div class="refine-button" @click="emitSelection">
          {{ $t('search_filter.refine') }}
        </div>
      </div>
    </div>
  </OverlayPanel>
</template>

<style scoped>

.filter-button-container {
    font-size: 0.75rem;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.5rem;
    border-radius: 5px;

    .dropdownicon {
        filter: invert(1);
        object-fit: contain;
    }
}

.overlay-open.filter-button-container {
    .dropdownicon {
        filter: invert(0);
    }
    color: white;
    background: black;
}

.filter-count-badge {
    border-radius: 5px;
    background: var(--m4-500);
    min-width: 0.9375rem;;
    height: 0.9375rem;;
    text-align: center;
    color:white;
}

:deep(.p-overlaypanel-content) {
    padding: 0;
}

.filter-panel-container {
    display: flex;
    align-items: flex-start;

    & > div {
        flex: 1
    }
}

.filter-header {
    min-width: 140px;
    padding: 0.75rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border-bottom: 1px solid var(--m3-a20);
    background-color: white;
}

.filter-item-list {
    border-right: 1px solid var(--m3-a20);
    height: 215px;
    overflow: auto;
}

.filter-item {
    font-size: 0.75rem;
    font-weight: bold;
    text-transform: uppercase;
    padding: 0.625rem 1.875rem;

    &.active {
        background: var(--m4-500);
        color: white;
    }
}

.category-filter {
    background: var(--w2);
}

.tag-filter {
    background: var(--w2);
}

.clear-button {
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.9375rem 0;
    background: white;
    border-top: 1px solid var(--m3-a20);
    border-right: 1px solid var(--m3-a20);
    color: var(--m4-500);
}

.refine-button {
    text-transform: uppercase;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.9375rem 0;
    color: white;
    border-top: 1px solid var(--m3-a20);
    background-color: var(--m4-500);
}
</style>