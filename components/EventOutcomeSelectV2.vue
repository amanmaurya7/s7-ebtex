<script setup>
import EventOutcomeSelectV2Option from './EventOutcomeSelectV2Option.vue';
import Tooltip from '@/components/Common/Tooltip.vue';

const props = defineProps({
    modelValue: { type: Object, required: false, default: null },
    options: { type: Array, required: true },
    tintForSelectedOption: { type: String, required: false, default: 'white' },
    showOnlySelectedOption: { type: Boolean, required: false, default: false },
    activePositionOutcomeMap: { type: Object, required: false, default: () => ({}) },
    // outcome id to "new", "rolled", "splitted"
    // `new` means no wager made before
    // `rolled` means there are same leveraged / cash wagers are going to be combined
    // `splitted` means new bet is splitted from existing wagers(because they have/or have not used leverage)
    newBetTypeMap: { type: Object, required: false, default: () => ({}) },
});
const emit = defineEmits(['update:modelValue']);

const optionsToShow = computed(() => {
    if (props.showOnlySelectedOption) {
        return props.options.filter(o => o._id === props.modelValue?._id);
    }
    return props.options;
});

const onOptionClick = (o) => {
    if (props.showOnlySelectedOption) {
        return;
    }

    if (props.modelValue && o._id === props.modelValue?._id) {
        emit('update:modelValue', null);
    } else {
        emit('update:modelValue', o);
    }
};
</script>

<template>
  <div class="outcome-header-container mb-2 px-3 uppercase font-75">
    <div class="event-outcome-select-header text-white">
      {{ $t('outcome_select.outcome') }}
    </div>
    <div class="event-outcome-select-header text-white">
      <Tooltip :tooltip-content="$t('betting.projected_payout_tooltip')"> 
        {{ $t('outcome_select.probability') }}
      </Tooltip>
    </div>
  </div>
  <EventOutcomeSelectV2Option
    v-for="o in optionsToShow"
    :key="o.id"
    :is-active-position="activePositionOutcomeMap[o._id]"
    :rolled="newBetTypeMap[o._id] === 'rolled'"
    :option="o"
    :selected="modelValue && o._id === modelValue?._id"
    :tint="modelValue && o._id === modelValue?._id ? tintForSelectedOption : '#ffffff'"
    :hide-24hr-change="modelValue && o._id !== modelValue?._id"
    @click="onOptionClick(o)"
  />
</template>

<style lang="scss" scoped>
.outcome-header-container {

  display: flex;
  font-size: 15px;
  justify-content: space-between;
  
 
  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 0 2rem; 
    
    .event-outcome-select-header {
      &:first-child {
        text-align: left;
        padding-right: 5rem;
      }
      &:last-child {
        text-align: right;
        padding-left: 18rem; 
      }
    }
  }
}
</style>
