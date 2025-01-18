<script setup>
const props = defineProps({
    radius: {
        type: Number,
        default: 8,
    },
});

const ticketStyle = computed(() => ({
    '--scoop-radius': `${props.radius}px`,
}));
</script>

<template>
  <div id="demo" class="scooped-corners" :style="ticketStyle">
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">

.scooped-corners {
    overflow: hidden;
    --scoop-radius: 20px;
    --border-width: 1px;
    --border-color: var(--m3-a20);
    --background-color: #ffffff;

    --border-stop: calc(var(--scoop-radius) + var(--border-width));

    /* 1. "scooped" out transparent radius
     2. "border" width and color
     3. "background" color
     */
    --scoop-gradient: rgba(255, 255, 255, 0) var(--scoop-radius),
        var(--border-color) calc(var(--scoop-radius) + 1px),
        var(--border-color) var(--border-stop),
        var(--background-color) calc(var(--border-stop) + 1px);


    background: var(--background-color);
    background: radial-gradient(circle at 0 0, var(--scoop-gradient)) top left,
        radial-gradient(circle at 100% 0, var(--scoop-gradient)) top right,
        radial-gradient(circle at 100% 100%, var(--scoop-gradient)) bottom right,
        radial-gradient(circle at 0 100%, var(--scoop-gradient)) bottom left;
    background-size: 50% 50%;
    background-repeat: no-repeat;

    background-image: linear-gradient(
            to bottom,
            var(--border-color) 0,
            var(--border-color) var(--border-width)
        ),
        linear-gradient(
            to left,
            var(--border-color) 0,
            var(--border-color) var(--border-width)
        ),
        linear-gradient(
            to top,
            var(--border-color) 0,
            var(--border-color) var(--border-width)
        ),
        linear-gradient(
            to right,
            var(--border-color) 0,
            var(--border-color) var(--border-width)
        ),
        radial-gradient(circle at 0 0, var(--scoop-gradient)),
        radial-gradient(circle at 100% 0, var(--scoop-gradient)),
        radial-gradient(circle at 100% 100%, var(--scoop-gradient)),
        radial-gradient(circle at 0 100%, var(--scoop-gradient)),
        linear-gradient(
            to right,
            var(--background-color) 0,
            var(--background-color) 1px
        ),
        linear-gradient(
            to right,
            var(--background-color) 0,
            var(--background-color) 1px
        );

    background-position: top center, right center, bottom center, left center,
        top left, top right, bottom right, bottom left, top center, left center;

    background-size: calc(100% - (var(--scoop-radius) + 1px) * 2)
            var(--border-width),
        var(--border-width) calc(100% - (var(--scoop-radius) + 1px) * 2),
        calc(100% - (var(--scoop-radius) + 1px) * 2) var(--border-width),
        var(--border-width) calc(100% - (var(--scoop-radius) + 1px) * 2),
        var(--border-stop) var(--border-stop),
        var(--border-stop) var(--border-stop),
        var(--border-stop) var(--border-stop),
        var(--border-stop) var(--border-stop),
        calc(100% - var(--border-stop) * 2) 100%,
        100% calc(100% - var(--border-stop) * 2);
}


</style>
