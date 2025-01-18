<script setup>
import FAQQuestionList from './FAQQuestionList.vue';

defineProps({
    sections: {
        type: Array,
        required: true,
    },
});
</script>

<template>
  <Accordion multiple :active-index="[]">
    <template #expandicon>
      <div>
        <img src="/images/v1.5/icon-chevron-down-green.png" width="12" height="10" alt="down" class="mr-1">
      </div>
    </template>
    <template #collapseicon>
      <div>
        <img src="/images/v1.5/icon-chevron-up-green.png" width="12" height="10" alt="up" class="mr-1">
      </div>
    </template>
    <AccordionTab
      v-for="{ category, faqs } in sections"
      :key="category"
      :header="$t(category)"
      header-class="font-bold uppercase"
    >
      <FAQQuestionList :questions="faqs" />
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
  }
}

:deep(.p-accordion-header) {
  border-bottom: 1px solid var(--m3-a20);
}
</style>