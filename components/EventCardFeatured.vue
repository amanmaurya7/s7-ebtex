<script setup>
const props = defineProps({
    event: { type: Object, required: true },
    tintHex: { type: String, required: true },
});


const inCollection = props.event.collections?.length > 0;
const hasTags = !!props.event.featured_tag?.slug;
const mainCategory =  props.event.category ? { ...props.event.category } : null;
const tinted = {
    color: props.tintHex,
};
const backgroundTinted = {
    backgroundColor: props.tintHex,
};
</script>

<template>
  <NuxtLink :to="localePath(`/events/${event.code}`)" class="card">
    <img v-if="event.imageUrl" class="image" :src="event.imageUrl" alt="Event Image">
    <div class="card-content">
      <div class="event-title px-4">
        {{ event.name }}
      </div>
      <div class="event-stat my-3">
        <div class="event-stat-item">
          <div :style="tinted" class="stat-number text-right">{{ formatPercentage(event.maxReturn) }}</div>
          <div class="tinted text-right">
            {{ $t('investment.max_return') }}
          </div>
        </div>
        <div class="separator" :style="backgroundTinted" />
        <div class="event-stat-item">
          <div :style="tinted" class="text-left stat-number">{{ event.maxLeverage }}X</div>
          <div class="tinted text-left">
            {{ $t('investment.max_leverage') }}
          </div>
        </div>
      </div>
      <div class="info-row">
        <div v-if="mainCategory" class="flex align-items-center">
          <img src="/images/v1.5/icon-category.png" width="12" height="12" style="margin-right: 5px;">
          <div class="category-name">
            <span>{{ mainCategory.name }}</span>
          </div>
        </div>
        <div class="event-category-time-wrapper">
          <EventCountdown :end-time="event.endTime" />
        </div>
        <img
          v-if="inCollection"
          src="/images/v1.5/icon-collection.png"
          width="12"
          height="12"
        >
        <img
          v-if="hasTags"
          src="/images/v1.5/icon-tag.png"
          width="12"
          height="12"
        >
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  background: white;
  font-weight: bold;
  user-select: none;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--m3-a20);

  .image {
      aspect-ratio: 320 / 210;
      object-fit: cover;
      object-position: center;
  }

  .card-content {
      padding: 1rem 0rem 0;
      text-align: center;
  }

  @media (min-width: 1024px) {
    max-width: 400px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .image {
      aspect-ratio: 400 / 260;
    }

    .card-content {
      padding: 1.5rem 0rem 0;
    }

    .event-title {
      font-size: 1.25rem;
      padding: 0 2rem;
    }
  }
}

.info-row {
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 0.75rem;
  margin: 0.5rem 0rem 0rem;
  padding: 1rem 1rem 1rem;
  justify-content: center;
  border-top: 1px solid var(--m3-a20);
  background: var(--w2-500);

  & > * {
    opacity: 0.5;
  }
  :deep(.event-category-time-wrapper) {
    opacity: 0.3 !important;
  }

  & img, & .event-category-time-wrapper{
    filter: brightness(0) saturate(100%) invert(30%) sepia(29%) saturate(4464%) hue-rotate(157deg) brightness(96%) contrast(101%);
  }

  .category-name {
    border-radius: 5px;
    padding: 0px 5px;
    background:#008080;
    span {
      color: white; 
      text-transform: uppercase;
    }
  }
}

.event-stat {
  display: flex;
  width: 100%;

  .event-stat-item {
    text-transform: uppercase;
    font-size: 0.75rem;;
    flex-grow: 1;
  }

  .stat-number {
    padding: 0.25rem 0;
    font-size: 0.9375rem;;
  }

  .separator {
    border: none;
    height: 44px;
    width: 1px;
    margin: 0 1rem;
  }

  @media (min-width: 1024px) {
    .stat-number {
      font-size: 1.25rem;
    }
  }
}

.bg-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

</style>
