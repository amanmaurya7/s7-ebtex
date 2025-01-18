<script setup>

import { NEW_NOTIFICATION_ICONS } from '@/assets/svg';

const getNotificationIcon = (contentStyleClass) => {
    const iconClassMatch = contentStyleClass?.match(/--ICON--(\w+)/);
    if(iconClassMatch) {
        return NEW_NOTIFICATION_ICONS[iconClassMatch[1]];
    }
    return null;
};


</script>

<template>
  <Toast
    position="top-center"
    :unstyled="true"
    :pt="{
      root: { class: 'toast', style: { bottom: '74px'}},
      content: { class: 'toast-content'},
      buttonContainer: { class: 'hidden' }
    }"
  >
    <template #container="{ message }">
      <div
        class="toast-container"
        :class="Object.assign({
          'green': message.severity === 'success' || message.severity === 'info',
          'yellow': message.severity !== 'success' && message.severity !== 'info',
          'has-tick': message.contentStyleClass.split(' ').indexOf('is-notification') >= 0,
        }, ...(message.contentStyleClass || '').split(' ').map(key => ({ [key]: true})))"
      >
        <div class="message text-right">
          {{ message.summary }}
        </div>
        <div v-if="getNotificationIcon(message.contentStyleClass)" class="icon ml-2">
          <img :src="getNotificationIcon(message.contentStyleClass)">
        </div>
      </div>
    </template>
  </Toast>
</template>

<style lang="scss" scoped>

.toast-container {
  display: flex;
  align-items: center;
  justify-content: end;
  position: fixed;
  left: 0;
  right: 0;
  top: 60px;
  color: white;
  font-weight: bold;
  font-size: .75rem;
  padding: .5rem 1.25rem;
  &.green {
    background: var(--m4-500);

    &::after {
      background: var(--m4-500);
    }
  }
  &.yellow {
    background: var(--k1-500);
    &::after {
      background: var(--k1-500);
    }
  }

  &.has-tick::after {
    display: block;
    content: '';
    width: 15px;
    height: 15px;
    position: absolute;
    transform: rotate(45deg);
    right: 30px;
    top: -6px;
    z-index: -2;
  }

  .icon img {
    max-width: 20px;
    max-height: 20px;
    object-fit: contain;
  }
}

</style>
