<script setup>
import InputNumber from 'primevue/inputnumber';
import Bubble from './Bubble.vue';

const emit = defineEmits(['change']);

defineProps({
    // type can be `number`, `text`, `password`
    type: { type: String, required: true },
    fieldName: { type: String, required: true, default: '' },
    // can be null, true, false
    isValid: { type: Boolean, default: null },
    message: { type: String, default: '' },
    bubbleMessage: { type: String, default: '' },
    tint: { type: String, default: '--m4-500' },
    toggleMask: { type: Boolean, default: true },
});

const focused = ref(false);

const emitChange = (event) => {
    emit('change', event.value);
};

</script>

<template>
  <div class="x-input-wrapper" :class="{valid: true === isValid, 'not-valid': false === isValid}" :style="{'--tint': `var(${tint})` }">
    <Bubble v-if="bubbleMessage && focused" class="bubble">{{ bubbleMessage }}</Bubble>
    <div class="flex justify-content-between gap-2">
      <div class="field-name">
        {{ fieldName }}
      </div>
      <div class="hint-container">
        <slot name="hint" />
        <div v-if="message" class="message text-right">
          {{ message }}
        </div>
      </div>
    </div>
    <InputText
      v-if="type === 'text'"
      class="input"
      v-bind="$attrs"
      @focus="focused = true"
      @blur="focused = false"
      @input="emitChange"
    />
    <Password
      v-else-if="type === 'password'"
      class="input"
      v-bind="$attrs"
      :feedback="false"
      :toggle-mask="toggleMask"
      @focus="focused = true"   
      @blur="focused = false"
      @input="emitChange"
    />
    <InputNumber
      v-else-if="type === 'number'"
      class="input"
      v-bind="$attrs"
      @focus="focused = true"
      @blur="focused = false"
      @input="emitChange"
    />
  </div>
</template>

<style scoped lang="scss">
.x-input-wrapper {
    margin-top: 1.2rem;
}

:deep(.p-password) {
    padding-right: 0 !important;
}

:deep(.input), :deep(.p-password-input) {
    width: 100%;
}

:deep(.p-password-input) {
    color: var(--m4-500);
}

:deep(input) {
    margin: 0;
    flex-grow: 1;
    border: none;
    display: block;
    font-size: 1.125rem;
    font-weight: bold;
    width: calc(100vw - 3rem);
    padding-left: 0.2rem;
    border-radius: 0;

    border-bottom: 2px solid var(--m3-a20);
    &:focus {
        outline: none;
        box-shadow: none !important;
        border-bottom: 2px solid var(--tint) !important;
    }
}

.x-input-wrapper .message {
    font-size: 0.75rem !important;
    font-weight: bold;
    align-self: center;
    padding: 2px 4px;
    border-radius: 4px;
}

.x-input-wrapper .hint-container {
    margin-top: 0.7rem;
}

.x-input-wrapper.not-valid {
    & :not(.p-password).input, & .p-password :deep(input) {
        border-bottom: 2px solid var(--error-500);
        color: var(--error-500);
    }

    .message {
        background: var(--error-500); 
        color: white;
        height: auto;
    }
}

.field-name {
    text-transform: capitalize;
    font-size: 1rem;
    font-weight: bold;
    margin-top: 0.7rem;
    margin-bottom: 0.5rem;
}

:deep(.p-password.p-input-icon-right) {
    padding-right: 1.2rem;
    svg {
        opacity: 0;
        position: absolute;
        top: calc(50% - 10px);
        z-index: 4;
    }

    &:has(input[type="password"]) {
        &::after {
            z-index: 1;
            content: "";
            display: inline-block;
            background: url(/images/v1.5/EX-Aid-Show.svg) no-repeat;
            width: 15px;
            height: 15px;
            filter: invert(47%) sepia(100%) saturate(3176%) hue-rotate(151deg) brightness(103%) contrast(101%);
            position: absolute;
            right: 1rem;
            top: calc(50% - 7.5px);
        }
    }
    &:has(input[type="text"]) {
        &::after {
            z-index: 1;
            content: "";
            display: inline-block;
            background: url(/images/v1.5/EX-Aid-Hide.svg) no-repeat;
            width: 15px;
            height: 15px;
            filter: invert(47%) sepia(100%) saturate(3176%) hue-rotate(151deg) brightness(103%) contrast(101%);
            position: absolute;
            right: 1rem;
            top: calc(50% - 7.5px);
        }
    }
}

</style>