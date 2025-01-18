<template>
  <div class="or-flex" style="margin: 1.5rem auto 0;">
    <div class="or-flex-left" />
    <span class="or mx-1">or</span>
    <div class="or-flex-right" />
  </div>
</template>

<style scoped lang="scss">
.or-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 0.75rem !important;
    .or-flex-left, .or-flex-right {
        height: 1px;
        flex-grow: 1;
        background-color: var(--m3-a20);
    }
}
</style>