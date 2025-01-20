<template>
  <div class="no-events">
    <div class="no-events-content">
      <h2>No Events Available</h2>
      <p>There are currently no events in this category.</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.no-events {
  width: 100%;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .no-events-content {
    text-align: center;
    padding: 2rem;
    
    .no-events-icon {
      width: 80px;
      margin-bottom: 1rem;
      opacity: 0.6;
    }
    
    h2 {
      color: white;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: var(--gray-500);
    }
  }
}
</style>
