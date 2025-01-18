<script setup>
defineProps({
    header: { type: String, required: true },
    content: { type: String, required: true },
    buttonLabel: { type: String, required: true },
});

const emits = defineEmits(['submit']);
const isScrollToEnd = ref(false);
const isConfirmed = ref(false);

onMounted(() => {
    const options = {
        root: document.querySelector('#scroll-wrapper'),
        rootMargin: '0px',
        threshold: 0.8,
    };
    const target = document.querySelector('#observer-target');
    if (target) {
        const observer = new IntersectionObserver((entries) => {
            const isTargetVisible = entries[0].isIntersecting;
            if(isTargetVisible && !isScrollToEnd.value) {
                isScrollToEnd.value = true;
            }
        }, options);
        observer.observe(target);
    }
});
</script>

<template>
  <section>
    <header>
      {{ header }}
    </header>
    <div id="scroll-wrapper">
      <div v-html="content" />
      <div id="observer-target" />
    </div>
    <div class="flex align-items-center justify-content-center my-4">
      <Checkbox v-model="isConfirmed" binary input-id="is-confirmed" class="mr-3" />
      <label for="is-confirmed" class="text-xl font-bold">{{ $t('confirmation.agree') }}</label>
    </div>
    <Button
      rounded
      size="large"
      icon="pi pi-angle-right"
      icon-pos="right"
      :label="buttonLabel"
      class="p-button-action w-full"
      :disabled="!isConfirmed || !isScrollToEnd"
      @click="emits('submit')"
    />
  </section>
</template>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 16px;
  font-weight: 700;
  text-align: center;
  font-size: 1.25rem;
  min-height: 64px;
  margin-bottom: 20px;
}

#scroll-wrapper {
  width: 100%;
  background-color: #fff;
  padding: 12px 8px;
  max-height: 400px;
}
</style>
