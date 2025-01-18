<script setup>
const keyword = ref('');
const internalKeyword = ref('');
const updateKeyword = () => {
    keyword.value = internalKeyword.value;
};


</script>

<template>
  <div class="event-search-container">
    <div class="page-title" v-html="$t('search.find_events')" />
    <div class="flex">
      <InputText v-model="internalKeyword" class="keyword-input" autofocus />
    </div>
    <div class="text-center">
      <Button :label="$t('search.search')" class="search-button" @click="updateKeyword" />
    </div>
    <div v-if="keyword" class="result-container">
      <SearchResultList
        :allow-filter="true"
        :keyword="keyword"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>

.event-search-container {
  background: var(--color-background);
  min-height: 60vh;
}

.result-container {
  background-color: var(--m1-500);
  min-height: 50vh;
}

.page-title {
    font-size: 1.375rem;
    font-weight: bold;
    margin: 1.75rem auto 1.375rem;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.03rem;

    :deep(.highlight) {
        color: var(--m4-500);
    }
}

.keyword-input {
    flex-grow: 1;
    border: none;
    margin: 0 1.5rem;
    display: block;
    font-size: 1.875rem;
    font-weight: bold;
    text-align: center;
    width: calc(100vw - 3rem);

    border-bottom: 2px solid var(--m3-a20);
    &:focus {
    border-bottom: 2px solid var(--m4-500);
    }
}

.search-button {
    width: calc(100vw - 3rem);
    margin: 1.5rem auto 3rem;
    font-weight: 500;
    font-size: 1rem;;
    text-transform: uppercase;
    padding: 0.9375rem 0;
    background-color: var(--m3-500);
    background-image: url('/images/v1.5/bg-button-green-gradient.png');
    background-repeat: no-repeat;
    background-position: center;
    border: none;
}
</style>
