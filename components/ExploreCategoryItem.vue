<script setup>
const props = defineProps({
    category: {
        type: Object,
        required: true,
    },
});
</script>

<template>
  <div class="category-item">
    <div class="category-banner">
      <img class="banner-image" :src="props.category.image_url || 'https://fakeimg.pl/1920x1440'">
      <div class="category-name">
        <img src="/images/v1.5/icon-category-name.png" width="12" height="12">
        {{ props.category.name }}
        <div class="category-event-count">
          {{ props.category.num_events }}
        </div>
        <div class="flex-grow-1" />
        <img src="/images/v1.5/icon-chevron.png" height="12">
      </div>
    </div>
    <div class="sub-categories">
      <NuxtLink
        v-for="subTag in props.category.sub_tags"
        :key="subTag.id"
        class="sub-tag"
        :to="localePath(`/explore/categories/${props.category.slug}--${subTag.slug}`)"
      >
        <img src="/images/v1.5/icon-subcategory-green.png" width="12"> {{ subTag.name }}
      </NuxtLink>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.category-item {
    background: var(--w2-500);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    @media (min-width: 1024px) {
        &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }
    }
}

.category-banner {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    border-radius: 12.5px 12.5px 10px 10px;

    .banner-image {
        width: 100%;
        aspect-ratio: 16/9;
        object-fit: cover;
        transition: transform 0.3s ease;

        @media (min-width: 1024px) {
            aspect-ratio: 21/9;
            &:hover {
                transform: scale(1.05);
            }
        }
    }
}

.category-name {
    display: flex;
    padding: 1rem;
    background: var(--w2-500);
    align-items: center;
    font-size: .9375rem;;
    font-weight: bold;
    text-transform: uppercase;
    gap: 8px;

    @media (min-width: 1024px) {
        font-size: 1.25rem;
        padding: 1.5rem;
    }
}

.category-event-count{
    background: var(--m4-500);
    font-size: 0.6rem;
    border-radius: 5px;
    color: white;
    padding: 4px 5px;
    flex-grow: 0;
}

.sub-categories {
    display: flex;
    flex-direction: column;
    padding: 0rem .5rem;

    @media (min-width: 1024px) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        padding: 1.5rem;
    }
}

.sub-tag {
    font-size: 0.875rem;
    font-weight: bold;
    border-bottom: 1px solid #00808051;
    padding: 0.5rem 0.2rem;
    list-style: none;

    &:last-child {
        border-bottom: none;
    }

    @media (min-width: 1024px) {
        border: 1px solid var(--m3-a20);
        border-radius: 8px;
        padding: 1rem;
        transition: background-color 0.2s ease;

        &:hover {
            background-color: var(--m3-a20);
        }
    }
}
</style>