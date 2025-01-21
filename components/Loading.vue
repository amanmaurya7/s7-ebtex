<script setup>
defineProps({
  fullScreen: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="loading-container" :class="{ 'full-screen': fullScreen }">
    <div class="loader">
      <div class="spinner"></div>
      <span>Loading...</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  width: 100%;
  
  &.full-screen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 9999;
    padding: 0;
  }
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #fff;
  
  span {
    font-size: 1rem;
    font-weight: 500;
  }
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid #ffffff33;
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>