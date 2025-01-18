<script setup>
const { getSitePage } = useApi();
const { data } = await getSitePage('terms'); // TODO: Change to 'wager-refunded' when available
const html = computed(() => data.value?.html || '');
</script>

<template>
  <section>
    <h3 class="text-white text-center mb-4 p-3 bg-red-500 white-space-pre-wrap">
      {{ $t('wager.refunded_title') }}
    </h3>
    <div class="content-wrap" v-html="html" />
    <Button
      rounded
      size="large"
      icon="pi pi-angle-right"
      icon-pos="right"
      :label="$t('button.back')"
      class="w-full p-button-action mt-5"
      @click="$router.go(-1)"
    />
  </section>
</template>

<style lang="scss">
section {
  padding: 0 1.25rem 3rem;
}

.content-wrap {
  padding: 1.5rem .5rem;
  line-height: 130%;
  font-size: .75rem;
  background-color: #fff;
}
</style>
