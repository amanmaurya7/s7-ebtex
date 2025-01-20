<script setup>
import Tooltip from '@/components/Common/Tooltip.vue';

const props = defineProps({
    event: { type: Object, required: true },
    tintHex: { type: String, required: true },
});

const tinted = {
    color: props.tintHex,
};
const backgroundTinted = {
    backgroundColor: props.tintHex,
};
</script>

<template>
  <div class="card">
    <div class="image-container">
      <img v-if="event.imageUrl" class="image" :src="event.imageUrl" alt="Event Image">
    </div>
    <div class="card-content">
      <div class="event-title">
        {{ event.name }}
      </div>
      <div class="event-description">
        {{ event.description }}
      </div>
      <div class="event-stat">
        <div class="event-stat-item">
          <div :style="tinted" class="stat-number text-right">
            {{ formatPercentage(event.maxReturn) }}
          </div>
          <div class="tinted text-right">
            {{ $t('investment.max_return') }}
          </div>
        </div>
        <div class="separator" :style="backgroundTinted" />
        <div class="event-stat-item">
          <div :style="tinted" class="text-left stat-number">
            {{ event.maxLeverage }}X
          </div>
          <Tooltip mode="dark" class="tinted text-left" :tooltip-content="$t('betting.max_leverage_tooltip')">
            {{ $t('investment.max_leverage') }}
          </Tooltip>
        </div>
      </div>
    </div>
    <div class="info-row">
      <div class="event-category-time-wrapper">
        <EventCountdown :end-time="event.endTime" />
      </div>
    </div>
  </div>
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
  border-bottom: 1px solid var(--m3-500);
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;

  .event-title {
    font-size: 1.25rem;
  }
  .event-description {
    font-size: 0.9375rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: var(--m2-500);
    margin-top: .5rem;
  }
  .image-container {
      aspect-ratio: 320 / 210;
      position: relative;
  }
  .image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .card-content {
      padding: 1rem;
      text-align: center;
  }
}

.info-row {
  background: var(--w2);
  display: flex;
  align-items: center;
  font-size: 12px;
  gap: 0.75rem;
  padding: .8rem 0 .8rem;
  justify-content: center;
  border-top: 1px solid var(--m4-500);
  opacity: 0.3;

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
  margin-top: 0.75rem;
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
}

.bg-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.glow-bar {
  position: absolute;
  bottom: 1.375rem;
  left: 1rem;
  right: 1rem;
  height: 0.625rem;
  border-radius: 0.25rem;
}
</style>
