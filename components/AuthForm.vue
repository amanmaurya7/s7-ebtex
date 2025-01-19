<script setup>
import * as yup from 'yup';

const props = defineProps({
    variant: { type: String, required: true, default: 'login' },
    formData: { type: Object, required: true, default: () => ({ email: '', password: '' }) },
    invalid: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
});

const emits = defineEmits(['onSubmit']);

const { t } = useI18n();
const { signInSchema, signUpSchema } = useYupSchema();
const { validateForm } = useValidateForm();
const isSignup = computed(() => props.variant === 'signup');
const actionButtonLabel = computed(() => props.variant === 'signup' ? t('button.proceed') : t('button.login'));

const formData = reactive({
    email: props.formData?.email ?? '',
    password: props.formData?.password ?? '',
    password_confirm: '',
    referral_code: props.formData?.referral_code ?? '',
});

const hasInvalidEmail = ref(false);
const validateEmail = () => {
    const schema = yup.string().email();
    hasInvalidEmail.value = !schema.isValidSync(formData.email);
};

const hasInvalidPassword = ref(false);
const hasInvalidPasswordConfirmation = computed(() => !!formData.password && formData.password !== formData.password_confirm);
const validatePassword = () => {
    const schema = isSignup.value ? signUpSchema.fields.password : signInSchema.fields.password;
    hasInvalidPassword.value = !schema.isValidSync(formData.password);
};

const onClickSubmit = async () => {
    const isValid = await validateForm({
        payload: formData,
        schema: isSignup.value ? signUpSchema : signInSchema,
    });

    if (isValid) {
        const requestData = { ...formData };
        delete requestData.password_confirm;
        emits('onSubmit', requestData);
    }
};
</script>

<template>
  <div class="auth-form">
    <Card :pt="{ content: { class: 'form-group' } }">
      <template #content>
        <div v-if="isSignup" class="required-hint">
          {{ $t('signup.required_hint') }}
        </div>

        <div class="input-group">
          <label for="email" :class="{'required': isSignup}">{{ $t('form.email_address') }}</label>
          <InputText
            id="email"
            v-model="formData.email"
            type="email"
            class="w-full"
            :class="{'p-invalid': invalid || hasInvalidEmail}"
            @blur="validateEmail"
          />
          <p v-if="hasInvalidEmail" class="error-hint">
            {{ $t('signup.email_not_valid') }}
          </p>
        </div>

        <div class="input-group">
          <div class="flex justify-content-between align-items-end">
            <label for="password" :class="{'required': isSignup}">
              {{ $t('form.password') }}
            </label>
            <span v-if="isSignup" class="text-xs">{{ $t('signup.password_length_hint') }}</span>
          </div>
          <Password
            v-model="formData.password"
            input-id="password"
            toggle-mask
            :feedback="false"
            :input-class="['w-full', {'p-invalid': invalid || hasInvalidPassword}]"
            @blur="validatePassword"
          />
          <p v-if="hasInvalidPassword" class="error-hint">
            {{ $t('error.password_not_conform_to_requirement') }}
          </p>
        </div>
          
        <template v-if="isSignup">
          <div class="font-bold text-gray-500 text-xs text-center px-2 white-space-pre-wrap">
            {{ $t('signup.password_content_hint') }}
          </div>

          <div class="input-group">
            <label for="passwordConfirm" :class="{'required': isSignup}">
              {{ $t('form.password_confirm') }}
            </label>
            <Password
              v-model="formData.password_confirm"
              input-id="passwordConfirm"
              toggle-mask
              :feedback="false"
              :input-class="['w-full', {'p-invalid': hasInvalidPasswordConfirmation}]"
            />
            <p v-if="hasInvalidPasswordConfirmation" class="error-hint">
              {{ $t('error.password_do_not_match') }}
            </p>
          </div>

          <div class="input-group">
            <label for="referralCode">{{ $t('form.referral_code') }}</label>
            <InputText id="referralCode" v-model="formData.referral_code" type="text" />
          </div>
        </template>

        <div v-if="invalid" class="text-red-500 text-xs line-height-4 text-center">
          {{ errorMessage }}
        </div>

        <Button
          rounded
          size="large"
          :icon="isSignup ? 'pi pi-angle-right': null"
          icon-pos="right"
          :label="actionButtonLabel"
          class="p-button-action"
          @click="onClickSubmit"
        />

        <Button
          v-if="!isSignup"
          rounded
          size="large"
          icon="pi pi-angle-right"
          icon-pos="right"
          :label="$t('button.forget_password')"
          class="p-button-action"
          @click="navigateTo(localePath('/auth/login/troubleshooting'))"
        />
      </template>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.auth-form {
  max-width: 480px;
  margin: 0 auto;
  padding: 0 1rem;
}

:deep(.form-group) {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  padding-top: 1.5rem;

  @media (min-width: 768px) {
    gap: 2rem;
    padding: 2rem 1.5rem;
  }
}

.input-group {
  @media (min-width: 768px) {
    margin-bottom: 0.5rem;
    
    label {
      margin-bottom: 0.75rem;
      display: block;
    }
  }
}

.required-hint {
  color: var(--red-500);
  position: absolute;
  top: .25rem;
  right: 0;
  font-size: 0.875rem;

  @media (min-width: 768px) {
    top: 1rem;
    right: 1.5rem;
  }
}

:deep(.p-button) {
  @media (min-width: 768px) {
    max-width: 320px;
    margin: 0 auto;
    display: block;
  }
}
</style>
