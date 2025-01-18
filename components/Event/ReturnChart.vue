<script setup>
import moment from 'moment';
import { CHART_COLORS, CHART_BAR_PERCENTAGE, CHART_BAR_THICKNESS, CHART_BOX_HEIGHT, CHART_BOX_WIDTH } from '@/pages/constants';
import { round, formatDate } from '@/utils/formatters';
import NowLinePlugin from '@/components/Event/NowLinePlugin';

const props = defineProps({
    // This is raw history chart data from api
    // Requires futher processing
    data: {
        type: Array,
        required: true,
    },
    mockDataPointNum: {
        type: Number,
        default: 20,
    },
    selectedOutcome: {
        type: Object,
        default: null,
    },
    chartFocusColor: {
        type: String,
        default: 'white',
    },
    axisTextColor: {
        type: String,
        default: 'white',
    },
    showLegend: {
        type: Boolean,
        default: true,
    },
    showTradingVolume: {
        type: Boolean,
        default: true,
    },
    legendColor: {
        type: String,
        default: 'white',
    },
    eventOutcomeIds: {
        type: Array,
        default: () => [],
    },
});

const focusLineColor = props.chartFocusColor;
const passageBackgroundColor = '#00e6e651';
const passageBottomBackgroundColor = '#00e6e651';
const returnPassageBackgroundColor = '#00e6e6';
const tradingVolumeBackgroundColor = '#ffaa00';

const { t } = useNuxtApp().$i18n;
const peakWagerSum = ref(0);

const chartDataByOutcome = computed(() => {
    const keyedData = {};
    props.data.forEach((el) => {
        const outcomeId = el.event_outcome_id;
        const datetime  = el.datetime;
        keyedData[outcomeId] = (outcomeId in keyedData)
            ? { ...keyedData[outcomeId], [datetime]: el }
            : { [datetime]: el };
    });
    return keyedData;
});

const allDateTime = ref([]);
const chartLabels = computed(() => allDateTime.value.map((time) => formatDate(time)));

allDateTime.value = [...new Set(props.data.map(el => el.datetime))];
const lastDatetime = allDateTime.value[allDateTime.value.length - 1];
for(let i = 1; i <= props.mockDataPointNum; i++) {
    const nextDatetime = moment(lastDatetime).add(i, 'hours').toISOString();
    allDateTime.value.push(nextDatetime);
}

const getReturnData = (outcomeId) => {
    return allDateTime.value.map((time) => {
        if (!chartDataByOutcome.value[outcomeId]) {
            return null;
        }
        return round(chartDataByOutcome.value[outcomeId][time]?.estimated_payout) ?? null;
    });
};

const appendExtrapolationData = (data) => {
    const rawLastIndex = data.length - 1 - props.mockDataPointNum;
    const lastRawValue = data[rawLastIndex];
    for(let i = rawLastIndex + 1; i < data.length; i++) {
        data[i] = lastRawValue;
    }
    return data;
};

const returnDataset = ref([]);

// prob. dataset: { 0 trading volume 1 MIN_porb, 2 MIN_return 3 selectedOutcome prob }
// return dataset: { 0 trading volume 1 MAX_prob, 2 MAX_return 3 selectedOutcome return }
['MIN', 'MAX'].forEach((outcomeId) => {
    if (outcomeId === 'MIN') {
        returnDataset.value.push({
            type: 'line',
            label: outcomeId + ' (%)',
            borderColor: 'transparent',
            backgroundColor: passageBottomBackgroundColor,
            pointBackgroundColor: passageBottomBackgroundColor,
            yAxisID: 'y',
            data: appendExtrapolationData(getReturnData(outcomeId)),
        });
    } else if (outcomeId === 'MAX') {
        returnDataset.value.push({
            type: 'line',
            label: outcomeId + ' (%)',
            borderColor: 'transparent',
            backgroundColor: passageBackgroundColor,
            pointBackgroundColor: passageBackgroundColor,
            yAxisID: 'y',
            data: appendExtrapolationData(getReturnData(outcomeId)),
            fill: {
                target: 1, // trading volme will unshift to 0
                below: returnPassageBackgroundColor,
            },
        });
    }
});

if (props.selectedOutcome?._id) {
    const probabilityData = appendExtrapolationData(getReturnData(props.selectedOutcome._id));
    const baseOutcomeDataset = {
        type: 'line',
        label: props.selectedOutcome._id + ' (%)',
        data: probabilityData,
        borderColor: focusLineColor,
        backgroundColor: focusLineColor,
        pointBackgroundColor: focusLineColor,
        yAxisID: 'y',
        borderWidth: 3,
        segment: {
            borderDash: (ctx) => {
                if (ctx.datasetIndex === 3) {
                    return ctx.p0DataIndex > (probabilityData.length - props.mockDataPointNum - 1) ? [3, 3] : undefined;
                }
            },
        },
        spanGaps: true,
    };
    returnDataset.value.push({
        ...baseOutcomeDataset,
        data: probabilityData,
    });
} else {
    props.eventOutcomeIds.forEach((outcomeId, index) => {
        const probabilityData = appendExtrapolationData(getReturnData(outcomeId));
        const baseOutcomeDataset = {
            type: 'line',
            label: outcomeId + ' (%)',
            data: probabilityData,
            borderColor: CHART_COLORS[index],
            backgroundColor: focusLineColor,
            pointBackgroundColor: focusLineColor,
            yAxisID: 'y',
            borderWidth: 3,
            segment: {
                borderDash: (ctx) => {
                    if (ctx.datasetIndex >= 3) {
                        return ctx.p0DataIndex > (probabilityData.length - props.mockDataPointNum - 1) ? [3, 3] : undefined;
                    }
                },
            },
            spanGaps: true,
        };
        returnDataset.value.unshift({
            ...baseOutcomeDataset,
            data: probabilityData,
        });
    });
}

