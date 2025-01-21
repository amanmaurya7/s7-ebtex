<script setup>
const props = defineProps({
    items: {
        type: Array,
        required: true,
    },
    autoplayInterval: {
        type: Number,
        default: 0,
    },
});

const container = ref(null);
const currentPage = ref(0);
const touchStart = ref(null);
const touchEnd = ref(null);
const currentSlide = ref(0);
const timer = ref(null);

const goToPage = (page) => {
    if (!container.value) return;

    const totalPages = props.items.length;
    if (page >= totalPages) {
        page = 0;
    } else if (page < 0) {
        page = totalPages - 1;
    }

    const parent = container.value;
    const target = parent.children[page];
    
    // Calculate center position
    const containerWidth = parent.offsetWidth;
    const itemWidth = target.offsetWidth;
    const isLastItem = page === totalPages - 1;
    
    let offset = target.offsetLeft - (window.innerWidth > 1024 ? 40 : 20);
    
    // Adjust offset for last item to center it
    if (isLastItem) {
        offset = target.offsetLeft - (containerWidth - itemWidth) / 2;
    }

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

const handleTouchEnd = () => {
    if (!touchStart.value || !touchEnd.value) return;
  
    const diff = touchStart.value - touchEnd.value;
  
    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentPage.value < props.items.length - 1) {
            goToPage(currentPage.value + 1);
        } else if (diff < 0 && currentPage.value > 0) {
            goToPage(currentPage.value - 1);
        }
    }
  
    touchStart.value = null;
    touchEnd.value = null;
};

watch(currentSlide, (newValue) => {
    goToPage(newValue);
});

onMounted(() => {
    if (props.autoplayInterval > 0) {
        timer.value = setInterval(() => {
            currentSlide.value = (currentSlide.value + 1) % props.items.length;
        }, props.autoplayInterval);
    }
});

onUnmounted(() => {
    if (timer.value) {
        clearInterval(timer.value);
    }
});
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

<style lang="scss" scoped>


.carousel-container {
    display: flex;
    width: 100%;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
    gap: 1rem;
    padding: 1rem;
    padding-right: calc(50% - 160px);
    margin-left: 10px;

    @media (min-width: 1024px) {
       
        max-width: 1400px;
        margin: 0 auto;
        margin-left: 85px;
        padding-right: calc(50% - 400px);
    }

    &::-webkit-scrollbar {
        display: none;
    }
}

.carousel-item {
    flex: 0 0 calc(100% - 2rem);
    scroll-snap-align: start;
    width: 100%;
    
    @media (min-width: 1024px) {
        flex: 0 0 calc(50% - 1rem);
        width: 100%;

    }
}

.carousel-pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin: 1rem 0;
    
    @media (min-width: 1024px) {
        margin: 1.5rem 0;
    }
}

.pagination-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--m4-500);
    opacity: 0.2;
    cursor: pointer;
    transition: opacity 0.3s;

    &.current {
        opacity: 1;
    }
}
</style>

