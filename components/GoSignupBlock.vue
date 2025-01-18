<script setup>
</script>

<template>
  <Card :pt="{ content: { class: 'flex flex-column gap-3 text-center' } }">
    <template #content>
      <p>
        {{ $t('login.signup_hint') }}
      </p>
      <Button
        rounded
        size="large"
        icon="pi pi-angle-right"
        icon-pos="right"
        :label="$t('button.go_signup')"
        class="p-button-action"
        @click="navigateTo(localePath('/auth/signup'))"
      />
      <p class="text-green-500">
        {{ $t('login.campaign_in_progress') }}
      </p>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
</style>
