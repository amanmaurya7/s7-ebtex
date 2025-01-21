<script setup>
const ColorThiefLibrary = await import('colorthief');
const ColorThief = ColorThiefLibrary.default;
const colorThief = new ColorThief();

const props = defineProps({
    collection: {
        type: Object,
        required: true,
    },
});

const dominantColor = ref('rgba(0,0,0,0.7)');
const secondaryColor = ref('rgba(0,0,0,0.4)');
const collectionImage = ref(null);
const imageLoaded = ref(false);
const imageError = ref(false);

const onImageLoad = () => {
    imageLoaded.value = true;
    try {
        const img = collectionImage.value;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const rgb = colorThief.getColor(canvas);
        dominantColor.value = `rgba(${rgb.join(',')}, 0.9)`;
        secondaryColor.value = `rgba(${rgb.join(',')}, 0.5)`;
    } catch (error) {
        console.error('Error extracting color:', error);
    }
};

const onImageError = () => {
    imageError.value = true;
};

const imgSrc = computed(() => {
    if (props.collection?.image_url) {
        return encodeURI(props.collection.image_url);
    }
    return '/images/default-collection.jpg';
});

const containerStyle = computed(() => ({
    background: `linear-gradient(to right, ${dominantColor.value}, ${secondaryColor.value})`
}));
</script>

<template>
    <div class="collection-item" :style="containerStyle">
        <div class="content-wrapper">
            <div class="image-wrapper">
                <img 
                    ref="collectionImage"
                    class="collection-image"
                    :class="{ 'loaded': imageLoaded }"
                    :src="imgSrc"
                    @load="onImageLoad"
                    @error="onImageError"
                    alt=""
                />
            </div>
            <div class="details-wrapper">
                <h3 class="collection-title">{{ props.collection.name }}</h3>
                <div class="event-info">
                    <Badge class="event-count">{{ props.collection.num_events }}</Badge>
                    <span class="event-label">{{ $t('general.events') }}</span>
                    <img class="collection-icon" src="/images/v1.5/icon-collection.png" width="16" height="16" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.collection-item {
    border-radius: 12px;
    overflow: hidden;
    height: 120px;
    transition: transform 0.2s ease;

    @media (min-width: 1024px) {
        height: 160px;
        
        &:hover {
            transform: translateY(-2px);
        }
    }
}

.content-wrapper {
    display: flex;
    height: 100%;

    @media (min-width: 1024px) {
        height: 150px;
    }
}

.image-wrapper {
    width: 120px;
    height: 100%;
    flex-shrink: 0;

    @media (min-width: 1024px) {
        width: 160px;
    }
}

.collection-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s;
    opacity: 0;

    &.loaded {
        opacity: 1;
    }
}

.details-wrapper {
    flex: 1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // background: inherit;
    background-color: rgba(0,0,0,0.7);

    @media (min-width: 1024px) {
        padding: 1.5rem;
        width: 500px;
    }
}

.collection-title {
    color: white;
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.3;

    @media (min-width: 1024px) {
        font-size: 1.25rem;
    }
}

.event-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: auto;
}

.event-count {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
}

.event-label {
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    font-size: 0.75rem;
}

.collection-icon {
    margin-left: auto;
    opacity: 0.8;
}
</style>

