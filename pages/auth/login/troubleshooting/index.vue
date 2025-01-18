<script setup>
import XInputText from '@/components/Common/XInputText.vue';
import GradientButton from '@/components/Common/GradientButton.vue';
import ForgetPasswordArt from '@/assets/svg/EX-Illustration-half-Password.svg';
import ChevronLeftArt from '@/assets/svg/EX-Aid-Chevron-left.svg';
import TransparentButton from '@/components/Common/TransparentButton.vue';
import * as yup from 'yup';

const { requestPasswordReset } = useApi();
const { $localePath } = useNuxtApp();

const formData = reactive({
    email: '',
});
const hasValidEmail = ref(null);
const validateEmail = (force) => {
    if (!force && formData.email === '') {
        return null;
    }

    if (!formData.email) {
        hasValidEmail.value = false;
        return;
    }

    const schema = yup.string().email().required();
    hasValidEmail.value = schema.isValidSync(formData.email);
};

const onClickResetPassword = async() => {
    validateEmail();
    if (hasValidEmail.value) {
        const { error } = await requestPasswordReset({ ...formData });
        if (!error.value) {
            navigateTo({
                path: $localePath('/auth/login/troubleshooting/success'),
                query: { email: formData.email },
            });
        }
    }
};
</script>

<template>
  <div>
    <GatewayIllustration
      :title="$t('troubleshooting.title')"
      :image="ForgetPasswordArt"
    />
    <div style="padding:1.5rem 1rem;">
      <XInputText
        v-model="formData.email"
        field-name="email"
        type="text"
        :message="hasValidEmail === false ? $t('signup.email_not_valid') : ''"
        :is-valid="hasValidEmail"
        @blur="validateEmail"
      />
    </div>
    <div style="padding:4rem 1rem 0">
      <GradientButton autofocus :style="{marginTop: '4rem'}" @click="onClickResetPassword">
        <template #content>
          {{ $t('troubleshooting.button_reset_password') }}
          <img src="/images/v1.5/icon-chevron-right.png" alt="arrow-right" width="8" class="ml-2">
        </template>
      </GradientButton>
    </div>

    <div class="auth-secondary-bottom-button gap-2 mt-4 py-4" @click="navigateTo($localePath('/auth/login'))" style="margin-top: 5rem;">
      <TransparentButton>
        <template #content>
          <img :src="ChevronLeftArt" width="12" height="12" class="tint-m3-500-filter">
          <span class="ml-2 text-m3-500">{{ $t('troubleshooting.go_back_to_sign_in') }}</span>
        </template>
      </TransparentButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>