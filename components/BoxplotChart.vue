<script setup>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { BoxPlotController, BoxAndWiskers } from '@sgratzl/chartjs-chart-boxplot';

ChartJS.register( Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, BoxPlotController, BoxAndWiskers);

defineProps({
    data: { type: Object, required: true },
    options: { type: Object, required: true },
});
</script>

<template>
  <div>
    <Bar :data="data" :options="options" style="height: 110px;" />
  </div>
</template>
