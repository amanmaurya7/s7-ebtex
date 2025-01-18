<script setup>
import moment from 'moment';

const props = defineProps({
    endTime: { type: String, required: true },
});

const countdownString = ref('');
let timerToken = null;
onMounted(() => {
    timerToken = setInterval(() => {
        updateCountdownString();
    }, 1000);
    updateCountdownString();
});

onUnmounted(() => clearInterval(timerToken));

const updateCountdownString = () => {
    const now = moment();
    const endTime = moment(props.endTime);
    const duration = moment.duration(endTime.diff(now));
    countdownString.value = moment.utc(duration.as('milliseconds')).format('HH:mm:ss');

};
</script>

<template>
  <div class="event-countdown-realtime">
    {{ countdownString }}
  </div>
</template>

<style lang="scss" scoped>
.event-countdown-realtime {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--error-500);
  text-align: center;
}
</style>
