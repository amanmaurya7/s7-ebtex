<script setup>
const emit = defineEmits(['click']);
const props = defineProps({
    tint: {
        type: String,
        required: false,
        default: 'green',
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const handleClick = (event) => {
    if (!props.disabled) {
        emit('click', event);
    }
};

</script>

<template>
  <Button 
    class="gradient-button" 
    :class="{[`gradient-${props.tint}`]: true, [`gradient-${props.tint}-disabled`]: disabled, disabled: disabled}"
    @click="handleClick"
  >
    <template #icon>
      <slot name="content" />
    </template>
  </Button>
</template>

<style lang="scss" scoped>

.gradient-button {
    width: 100%;
    margin: 1.5rem auto 0rem;
    font-weight: bold;
    font-size: 1rem;;
    text-transform: uppercase;
    padding: 0.9375rem 0;
    background-repeat: no-repeat;
    background-position: center bottom;
    border: none;
    background-size: contain;
    border-radius: 6px;

}

.gradient-green {
  background-color: var(--m3-500); 
  background-image: url(/images/v1.5/bg-button-green-gradient.png);

  &:hover, &:focus, &:active {
    background-color: var(--m3-500);
  }
}

.gradient-green-disabled {
  background: white;
  border: 1px dashed var(--m3-500) !important; 
  opacity: 0.2;

  &:hover, &:focus, &:active {
    background-color: var(--m3-500);
  }
}

.gradient-yellow {
  background-color: var(--gold-500); 
  background-image: url(/images/v1.5/bg-button-yellow-gradient.png);

  &:hover, &:focus, &:active {
    background-color: var(--gold-500);
  }
}

.gradient-yellow-disabled {
  background: white;
  border: 1px dashed var(--gold-500) !important; 
  opacity: 0.2;

  &:hover, &:focus, &:active {
    background-color: var(--gold-500);
  }
}

.gradient-button.disabled {
  background: white;
  background-image: none;
  border: 1px solid var(--m3-500);
  opacity: 0.2;
  color: var(--m3-500);
  cursor: not-allowed !important;
}
</style>