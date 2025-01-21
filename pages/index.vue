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
      <CustomCarousel :items="newCollections" :autoplayInterval="5000">
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

    <section v-if="featuredEvents" class="featured-events-section">
      <div class="section-title font-1375 mt-0 pt-250" v-html="$t('landing.featured_events')" />
      <div class="events-grid">
        <EventCardFeatured
          v-for="(item, index) in featuredEvents"
          :key="item.code"
          :event="item"
          :class="{ 'hidden-mobile': index > 0 }"
          tint-hex="#441e1e"
        />
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.page-wrapper {
  padding-top: 0px;
  padding-bottom: 0px;
  background: var(--m1-500);
  
  @media (min-width: 1024px) {
    max-width: 1400px;
    margin: 0 auto;
  }
}

.featured-events-section {
  background: var(--w2-500);
  padding: 1rem;
  
  @media (min-width: 1024px) {
    padding: 1.5rem 2rem;
  }

  .events-grid {
    display: grid;
    
    @media (min-width: 1024px) {
      grid-template-columns: 1fr; 
      max-width: 800px;          
      margin: 0 auto;  
      margin-left: 465px;          
      gap: 1.5rem;              
    }
  }

  .hidden-mobile {
    display: none;
    
    @media (min-width: 1024px) {
      display: block;
    }
  }
}

section {
  padding: 0 1rem;
  margin-bottom: 1rem; 
  
  @media (min-width: 1024px) {
    padding: 1.5rem 2rem; 
  }
}

.section-title {
  font-size: 1rem;
  margin: 0.75rem 0 1rem; 
  text-align: center;
  text-transform: uppercase;
  font-weight: bold;
  
  @media (min-width: 1024px) {
    font-size: 1.375rem;
    margin-bottom: 1.5rem;
  }
}

.featured-events-section {
  background: var(--w2-500);
  padding: 1rem;
  
  @media (min-width: 1024px) {
    padding: 1.5rem 2rem;
  }

  .events-grid {
    display: grid;
    
    @media (min-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .hidden-mobile {
    display: none;
    
    @media (min-width: 1024px) {
      display: block;
    }
  }
}

.top-categories-section {
  background: var(--m1-500);
  padding: 0.5rem 1rem;
  color: var(--w1-500);
  font-weight: 600;
  font-size: 0.55rem; 
  text-transform: uppercase;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  flex-wrap: nowrap;
  overflow: auto;
  height: 2rem; 

  @media (min-width: 1024px) {
    font-size: 0.875rem;
    padding: 0.75rem 2rem;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
    height: auto;
  }

  & > * {
    flex-shrink: 0;
  }
}

.recommended-events {
  background: url(/images/v1.5/bg-landing-recommended-events.png) no-repeat center;
  background-size: cover;
  padding: 0;
  overflow: hidden;
  
  @media (min-width: 1024px) {
    max-height: 200px;
  }
}

:deep(.collection-item) {
  color: white;
  border-radius: 6px;
  height: 100px;
  overflow: hidden;
  margin: 0; 

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: 140px;
    max-width: 1400px; 
    margin-left: 280px;
    margin-right:80px;
    gap: 0;
  }

  .collection-name, .right-part {
    background: transparent;
    padding: 1rem;
  }
  
  .collection-image {
    background: white;
    height: 100%;
    object-fit: cover;
    margin: 0;
  }
}

.new-collections-section {
  padding: 0;
  
  @media (min-width: 1024px) {
    margin-top: -10px;
    margin-bottom: -20px;
    overflow: hidden;
  }
}


:deep(.carousel-nav) {
  button {
    @media (min-width: 1024px) {
      top: 50%;
      transform: translateY(-50%);
    }
  }
}


:deep(.event-card) {
  background: #441e1e;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;
  height: 180px; 

  @media (min-width: 1024px) {
    height: 250px;
    
    &:hover {
      transform: translateY(-2px);
    }
  }

  img {
    width: 100%;
    height: 120px; 
    object-fit: cover;
    
    @media (min-width: 1024px) {
      height: 160px;
    }
  }
}


:deep(.custom-carousel) {
  .carousel-container {
    height: 120px; 
    @media (min-width: 1024px) {
      height: 140px; 
      max-width: 1400px;
      margin: 0 auto;
    }
  }
  
  .carousel-item {
    padding: 0 0.25rem; 
    width: 100%;
    
    @media (min-width: 1024px) {
      padding: 0 0.5rem; 
    }
  }

  .carousel-track {
    display: flex;
    gap: 0; 
    
    @media (min-width: 1024px) {
      margin: 0 -0.5rem; 
    }
  }
}
</style>