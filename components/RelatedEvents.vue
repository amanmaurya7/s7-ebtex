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

    @media (min-width: 768px) {
      flex-direction: row;
     
      flex-wrap: wrap;
    }

    //add for desktop devices
    @media (min-width: 1024px) {
      flex-direction: row;
     
     flex-wrap: wrap;
      
    }
    
  }
}
</style>
