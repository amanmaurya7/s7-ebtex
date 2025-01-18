<script setup>
import PrefixInputNumber from '@/components/Common/PrefixInputNumber.vue';
import GradientButton from '@/components/Common/GradientButton.vue';
import TransparentButton from '@/components/Common/TransparentButton.vue';
import useSetting from '@/composables/pages/useSetting';

const {
    notificationPreferences,
    notificationPreferencesForm,
    wagerPreferences,
    wagerPreferencesForm,
    wagerFavoritePreferences,
    wagerFavoritePreferencesForm,
    otherSettingsPreferences,
    otherSettingsPreferencesForm,
    otherCommunicationPreferences,
    otherCommunicationPreferencesForm,
    preferences,
    onSaveSetting,
    isSaving,
} = useSetting();

const router = useRouter();
const localePath = useLocalePath();
const onBackToPortfolio = () => {
    router.push(localePath('/portfolio'));
};
</script>

<template>
  <div class="setting bg-w2-500">
    <div class="text-center font-1375 font-bold mt-250" v-html="$t('setting.title.page')" />

    <Panel v-if="preferences">
      <template #header>
        <div class="text-color font-bold text-center font-9375 w-full mb-3">
          {{ $t('setting.title.notification') }}
        </div>
      </template>
      <div v-for="{ key, label } in notificationPreferences" :key="key" class="preference-item">
        <label :for="key">{{ label }}</label>
        <InputSwitch :id="key" v-model="notificationPreferencesForm[key]" />
      </div>
    </Panel>

    <Panel v-if="preferences">
      <template #header>
        <div class="text-color font-bold text-center font-9375 w-full mb-3">
          {{ $t('setting.title.wager') }}
        </div>
      </template>
      <div v-for="{ key, label, unit, max } in wagerPreferences" :key="key" class="preference-item">
        <label :for="key">{{ label }}</label>
        <div>
          <PrefixInputNumber
            :id="key"
            v-model="wagerPreferencesForm[key]"
            :min-fraction-digits="key === 'default_wager_size' ? 0 : 1"
            :prefix="unit"
            :step="0.1"
            :max="max"
          />
        </div>
      </div>
    </Panel>

    <Panel v-if="preferences">
      <template #header>
        <div class="text-color font-bold text-center font-9375 w-full mb-3">
          {{ $t('setting.title.favorite') }}
        </div>
      </template>
      <div v-for="{ key, label } in wagerFavoritePreferences" :key="key" class="preference-item">
        <label :for="key">{{ label }}</label>
        <InputSwitch :id="key" v-model="wagerFavoritePreferencesForm[key]" />
      </div>
    </Panel>

    <Panel>
      <template #header>
        <div class="text-color font-bold text-center font-9375 w-full mb-3">
          {{ $t('setting.title.language') }}
        </div>
      </template>
      <div v-for="{ key, options } in otherSettingsPreferences" :key="key" class="preference-item justify-content-center gap-3 locale-item">
        <label
          v-for="({ value, label }, optionIndex) in options"
          :key="value"
          :for="key"
          class="flex-grow-0"
          :class="{'flex-order-1 text-right': optionIndex === options.length - 1}"
        >
          {{ label }}
        </label>
        <InputSwitch
          :id="key"
          v-model="otherSettingsPreferencesForm[key]"
          true-value="ja"
          false-value="en"
        />
      </div>
      <!-- <div v-for="{ key, label } in otherCommunicationPreferences" :key="key" class="preference-item locale">
        <label :for="key">{{ label }}</label>
        <InputSwitch :id="key" v-model="otherCommunicationPreferencesForm[key]" />
      </div> -->
    </Panel>
    <div class="mx-150">
      <GradientButton tint="yellow" :loading="isSaving" @click="onSaveSetting">
        <template #content>
          <img src="/images/v1.5/icon-save.png" alt="save" width="20" class="mr-3">
          {{ $t('button.save_settings') }}
        </template>
      </GradientButton>
      <TransparentButton
        class="mt-4"
        @click="onBackToPortfolio"
      >
        <template #content>
          <img src="/images/v1.5/icon-chevron-right.png" alt="cancel" width="12" class="mr-2 tint-m3-500-filter rotate-180">
          <span class="text-m3-500">{{ $t('button.back_to_portfolio') }}</span>
        </template>
      </TransparentButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.setting {
  padding: 0 0rem 6rem;
  display: flex;
  flex-direction: column;
  gap: .75rem;

  :deep(.p-panel-content) {
    padding: 0;
  }

  .preference-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: .5rem .75rem;
    border-bottom: 1px solid var(--m3-a20);

    &:first-child {
      border-top: 1px solid var(--m3-a20);
    }

    label {
      flex: 1;
      font-size: 0.875rem;
    }

    :deep(.p-inputtext) {
      max-width: 100px;
    }

    &.locale-item {
      .p-inputswitch {
        width: 4.5rem;

        &.p-inputswitch-checked :deep(.p-inputswitch-slider):before {
          transform: translateX(2.7rem);
        }
      }
    }
  }
}

label {
  font-weight: bold;
}
</style>
