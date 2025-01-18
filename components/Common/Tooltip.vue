<script setup>
import OverlayPanel from 'primevue/overlaypanel';

const props =defineProps({
    underlineActiveColor: {
        type: String,
        default: 'var(--m4-500)',
    },
    tooltipContent: {
        type: String,
        default: '',
    },
    hideActiveUnderline: {
        type: Boolean,
        default: false,
    },
    mode: {
        type: String,
        // white, dark
        default: 'white',
    },
});

const overlayRef = ref(null);
const isActive = ref(false);

const onTriggerClick = (e) => {
    if (isActive.value) {
        overlayRef.value.hide(e);
    } else {
        overlayRef.value.show(e);
        setTimeout(() => {
            overlayRef.value?.alignOverlay();
            const panel = document.querySelector('.p-overlaypanel');
            if (panel) {
                panel.style.top = (parseInt(panel.style.top) + 10) + 'px';
            }
        }, 50);
    }
};

const contentStyle = computed(() => {
    return {
        'border-bottom': props.hideActiveUnderline ? 'none !important' : `2px solid ${isActive.value ? props.underlineActiveColor : 'transparent'} !important`,
    };
});

const onShow = () => {
    isActive.value = true;
};

const onHide = () => {
    isActive.value = false;
};
</script>

<template>
  <div :class="{'active': isActive}">
    <span
      :class="{'underline-dotted': !isActive}"
      :style="contentStyle"
      @click="onTriggerClick"
    >
      <slot :trigger="onTriggerClick" />
    </span>
    <OverlayPanel
      ref="overlayRef"
      class="font-9375 text-center"
      :class="{'dark': mode === 'dark'}"
      @show="onShow"
      @hide="onHide"
    >
      <div style="max-width: 80vw;" v-html="tooltipContent" />
    </OverlayPanel>
  </div>
</template>

<style scoped>

:deep(.p-overlaypanel) {
    border: 10px solid transparent;
}

</style>
