<script setup>

defineProps({
    title: { type: String, required: true },
    image: { type: String, required: false, default: null },
});

</script>

<template>
  <div class="wrapper">
    <div class="title" v-html="title" />
    <img
      v-if="image"
      :src="image"
      alt="illustration"
      class="illustration"
    >
  </div>
</template>

<style lang="scss" scoped>

.wrapper {
    height: 275px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--w2-500);
    border-bottom: 1px solid var(--m3-a20);

    .title {
        text-align: center;
        margin: 16px auto 16px;
        font-size: 22px;
        text-transform: uppercase;
        font-weight: bold;

        :deep(.highlight) {
            color: var(--m4-500)
        }
    }

    img {
        height: 165px;
        width: 165px;
    }
}

</style>