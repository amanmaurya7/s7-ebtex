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

const dominantColor = ref('var(--m1-500)');
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
        dominantColor.value = `rgb(${rgb.join(',')})`;
    } catch (error) {
        console.error('Error extracting color:', error);
        dominantColor.value = 'var(--m1-500)';
    }
};

const onImageError = () => {
    imageError.value = true;
    dominantColor.value = 'var(--m1-500)';
};

const imgSrc = computed(() => {
    if (props.collection?.image_url) {
        return encodeURI(props.collection.image_url);
    }
    return '/images/default-collection.jpg';
});

const containerStyle = computed(() => {
    return {
        backgroundColor: dominantColor.value,
    };
});
</script>

<template>
    <div class="collection-container">
        <div class="collection-item p-ripple" :style="containerStyle">
            <div class="image-container">
                <img 
                    ref="collectionImage"
                    class="collection-image"
                    :class="{ 'loaded': imageLoaded }"
                    :src="imgSrc"
                    @load="onImageLoad"
                    @error="onImageError"
                />
            </div>
            <div class="collection-content">
                <div class="collection-name">
                    <h3>{{ props.collection.name }}</h3>
                </div>
                <div class="collection-event-count">
                    <Badge class="event-badge">
                        {{ props.collection.num_events }}
                    </Badge>
                    <span class="event-text">{{ $t('general.events') }}</span>
                    <img class="collection-icon" src="/images/v1.5/icon-collection.png" width="16" height="16">
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.collection-container {
    width: 100%;
    margin-bottom: 1rem;
}

.collection-item {
    display: flex;
    border-radius: 15px;
    overflow: hidden;
    background: linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.4));
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
}

.image-container {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    
    @media (min-width: 1024px) {
        width: 140px;
        height: 140px;
    }
}

.collection-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.collection-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.25rem;
    background-color: rgba(255,255,255,0.1);
}

.collection-name {
    h3 {
        color: white;
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}

.collection-event-count {
    display: flex;
    align-items: center;
    margin-top: 0.75rem;
    
    .event-badge {
       
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
    }
    
    .event-text {
        color: rgba(255,255,255,0.8);
        text-transform: uppercase;
        font-size: 0.75rem;
        margin-left: 0.5rem;
    }
    
    .collection-icon {
        margin-left: auto;
        opacity: 0.8;
    }
}
</style>

