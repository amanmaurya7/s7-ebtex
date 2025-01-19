<script setup>
import useHome from '../composables/pages/useHome';
import { storeToRefs } from 'pinia';
import { useLayoutStore } from '@/store/layout';
import CustomCarousel from '@/components/Common/CustomCarousel.vue';
import LandingCollectionItem from '@/components/Landing/CollectionItem.vue';

const layoutStore = useLayoutStore();
const { newCollections, topCategories } = storeToRefs(layoutStore);
const { topEvents, featuredEvents } = useHome();
</script>

<template>
  <div class="page-wrapper">
    <section v-if="topCategories" class="top-categories-section">
      <NuxtLink
        v-for="item in topCategories"
        :key="item.slug"
        :to="localePath(`/explore/categories/${item.slug}`)"
      >
        {{ item.name }}
      </NuxtLink>
    </section>

    <section v-if="newCollections" class="new-collections-section px-0 py-4 bg-white">
      <CustomCarousel :items="newCollections">
        <template #item="{ item }">
          <NuxtLink :to="localePath(`/explore/collections/${item.slug}`)">
            <LandingCollectionItem
              v-ripple
              class="p-ripple"
              :collection="item"
            />
          </NuxtLink>
        </template>
      </CustomCarousel>
    </section>

    <section v-if="topEvents" class="recommended-events px-0">
      <RelatedEvents :events="topEvents" />
    </section>

    <section v-if="featuredEvents" class="featured-events-section px-3 bg-w2-500">
      <div class="section-title font-1375 mt-0 pt-250" v-html="$t('landing.featured_events')" />
      <EventCardFeatured
        v-for="item in featuredEvents"
        :key="item.code"
        :event="item" 
        tint-hex="#00b3b3"
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>

.page-wrapper {
  padding-top: 0px;
  padding-bottom: 0px;
  background: var(--m1-500);
}

section {
  padding: 0 1.25rem;
}

.section-title {
  font-size: 1;
  margin-top: 1rem;
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
}

.featured-events-section {
  background: var(--w2);
  
  :deep(.highlight) {
    color: var(--m4-500);
  }
}

.banners-section {
  position: relative;
  padding: 0 !important;
  background: url(/images/v1.5/bg-landing-top.png) no-repeat center/280%, linear-gradient(var(--m1-500) 0%, #073c3b 75%, #073c3b 100%);
  margin-bottom: 0rem;

  .banners-item {
    aspect-ratio: 1;
    font-size: 0;
    img {
      width: 100%;
      height: 600px;
      aspect-ratio: inherit;
      object-fit: cover;
      overflow: hidden;
    }
  }
}

:deep(.p-carousel-content) {
  position: relative;
}

:deep(.banners-indicators) {
  position: absolute;
  padding: 0;
  display: flex;
  gap: 0.75rem;
  bottom: 1rem;;
  width: 100%;
  justify-content: center;

  .p-carousel-indicator {
    margin: 0;
    button {
      width: 10px;
      height: 10px;
      background-color: var(--m4-500);
      border-radius: 100px;
    }

    &.p-highlight button {
      background-color: white;
    }
  }
}

.featured-events-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-bottom: 3.5rem;
  background: var(--w2-500);
}

.recommended-events {
  background: url(/images/v1.5/bg-landing-recommended-events.png) no-repeat center;
  background-size: cover;
}

.recommended-events .section-title {
  color: white;
  :deep(.highlight) {
    color: var(--m5-500);
  }
}

:deep(.collection-item) {
  color: white;
  border-radius: 6px;

  .collection-name, .right-part {
    background: transparent;
  }
  .collection-image {
    background: white;
  }
}

.top-categories-section {
  background: var(--m1-500);
  padding: .5rem 1.25rem 1rem;
  color: var(--w1-500);
  font-weight: 600;
  font-size: .625rem;
  text-transform: uppercase;
  display: flex;
  flex-direction: row;
  gap: 2.25rem;
  flex-wrap: nowrap;
  overflow: auto;

  & > * {
    flex-shrink: 0;
  }

  .section-title {
    margin-bottom: 1.5rem;
  }
}

</style>
