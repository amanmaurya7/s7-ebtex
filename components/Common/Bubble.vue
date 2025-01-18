<script setup>
defineProps({
    hasTick: { type: Boolean, default: true },
    centerTick: { type: Boolean, default: false },
});
</script>

<template>
  <div class="bubble" :class="{ 'no-tick': !hasTick, 'center-tick': centerTick }">
    <slot />
  </div>
</template>

<style scoped lang="scss">

.bubble {
    background-color: var(--w2);
    border-top: 1px solid var(--m3-a20);
    border-bottom: 1px solid var(--m3-a20);
    display: inline-block;
    padding: 12px 24px;
    position: relative;
    margin-bottom: 2rem;
    word-wrap: break-word;
}

.bubble:before {
    position: absolute;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-top: 12px solid;
    border-top-color: inherit;
    bottom: -12px;
    content: "";
    left: 50%;
}

.bubble:after {
    position: absolute;
    border-left: 11px solid transparent;
    border-right: 11px solid transparent;
    border-top: 11px solid var(--w2-500);
    bottom: -10px;
    content: "";
    left: 50%;
}

.center-tick:before {
  left: calc(50vw - 6px);
}

.center-tick:after {
  left: calc(50vw - 5px);
}

.no-tick:before {
  display: none;
}

.no-tick:after {
  display: none;
}

</style>
