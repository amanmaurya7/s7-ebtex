<script setup>
defineProps({
    event: { type: Object, required: true },
    layout: { type: String, required: false, default: 'default' },
});
</script>

<template>
  <NuxtLink
    :to="localePath(`/events/${event.code}`)"
    class="card"
    :class="{'featured': layout === 'featured', 'cover': layout === 'cover', 'compact': layout === 'compact', 'pointer-events-none': layout === 'cover'}"
  >
    <div v-if="layout !== 'compact'" class="card-image">
      <img v-if="event.imageUrl" :src="event.imageUrl" alt="Event Image">
    </div>
    
    <div class="card-content">
      <p class="event-title">
        {{ event.name }}
      </p>

      <p v-if="layout === 'cover'" class="event-description">
        {{ event.description }}
      </p>

      <div class="flex flex-column gap-3">
        <div
          class="flex gap-2"
          :class="{'flex-column': layout !== 'compact', 'flex-row align-items-center flex-wrap': layout === 'compact'}"
        >
          <div class="stat">
            <span>{{ $t('investment.max_return', { max: formatPercentage(event.maxReturn) }) }}</span>
            <span>{{ $t('investment.max_leverage', { leverage: event.maxLeverage }) }}</span>
          </div>

          <div class="flex flex-row justify-content-between align-items-center" :style="{order: layout === 'cover' ? 1 : -1}">
            <EventCountdown :end-time="event.endTime" />
            <div v-if="layout === 'cover'" class="ticker">
              {{ $t('event.ticker', event) }}
            </div>
          </div>
        </div>
        <Button
          v-if="layout === 'featured'"
          :label="$t('button.view_detail')"
          security="primary"
          rounded
          icon="pi pi-angle-right"
          icon-pos="right"
          size="small"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: row;
  background-color: #fff;
  text-decoration: none;
  padding: .5rem;
  gap: .5rem;

  .card-image {
    flex: 0 0 104px;
    aspect-ratio: 3 / 2;
    font-size: 0;
    background-color: var(--gray-700);

    img {
      width: 100%;
      height: 100%;
      aspect-ratio: inherit;
      object-fit: cover;
    }
  }

  .card-content {
    display: flex;
    flex-direction: column;
    color: #000000;
    gap: .75rem;

    .event-title {
      flex: 1;
      width: 100%;
      font-size: 0.875rem;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .ticker {
      font-size: 0.75rem;
      line-height: 10px;
      font-weight: 700;
      color: var(--gray-600);
    }

    .stat {
      display: flex;
      flex-wrap: wrap;
      gap: .25rem;

      span {
        padding: .25rem .5rem;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 30px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border: 1px solid var(--primary-500);
        color: var(--primary-500);
      }
    }
  }

  &.featured, &.cover {
    flex-direction: column;
    padding: 0;
    gap: 0;

    .card-image {
      flex-basis: 100%;
      aspect-ratio: 3 / 2;
    }

    .card-content {
      padding: .75rem;
      gap: 1rem;

      .event-title {
        font-size: 1rem;
        font-weight: 700;
      }

      .event-description {
        font-size: 1rem;
        font-weight: 400;
      }
    }
  }

  &.compact {
    .card-content {
      gap: .5rem;
    }
  }
}
</style>
