<script setup>
import countryCodes from 'country-codes-list';
import Dropdown from 'primevue/dropdown';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    isValid: { type: Boolean, default: null },
    message: { type: String, default: '' },
    fieldName: { type: String, default: '' },
    tint: { type: String, default: '--m4-500' },
});

const countryOptions = countryCodes.all()
    .sort((a, b) => a.countryNameEn.localeCompare(b.countryNameEn))
    .map(country => ({
        label: `${country.flag} ${country.countryNameEn}`,
        value: country.countryCode,
    }));

const selectedCountry = computed({
    get: () => countryOptions.find(option => option.value === props.modelValue),
    set: (option) => {
        emit('update:modelValue', option.value);
    },
});

const placeholderColor = ref('');

onMounted(() => {
    const input = document.querySelector('input');
    placeholderColor.value = getComputedStyle(input, '::placeholder').color;
});

</script>

<template>
  <div class="x-input-wrapper" :class="{valid: true === isValid, 'not-valid': false === isValid}" :style="{'--tint': `var(${tint})` }">
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
    <div class="relative">
      <div class="country-code-label">
        <span v-if="modelValue">{{ selectedCountry.label }}</span>
        <span v-else :style="{ color: placeholderColor }">{{ placeholder }}</span>
      </div>
      <Dropdown
        v-model="selectedCountry"
        filter
        reset-filter-on-hide
        :options="countryOptions"
        option-label="label"
        :pt="{
          root: {
            class: 'country-dropdown',
          },
        }"
      >
        <template #option="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.label }}</div>
          </div>
        </template>
      </Dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.x-input-wrapper {
    margin-top: 1.2rem;
}

:deep(.input) {
    width: 100%;
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
    & .input {
        border-bottom: 2px solid var(--error-500);
        color: var(--error-500);
    }

    .phone-number-input :deep(input) {
        border-bottom: 2px solid var(--error-500) !important;
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

.country-dropdown {
    margin: 0 16px 0 0;
    flex-grow: 0;
    flex-shrink: 0;
    min-width: 80px;
    border: none;
    display: block;
    font-size: 1.125rem;
    font-weight: bold;
    padding-left: 0.2rem;
    border-radius: 0;

    border-bottom: 2px solid var(--m3-a20);
    &:focus {
        outline: none;
        box-shadow: none !important;
        border-bottom: 2px solid var(--tint) !important;
    }

    :deep(.p-dropdown-trigger) {
        display: none;
    }
}

:deep(.country-dropdown.p-dropdown.p-overlay-open) {
    background: transparent !important;
}

:deep(.country-dropdown .p-inputtext) {
    color: transparent !important;
    width: 100%;
    font-size: 1.125rem;
}

.country-code-label {
    position: absolute;
    top: 8px;
    right: 0;
    left: 0;
    bottom: 0;
    color: var(--placeholder-text-color);
    font-size: 1.125rem;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.placeholder {
    font-size: 1.125rem;
    text-align: left !important;
    font-weight: bold;
}
</style>
