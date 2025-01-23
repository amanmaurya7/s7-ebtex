<script setup>
import FAQQuestionList from '~/components/FAQ/FAQQuestionList.vue';
import GradientButton from '@/components/Common/GradientButton.vue';
import XInputText from '@/components/Common/XInputText.vue';
import useFaq from '~/composables/pages/useFaq';
import FAQList from '~/components/FAQ/FAQList.vue';

const { sections, fetchFaqs } = useFaq();
await fetchFaqs();

const isChatOpen = ref(false);

const onClickMoreDetail = () => {
    const chatButton = document.getElementById('chatbase-bubble-button');
    if (chatButton) {
        chatButton.click();
        isChatOpen.value = !isChatOpen.value;
    }
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
  <section class="faq-container">
    <div class="page-title mt-250 text-center font-1375 font-bold uppercase mb-5" v-html="$t('faq.page_title')" />

    <div class="content-wrapper">
      <TabView>
        <TabPanel :header="$t('faq.tab_browse')" class="bg-w2-500">
          <FAQList :sections="sections" />
        </TabPanel>
        <TabPanel :header="$t('faq.tab_find')" class="bg-w2-500">
          <div class="find-section">
            <div class="find-container">
              <div class="search-box">
                <div class="search-input-wrapper">
                  <XInputText
                    ref="keywordInput"
                    v-model="inputKeyword"
                    field-name=""
                    type="text"
                    :placeholder="$t('Search here')"
                    class="search-input"
                    @keyup.enter="updateKeyword"
                    @focus="keywordInputFocus = true"
                    @blur="updateKeyword"
                  />
                </div>
                <Transition name="fade">
                  <div v-if="keywordInputFocus" 
                       class="search-hint uppercase" 
                       v-html="$t('faq.type_and_hit_enter')" />
                  <div v-else-if="keyword" 
                       class="search-count uppercase" 
                       v-html="$t('faq.n_results', { count: filteredQuestions.length })" />
                </Transition>
              </div>

              <Transition name="fade">
                <div v-if="keyword" class="search-results">
                  <div class="results-list">
                    <FAQQuestionList
                      v-if="filteredQuestions.length"
                      :questions="filteredQuestions"
                      class="faq-results"
                    />
                    <div v-else class="no-results-message">
                      {{ $t('faq.no_results') }}
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </TabPanel>
      </TabView>

      <div class="chat-section px-100 mb-125 section-chat-us">
        <div class="mt-4 mb-4 text-center white-space-pre-wrap font-75 font-bold uppercase">
          {{ $t('faq.inquiry.message') }}
        </div>
        <GradientButton
          class="chat-button"
          @click="onClickMoreDetail"
        >
          <template #content>
            <img src="/images/v1.5/icon-chat.png" width="20" height="16" alt="chat" class="mr-2">
            <span class="hidden md:inline">{{ isChatOpen ? $t('Close Chat') : $t('button.chat_with_us') }}</span>
            <span class="md:hidden">{{ $t('button.chat_with_us') }}</span>
          </template>
        </GradientButton>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.faq-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  .page-title {
    @media (min-width: 768px) {
      font-size: 2rem;
      margin-top: 3rem;
    }
  }

  .content-wrapper {
    background: var(--w2-500);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (min-width: 768px) {
      margin: 2rem auto;
    }
  }

  .search-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;

    :deep(input) {
      width: 100%;
      height: 48px;
      font-size: 1.1rem;
      border-radius: 24px;

      @media (min-width: 768px) {
        max-width: 480px;
        margin: 0 auto;
      }
    }
  }

  .results-container {
    @media (min-width: 768px) {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }
  }

  .chat-section {
    text-align: center;
    padding: 2rem 1rem;

    @media (min-width: 768px) {
      padding: 3rem 1rem;
    }

    .chat-button {
      max-width: 240px;
      margin: 0 auto;
    }
  }

  .find-section {
    padding: 2rem 1rem;
    
    @media (min-width: 768px) {
      padding: 3rem 0;
    }
  }

  .find-container {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .search-box {
    width: 100%;
    max-width: 600px;
    padding: 0 1rem;
    margin-bottom: 2rem;

    .search-input-wrapper {
      position: relative;
    }

    .search-hint,
    .search-count {
      display: block;
      text-align: center;
      color: var(--text-color-secondary);
      font-size: 0.875rem;
      font-weight: normal;
      margin-top: 0.75rem;
      padding: 0.5rem;
    }
  }

  .search-results {
    width: 100%;
    border-top: 1px solid var(--m3-a20);
    margin-top: 1rem;
    padding-top: 1.5rem;

    .results-list {
      padding: 0 1rem;

      @media (min-width: 768px) {
        padding: 0 2rem;
      }
    }

    .faq-results {
      :deep(.p-accordion-tab) {
        margin-bottom: 1rem;
        border: 1px solid var(--m3-a20);
        border-radius: 8px;
        overflow: hidden;
        transition: box-shadow 0.3s ease;

        &:hover {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        &:last-child {
          margin-bottom: 0;
        }

        .p-accordion-header {
          padding: 1rem 1.5rem;
        }

        .p-accordion-content {
          padding: 0 1.5rem 1.5rem;
        }
      }
    }

    .no-results-message {
      text-align: center;
      padding: 3rem 1rem;
      color: var(--text-color-secondary);
      font-size: 1.1rem;
      font-weight: 500;
    }
  }
}

:deep(.p-tabview) {
  .p-tabview-nav-container {
    background: white;
    border-bottom: 1px solid var(--m3-a20);

    @media (min-width: 768px) {
      padding: 0 2rem;
    }
  }

  .p-tabview-nav {
    @media (min-width: 768px) {
      justify-content: center;
    }
  }

  .p-tabview-panels {
    background: var(--w2-500);
  }
}

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

.section-chat-us {
  border-top: 1px solid var(--m3-a20);
}

:deep(.p-accordion-tab:not(:last-child)) {
  border-bottom: 1px solid var(--m3-a20);
}

.search-section {
  padding: 2rem 1rem;
  
  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
  
  .search-input-wrapper {
    position: relative;
    margin-bottom: 1rem;

    :deep(.search-input) {
      width: 100%;
      height: 54px;
      padding: 0.75rem 1.5rem 0.75rem 3.5rem;
      font-size: 1.1rem;
      border-radius: 27px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;

      &:focus {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      @media (min-width: 768px) {
        font-size: 1.2rem;
      }
    }
  }

  .search-hint,
  .search-results-count {
    text-align: center;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
}

.results-wrapper {
  margin-top: 2rem;
  border-top: 1px solid var(--m3-a20);
}

.results-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;

  .faq-results-list {
    :deep(.p-accordion-tab) {
      margin-bottom: 1rem;
      border: 1px solid var(--m3-a20);
      border-radius: 8px;
      overflow: hidden;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .no-results {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-color-secondary);
    font-size: 1.1rem;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.find-section {
  padding: 2rem 1rem;
  
  @media (min-width: 768px) {
    padding: 3rem 0;
  }
}

.find-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-box {
  width: 100%;
  max-width: 600px;
  padding: 0 1rem;
  margin-bottom: 2rem;

  .search-input-wrapper {
    position: relative;
  }

  .search-hint,
  .search-count {
    display: block;
    text-align: center;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
    font-weight: normal;
    margin-top: 0.75rem;
    padding: 0.5rem;
  }
}

.search-results {
  width: 100%;
  border-top: 1px solid var(--m3-a20);
  margin-top: 1rem;
  padding-top: 1.5rem;

  .results-list {
    padding: 0 1rem;

    @media (min-width: 768px) {
      padding: 0 2rem;
    }
  }

  .faq-results {
    :deep(.p-accordion-tab) {
      margin-bottom: 1rem;
      border: 1px solid var(--m3-a20);
      border-radius: 8px;
      overflow: hidden;
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      &:last-child {
        margin-bottom: 0;
      }

      .p-accordion-header {
        padding: 1rem 1.5rem;
      }

      .p-accordion-content {
        padding: 0 1.5rem 1.5rem;
      }
    }
  }

  .no-results-message {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-color-secondary);
    font-size: 1.1rem;
    font-weight: 500;
  }
}
</style>