const sumWagerByTime = props.data.reduce((prev, current) => {
    const datetime  = current.datetime;
    if (typeof current.sum_wagers === 'undefined') {
        // for MIN and MAX
        return prev;
    }
    prev[datetime] = (datetime in prev)
        ? [...prev[datetime], current.sum_wagers]
        : [current.sum_wagers];

    if (current.sum_wagers > peakWagerSum.value) {
        peakWagerSum.value = current.sum_wagers;
    }

    return prev;
}, {});

const baseChartOption = {
    responsive: true,
    layout: {
        padding: {
            top: 20,
        },
    },
    plugins: {
        legend: {
            display: props.showLegend,
            position: 'bottom',
            labels: {
                font: {
                    size: 10,
                },
                color: props.legendColor,
                boxWidth: CHART_BOX_WIDTH,
                boxHeight: CHART_BOX_HEIGHT,
                filter: (item) => !item.text.includes('MIN') && !item.text.includes('MAX'),
            },
            reverse: true,
        },
        tooltip: {
            position: 'nearest',
            callbacks: {
                label: (ctx) => (ctx.dataset.type === 'line') ? ctx.formattedValue + '%' :ctx.formattedValue,
            },
        },
    },
    scales: {
        x: {
            display: true,
            autoSkip: true,
            ticks: {
                callback: (i) => {
                    let previous = '';
                    if (i >= 1) {
                        previous = formatDate(allDateTime.value[i - 1], 'Do MMM');
                    }
                    const datetime = allDateTime.value[i];
                    const formatted =  formatDate(datetime, 'Do MMM');
                    if (previous === formatted || i < 3) {
                        return null;
                    }
                    return formatted;
                },
            },
        },
        y: {
            ticks: {
                color: props.axisTextColor,
            },
        },
    },
    datasets: {
        line: {
            pointStyle: false,
            borderWidth: 3,
        },
    },
};

const chartOptions = {
    ...baseChartOption,
    scales: {
        ...baseChartOption.scales,
        x: {
            display: false,
        },
        y: {
            display: true,
            position: 'left',
            ticks: {
                callback: (value) => value + '%',
                color: props.axisTextColor,
            },
            min: 0,
            grid: {
                color: '#00808051',
            },
        },
        y1: {
            display: true,
            position: 'right',
            min: 0,
            ticks: {
                color: props.axisTextColor,
            },
            grid: {
                color: '#00808051',
            },
        },
    },
};

const datasets = computed(() => {
    const datasets = [...returnDataset.value];

    const tradingVolumeDataset = {
        hidden: !props.showTradingVolume,
        type: 'bar',
        label: t('event_detail.chart_text.sum_wager'),
        data: allDateTime.value.map(time => sumWagerByTime[time]?.reduce((prev, current) => prev + current, 0) || 0),
        borderColor: tradingVolumeBackgroundColor,
        backgroundColor: tradingVolumeBackgroundColor,
        pointBackgroundColor: tradingVolumeBackgroundColor,
        yAxisID: 'y1',
        barPercentage: CHART_BAR_PERCENTAGE,
        barThickness: CHART_BAR_THICKNESS,
    };
    datasets.unshift(tradingVolumeDataset);
    return datasets;
});

const outcomesProbChartData = computed(() => {
    return {
        labels: chartLabels.value,
        datasets: datasets.value,
    };
});

// chartOptions.scales.y.type = 'logarithmic';
chartOptions.datasets.line.pointStyle = outcomesProbChartData.value.datasets.length > 0 && outcomesProbChartData.value.datasets[0].data.length > 1 ? false : 'circle';
chartOptions.scales.y1.suggestedMax = (peakWagerSum.value || 100) * 5;
chartOptions.scales.y1.ticks = {
    callback: function(value) {
        if (value > peakWagerSum.value * 2) {
            return null;
        }
        return '$' + value;
    },
    color: props.axisTextColor,
};

</script>

<template>
  <div>
    <Chart
      v-if="outcomesProbChartData"
      class="chart p-2"
      :plugins="[NowLinePlugin.make({ color: props.chartFocusColor })]"
      :data="outcomesProbChartData"
      :options="chartOptions"
    />
  </div>
</template>

<style scoped>
/* Add any necessary styles for your component */
</style>
