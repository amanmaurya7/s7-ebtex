<script setup>
import OverlayPanel from 'primevue/overlaypanel';

const props = defineProps({
    // When no triggerElementRef is provided, the tooltip will be activated when the whole element is clicked/touched
    triggerElementRef: {
        type: Object,
        required: false,
        default: null,
    },
    // When an tooltipTeleportTarget is provided, tooltip slot won't be shown when the tooltip is active
    // the external tooltip content will be shown instead
    tooltipTeleportTarget: {
        type: String,
        required: false,
        default: null,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

defineExpose({
    show: () => {
        isActive.value = true;
    },
    hide: () => {
        isActive.value = false;
    },
});

const emits = defineEmits(['show', 'hide']);
const overlayRef = ref(null);

const isActive = ref(false);
const onTrigerClick = (e) => {
    if (props.disabled) {
        return;
    }

    isActive.value = !isActive.value;

    if (props.tooltipTeleportTarget) {
        emits(isActive.value ? 'show' : 'hide');
        return;
    } else if (isActive.value) {
        overlayRef.value.show(e);
    } else {
        overlayRef.value.hide(e);
    }
};

const onShow = () => {
    emits('show');
    isActive.value = true;
};

const onHide = () => {
    emits('hide');
    isActive.value = false;
};

const delayMountFilled = ref(false);
onMounted(() => {
    if (props.tooltipTeleportTarget) {
        setTimeout(() => {
            delayMountFilled.value = true;
        }, 1000);
    }
});
</script>

<template>
  <div :class="{'active': isActive}" @click="onTrigerClick">
    <slot />
    <Teleport v-if="tooltipTeleportTarget && delayMountFilled" :to="tooltipTeleportTarget">
      <div v-if="isActive">
        <slot name="tooltip" />
      </div>
    </Teleport>
    <OverlayPanel v-else ref="overlayRef" @show="onShow" @hide="onHide">
      <slot name="tooltip" />
    </OverlayPanel>
  </div>
</template>

<style scoped>

.dotted-element {
    border-bottom: 2px dotted var(--error-500);
}

</style>