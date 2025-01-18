<script setup>
const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
});

const container = ref(null);
const currentPage = ref(0);
const touchStart = ref(null);
const touchEnd = ref(null);

const goToPage = (page) => {
    if (!container.value) return;

    const parent = container.value;
    const target = parent.children[page % parent.children.length];

    const offset = target.offsetLeft - 20;

    container.value.scrollTo({
        left: offset,
        behavior: 'smooth',
    });
  
    currentPage.value = page;
};

const handleTouchStart = (e) => {
    touchStart.value = e.touches[0].clientX;
};

const handleTouchMove = (e) => {
    touchEnd.value = e.touches[0].clientX;
};

const handleTouchEnd = (e) => {
    if (!touchStart.value || !touchEnd.value) return;
  
    const diff = touchStart.value - touchEnd.value;
  
    if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0 && currentPage.value < props.items.length - 1) {
            // Swipe left - go next
            goToPage(currentPage.value + 1);
        } else if (diff < 0 && currentPage.value > 0) {
            // Swipe right - go prev
            goToPage(currentPage.value - 1);
        }
    }
  
    touchStart.value = null;
    touchEnd.value = null;
};
</script>

<template>
  <div class="carousel-wrapper">
    <div 
      ref="container"
      class="carousel-container"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove" 
      @touchend="handleTouchEnd"
    >
      <div 
        v-for="(item, index) in items"
        :key="index"
        class="carousel-item"
      >
        <slot name="item" :item="item" />
      </div>
    </div>
    
    <div class="carousel-pagination">
      <div
        v-for="(_, index) in items"
        :key="index"
        class="pagination-dot"
        :class="{ current: currentPage === index }"
        @click="goToPage(index)"
      />
    </div>
  </div>
</template>

<style scoped>
.carousel-wrapper {
    color: gray;
    position: relative;
    width: 100%;
    overflow: visible;
}

.carousel-container {
    touch-action: none;
    display: flex;
    width: 100%;
    overflow-x: scroll;
    gap: 20px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 0 20px;
    align-items: center;

    &::-webkit-scrollbar {
        display: none;
    }
}

.carousel-item {
  flex: 0 0 90%;
  width: 90%;
}

.carousel-pagination {
  /* display: flex; */
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  display: none;
}

.pagination-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: background-color 0.3s;
  background: var(--m4-500);
  opacity: 0.2;
}

.pagination-dot.current {
  opacity: 1;
}
</style>

