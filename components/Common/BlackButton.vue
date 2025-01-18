<script setup>

import Button from 'primevue/button';

</script>
<template>
  <Button class="black-button text-white font-9375">
    <slot name="content" />
  </Button>
</template>

<style lang="scss" scoped>
.black-button {
    background-color: #000;
    color: #fff;
    border: none;
    box-shadow: 0px 0px 6px var(--m3-500);
    padding: .5rem .75rem;
}
</style>