<script setup>
import { eventSortOptions } from '@/pages/constants';
import { adaptEvent } from '@/utils/model-utils';

const { getSearchEvents, getCategories, getTags } = useApi();

const props = defineProps({
    allowFilter: { type: Boolean, required: false, default: false },
    collection: { type: Object, required: false, default: null },
    category: { type: Object, required: false, default: null },
    subcategory: { type: Object, required: false, default: null },
    systemTag: { type: Object, required: false, default: null },
    keyword: { type: String, required: false, default: null },
    initialSortCode: { type: String, required: false, default: 'relevance' },
});

const selectedTagSlugs = ref([]);
const selectedCategorySlugs = ref([]);

const selectedSortOption = ref(eventSortOptions.find((o) => o.code === props.initialSortCode));
const params = computed(() => {
    const tags = [];
    if (props.collection) {
        tags.push(props.collection.slug);
    } else if (props.category) {
        tags.push(props.category.slug);
        if (props.subcategory) {
            tags.push(props.subcategory.slug);
        }
    } else if (props.systemTag) {
        tags.push(props.systemTag.slug);
    }
    
    if (selectedCategorySlugs.value.length) {
        tags.push(...selectedCategorySlugs.value);
    }
    if (selectedTagSlugs.value.length) {
        tags.push(...selectedTagSlugs.value);
    }

    const params = {
        tags,
        sortby: selectedSortOption.value.code,
    };

    if (props.keyword) {
        params.keyword = props.keyword;
    }

    return params;
});

const onCategorySlugsUpdate = (slugs) => {
    selectedCategorySlugs.value = slugs;
};
const onTagSlugsUpdate = (slugs) => {
    selectedTagSlugs.value = slugs;
};

const filterTagOptions = ref([]);
const filterCategoryOptions = ref([]);
const getFilterTagOptions = async() => {
    const { data } = await getTags({ purpose: 'search_filter' });
    if(data.value) {
        filterTagOptions.value = data.value.map(o => ({
            label: o.name,
            num: o.num_events,
            value: o.slug,
        }));
    }
};
const getCategoryOptions = async() => {
    const { data } = await getCategories();
    if(data.value) {
        filterCategoryOptions.value = data.value.map(o => ({
            label: o.name,
            num: o.num_events,
            value: o.slug,
            sub_tags: o.sub_tags.map(subTag => ({
                label: subTag.name,
                num: subTag.num_events,
                value: subTag.slug,
            })),
        }));
    }
};

getFilterTagOptions();
getCategoryOptions();

const { data: events, status } = getSearchEvents(params);
</script>

<template>
  <div>
    <div class="filter-sorting-bar">
      <SearchFilter
        v-if="allowFilter"
        :category-options="filterCategoryOptions"
        :tag-options="filterTagOptions"
        :preselected-category-slugs="selectedCategorySlugs"
        :preselected-tag-slugs="selectedTagSlugs"
        @category-slugs-update="onCategorySlugsUpdate"
        @tag-slugs-update="onTagSlugsUpdate"
      />
      <div />
      <Dropdown
        v-model="selectedSortOption"
        :options="eventSortOptions"
        option-label="name"
        placeholder="Select a City"
      >
        <template #value="{ value }">
          {{ $t(value.name) }}
        </template>
        <template #option="{ option }">
          {{ $t(option.name) }}
        </template>
      </Dropdown>
    </div>
    <div v-if="status === 'success' && events.length > 0">
      <NuxtLink
        v-for="event in events"
        :key="event.id"
        :to="`/events/${event.code}`"
      >
        <EventCardV2
          :event="adaptEvent(event)"
          tint-hex="#00e6e6"
        />
      </NuxtLink>
    </div>
    <div v-else-if="status === 'success' && events.length == 0">
      empty
    </div>
    <div v-if="status === 'fetching'" class="text-center" :style="{marginTop: '4rem'}">
      <img src="/images/v1.5/logo-list-loading.png" width="40" height="40" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.filter-sorting-bar {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: var(--w2)
}
</style>