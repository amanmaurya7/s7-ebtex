<script setup>
defineProps({
    events: { type: Array, required: true },
});
</script>

<template>
  <section class="related-events">
    <div class="events">
      <EventCardV2
        v-for="event in events"
        :key="event.code"
        :event="event"
        tint-hex="#00e6e6"
      />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.related-events {
  padding: 0rem 0 0;

  .events {
    display: flex;
    flex-direction: column;
  }
}
</style>
