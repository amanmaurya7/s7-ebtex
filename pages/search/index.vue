<script setup>
const keyword = ref('');
const internalKeyword = ref('');
const updateKeyword = () => {
    keyword.value = internalKeyword.value;
};


</script>

<template>
  <div class="event-search-container">
    <div class="search-content">
      <div class="page-title" v-html="$t('search.find_events')" />
      <div class="search-box">
        <InputText 
          v-model="internalKeyword" 
          class="keyword-input" 
          :placeholder="$t('Enter keyword')"
          autofocus 
        />
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
  </div>
</template>

<style lang="scss" scoped>
.event-search-container {
  background: var(--color-background);
  min-height: 60vh;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
}

.search-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.result-container {
  background-color: var(--m1-500);
  min-height: 50vh;
  border-radius: 8px;
  margin-top: 2rem;
  margin-bottom: 20px;
}

.page-title {
  font-size: clamp(1.375rem, 2.5vw, 2rem);
  font-weight: bold;
  margin: 2.5rem auto 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.03rem;

  :deep(.highlight) {
    color: var(--m4-500);
  }
}

.search-box {
  max-width: 600px;
  margin: 0 auto;

}

.keyword-input {
  border: none;
  display: block;
  font-size: clamp(1.5rem, 2vw, 1rem);
  font-weight: bold;
  text-align: center;
  width: 100%;
  border-bottom: 2px solid var(--m3-a20);
  transition: border-color 0.3s ease;
  padding: 0.5rem 1rem;

  &:focus {
    border-bottom: 2px solid var(--m4-500);
    outline: none;
  }
}

.search-button {
  max-width: 400px;
  width: 100%;
  margin: 1.5rem auto 3rem;
  font-weight: 500;
  font-size: 1rem;
  text-transform: uppercase;
  padding: 1rem 2rem;
  background-color: var(--m3-500);
  background-image: url('/images/v1.5/bg-button-green-gradient.png');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border: none;
  border-radius: 4px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .search-content {
    width: 100%;
  }

  .keyword-input {
    width: calc(100vw - 3rem);
  }

  .search-button {
    width: calc(100vw - 3rem);

  }
}
</style>
