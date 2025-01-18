<script setup>
defineProps({
    questions: {
        type: Array,
        required: true,
    },
});
</script>

<template>
  <Accordion class="faq-accordion">
    <template #expandicon>
      <div>
        <img src="/images/v1.5/icon-expand-arrow-down.png" width="8" height="4" alt="down" class="mr-1">
      </div>
    </template>
    <template #collapseicon>
      <div>
        <img src="/images/v1.5/icon-expand-arrow-down.png" width="8" height="4" alt="up" class="mr-1 rotate-180 opacity-20">
      </div>
    </template>
    <AccordionTab
      v-for="(faq, index) in questions"
      :key="index"
      headerClass="font-bold font-75 question-tab border-b-0"
    >
      <template #header>
        <div class="font-bold font-75" v-html="faq.question" />
      </template>
      <div class="flex align-items-center p-3 font-75">
        <div v-html="faq.answer" />
      </div>
    </AccordionTab>
  </Accordion>
</template>

<style lang="scss" scoped>
:deep(.p-accordion) {
  display: flex;
  flex-direction: column;

  .p-accordion-header {
    background: var(--w2-500);
  }

  .p-accordion-header-text {
    color: var(--text-color) !important;
    margin-left: .5rem;
  }

  .p-accordion-content {
    padding: 0;
    border-bottom: 1px solid var(--m3-a20);
  }
}

:deep(.question-tab) {
  border-bottom: 1px solid var(--m3-a20);
}

:deep(.p-accordion-header) {
    background: var(--w2-500);
  }

:deep(.p-accordion-header-action) {
    color: var(--text-color) !important;
    margin-left: .5rem;
    justify-content: space-between;
  }

</style>