<script setup>

const props = defineProps({
    tag: {
        type: Object,
        required: true,
    },
});
</script>

<template>
  <div class="tag-item p-ripple" :class="{ disabled: props.tag.num_events === 0 }">
    <img src="/images/v1.5/icon-tag-green.png" width="12" height="12">
    <div class="tag-name">
      {{ props.tag.name }}
    </div>
    <div class="tag-event-count">
      {{ props.tag.num_events }}
    </div>
  </div>
</template>


<style lang="scss" scoped>
.tag-item {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  font-size: 0.9rem;
  font-weight: bold;;
  text-align: center;
  background-color: var(--w2-500);
  border-radius: 5px;
  padding: 1rem;
  width: 100%;
  gap: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &.disabled {
    opacity: 0.2;
  }

  @media (min-width: 1024px) {
    padding: 1.25rem;  // reduced from 1.5rem
    min-height: 140px;  // reduced from 160px

    &:hover:not(.disabled) {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .tag-name {
      font-size: 1rem;  // reduced from 1.125rem
      margin: 0.75rem 0;  // reduced from 1rem
    }
  }
}


.tag-event-count {
  background: var(--m4-500);
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-weight: bold;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: white;
  border-radius: 5px;

  @media (min-width: 1024px) {
    font-size: 0.75rem;  // reduced from 0.875rem
    padding: 0.375rem 0.75rem;  // reduced padding
  }
}

</style>