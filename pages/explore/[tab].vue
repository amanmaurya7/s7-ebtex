<script setup>
import ExploreTags from '../../components/ExploreTags.vue';

const route = useRoute();
const { $localePath } = useNuxtApp();
const router = useRouter();
const tabs = [
    { key: 'categories' },
    { key: 'collections' },
    { key: 'tags' },
];

const activeIndex = ref(tabs.findIndex((t) => t.key === route.params.tab));
const onTabChange = (newTab) => {
    const tab = tabs[newTab.index].key;
    router.push($localePath({ name: 'explore-tab', params: { tab } }));
};
</script>

<template>
  <section class="page-wrapper">
    <div class="page-title" v-html="$t('explore.page_title')" />
    <TabView :active-index="activeIndex" @tab-change="onTabChange">
      <TabPanel v-for="tab in tabs" :key="tab.title" :header="$t('explore.tab_' + tab.key)">
        <div class="px-75 py-125">
          <ExploreCategories v-if="tab.key === 'categories'" />
          <ExploreCollections v-if="tab.key === 'collections'" />
          <ExploreTags v-if="tab.key === 'tags'" />
        </div>
      </TabPanel>
    </TabView>
  </section>
</template>

<style scoped>
.page-wrapper {
    background: var(--w2-500);
}
</style>
