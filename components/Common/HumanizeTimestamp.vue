<script setup>
import moment from 'moment';
import { formatDuration, DURATION_MODE } from '@/utils/formatters';

const props = defineProps({
    // iso datetime string
    timestamp: {
        type: String,
        required: true,
    },
});

const { locale } = useI18n();
const now = moment();
const duration = moment
    .duration(moment(props.timestamp).diff(now));
const time = formatDuration(duration, locale.value, DURATION_MODE.FULL);
</script>

<template>
  <div class="flex align-items-center justify-content-start uppercase">
    <img src="/images/v1.5/icon-clock.png" alt="clock" class="mr-2" width="10" height="10">
    <span class="font-size-75">{{ time }}</span>
  </div>
</template>