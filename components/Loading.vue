<template>
  <div class="wrapper">
    <div>
      <img src="/images/v1.5/logo-top.png" alt="logo" width="42">
    </div>
    <div class="py-2">
      {{ $t('general.loading') }}
    </div>
  </div>
</template>

<style scoped>

.wrapper {
    text-align: center;
    padding: 2rem;
    font-size: 0.8rem;
}

img {
    animation: scale 0.5s infinite alternate;
}

@keyframes scale {
    0% {
        transform: scale(1);
    }
    100% {
        transform: scale(1.2);
    }
}

</style>