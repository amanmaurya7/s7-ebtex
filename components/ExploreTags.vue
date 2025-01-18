<script setup>
import ExploreTagItem from './ExploreTagItem.vue';

const isLoading = ref(false);
const tags = ref([]);

const { getTags } = useApi();
const prepareTags = async () => {
    isLoading.value = true;
    const { data } = await getTags();
    tags.value = data.value.sort((a, b) => b.num_events - a.num_events);
    isLoading.value = false;
};

prepareTags();
</script>

<template>
  <div>
    <div class="tags-wrapper">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.key"
        :to="localePath(`/explore/tags/${tag.slug}`)"
      >
        <ExploreTagItem
          v-ripple
          class="p-ripple"
          :tag="tag"
        />
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tags-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
</style>