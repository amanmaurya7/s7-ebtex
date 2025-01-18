<script setup>
import FAQQuestionList from '~/components/FAQ/FAQQuestionList.vue';
import GradientButton from '@/components/Common/GradientButton.vue';
import XInputText from '@/components/Common/XInputText.vue';
import useFaq from '~/composables/pages/useFaq';
import FAQList from '~/components/FAQ/FAQList.vue';

const { sections, fetchFaqs } = useFaq();
await fetchFaqs();

const onClickMoreDetail = () => {
    document.getElementById('chatbase-bubble-button').click();
};

const keyword = ref('');
const inputKeyword = ref('');
const keywordInput = ref(null);
const keywordInputFocus = ref(false);

const updateKeyword = () => {
    keyword.value = inputKeyword.value.trim();
    keywordInputFocus.value = false;
    keywordInput.value?.$el?.children[0]?.blur();
};

const filteredQuestions = computed(() => {
    // Find the questions that match the keyword
    // 1. question.title contains the keyword
    // 2. question.answer contains the keyword

    const target = keyword.value.toLowerCase();
    return sections.value.flatMap((section) => {
        return section.faqs.filter((question) => {
            return question.question.toLowerCase().indexOf(target) !== -1
              || question.answer.toLowerCase().indexOf(target) !== -1;
        });
    }).map(q => {
        return {
            ...q,
            question: q.question.replaceAll(target, `<b class="text-m4-500">${target}</b>`),
            answer: q.answer.replaceAll(target, `<b class="text-m4-500">${target}</b>`),
        };
    });
});

</script>

<template>
  <section>
    <div class="mt-250 text-center font-1375 font-bold uppercase mb-5" v-html="$t('faq.page_title')" />

    <TabView>
      <TabPanel :header="$t('faq.tab_browse')" class="bg-w2-500">
        <FAQList :sections="sections" />
      </TabPanel>
      <TabPanel :header="$t('faq.tab_find')" class="bg-w2-500">
        <div class="mx-4 pt-2">
          <XInputText
            ref="keywordInput"
            v-model="inputKeyword"
            field-name=""
            type="text"
            class="text-center bg-transparent"
            @keyup.enter="updateKeyword"
            @focus="keywordInputFocus = true"
            @blur="updateKeyword"
          />
          <div v-if="keywordInputFocus" class="uppercase font-75 text-center pb-4" v-html="$t('faq.type_and_hit_enter')" />
          <div v-else-if="keyword" class="uppercase font-75 text-center pb-4" v-html="$t('faq.n_results', { count: filteredQuestions.length })" />
        </div>

        <div class="pb-250" style="border-top: 1px solid var(--m3-a20);">
          <FAQQuestionList
            v-show="keyword && filteredQuestions.length"
            :questions="filteredQuestions"
          />
        </div>
      </TabPanel>
    </TabView>

    <div class="px-100 mb-125 section-chat-us">
      <div class="mt-4 mb-0 text-center white-space-pre-wrap font-75 font-bold uppercase">
        {{ $t('faq.inquiry.message') }}
      </div>
      <GradientButton
        @click="onClickMoreDetail"
      >
        <template #content>
          <img src="/images/v1.5/icon-chat.png" width="20" height="16" alt="chat" class="mr-2">
          {{ $t('button.chat_with_us') }}
        </template>
      </GradientButton>
    </div>
  </section>
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

:deep(.p-tabview-nav-container) {
  background: white;
}

:deep(.p-tabview) {
  background: var(--w2-500);
}

:deep(.p-tabview-panels) {
  background: var(--w2-500);
}

.section-chat-us {
  border-top: 1px solid var(--m3-a20);
}

:deep(.p-accordion-tab:not(:last-child)) {
  border-bottom: 1px solid var(--m3-a20);
}
</style>
