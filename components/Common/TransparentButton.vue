<script setup>
defineEmits(['click']);
</script>

<template>
  <Button class="transparent-button" @click="$emit('click', this)">
    <template #icon>
      <slot name="content" />
    </template>
  </Button>
</template>

<style lang="scss" scoped>

.transparent-button {
    width: 100%;
    font-weight: bold;
    font-size: 0.9375rem;;
    padding: .5rem 0;
    border: 1px solid var(--m3-a20);
    background-color: transparent;

    &:hover {
        background-color: #FFFFFF20;
    }
}

</style>