<script setup>
defineProps({
    modelValue: { type: Object, required: false, default: null },
    options: { type: Array, required: true },
});
const { t } = useI18n();

defineEmits(['update:modelValue']);

const leftField = (option) => {
    return {
        label: t('investment.indicative_probability'),
        value: option.expectedProbability,
    };
};

const rightField = (option) => {
    return {
        label: t('investment.max_leverage_label'),
        value: `${parseFloat(option.maxLeverage || 1).toFixed(1)}x`,
    };
};

</script>

<template>
  <div class="event-outcome-select">
    <EventOutcomeOption
      v-for="option in options"
      :key="option.value"
      :outcome-option="option"
      :selected="modelValue?.value === option.value"
      :right-field="rightField(option)"
      :left-field="leftField(option)"
      @select="value => $emit('update:modelValue', value)"
    />
  </div>
</template>

<style lang="scss" scoped>
.event-outcome-select {
  display: flex;
  flex-direction: column;
  gap: 1px;
}
</style>
