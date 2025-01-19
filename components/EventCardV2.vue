<script setup>
const props = defineProps({
    event: { type: Object, required: true },
    tintHex: { type: String, required: true },
});


const inCollection = props.event.collections?.length > 0;
const hasTags = !!props.event.featured_tag?.slug;
const mainCategory = props.event.category ? { ...props.event.category } : null;
const tinted = {
    color: props.tintHex,
};
const backgroundTinted = {
    backgroundColor: props.tintHex,
};
</script>

<template>
  <NuxtLink :to="localePath(`/events/${event.code}`)" class="card">
    <img v-if="event.recommendedImageUrl" class="image" :src="event.recommendedImageUrl" alt="Event Image">
    <img v-else-if="event.imageUrl" class="image" :src="event.imageUrl" alt="Event Image">
    <div class="card-content">
      <div class="event-title">
        {{ event.name }}
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
          v-if="hasTags"
          src="/images/v1.5/icon-tag.png"
          width="12"
          height="12"
        >
        <img
          v-if="inCollection"
          src="/images/v1.5/icon-collection.png"
          width="12"
          height="12"
        >
      </div>
      <div class="event-stat">
        <div class="event-stat-item">
          <div :style="tinted" class="stat-number">{{ formatPercentage(event.maxReturn) }}</div>
          <div class="tinted font-semibold">
            {{ $t('investment.max_return') }}
          </div>
        </div>
        <div class="separator" :style="backgroundTinted" />
        <div class="event-stat-item">
          <div :style="tinted" class="stat-number">{{ event.maxLeverage }}X</div>
          <div class="tinted font-semibold">
            {{ $t('investment.max_leverage') }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.card {
  position: relative;
    display: flex;
    text-decoration: none;
    color: white;
    user-select: none;
    background: transparent;

    &:first-child {
      border-top: 1px solid var(--m3-a20);
    }

    &:not(:last-child) {
      border-bottom: 1px solid var(--m3-500);
    }

    .event-title {
      font-weight: bold;
    }

    .image {
        width: 100px;
        min-height: 150px;
        object-fit: cover;
        object-position: center;
    }

    .card-content {
        padding: 1rem;
    }

    @media (min-width: 1024px) {
      &:hover {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
      }

      .image {
        width: 180px;
        min-height: 180px;
      }

      .card-content {
        padding: 1.5rem;
        width: 100%;
      }

      .event-title {
        font-size: 1.25rem;
      }
    }
}

.info-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  gap: 0.75rem;
  margin: 0.5rem 0 1rem;
  opacity: 0.3;

  .category-name {
    background: white;
    border-radius: 5px;
    padding: 0px 5px;
    font-weight: bold;
    span {
      color: var(--text-color); 
      text-transform: uppercase;
    }
  }
}

.event-stat {
  display: flex;

  .event-stat-item {
    text-transform: uppercase;
    font-size: 0.625rem;;
  }

  .stat-number {
    padding: 0.25rem 0;
    font-size: 0.9375rem;;
    font-weight: 600;
  }

  .separator {
    border: none;
    height: 40px;
    width: 1px;
    margin: 0 1rem;
  }

  @media (min-width: 1024px) {
    max-width: 400px;

    .stat-number {
      font-size: 1.125rem;
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
