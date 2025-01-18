<script setup>
import GatewayIllustration from '@/components/Gateway/Illustration.vue';
import ForgetPasswordArt from '@/assets/svg/EX-Illustration-half-Password-Reset.svg';
import XInputText from '@/components/Common/XInputText.vue';
import GradientButtonNext from '@/components/Common/GradientButtonNext.vue';
import ErrorMessage from '@/components/Common/ErrorMessage.vue';

const { t } = useI18n();
const { $localePath, $showToast } = useNuxtApp();
const { changePassword } = useApi();
const { resetPasswordSchema } = useYupSchema();
const { validateForm } = useValidateForm();
const { showToastWithRedirect } = useToastWithRedirect();
const formData = reactive({
    old_password: '',
    password: '',
    password_confirm: '',
});

const hasInvalidPassword = ref(false);
const hasInvalidPasswordConfirmation = computed(() => !!formData.password && formData.password !== formData.password_confirm);
const validatePassword = () => {
    const schema = resetPasswordSchema.fields.password;
    hasInvalidPassword.value = !schema.isValidSync(formData.password);
};

const errorMessage = ref('');
const onClickChangePassword = async () => {
    const isValid = await validateForm({
        payload: formData,
        schema: resetPasswordSchema,
    });
    if (isValid) {
        try {
            const { error } = await changePassword(formData.old_password, formData.password, {
                onResponseError: (error) => {
                    errorMessage.value = t('change_password.failed') + ' ' + (error.response?._data?.message || '');
                },
            });
            if (!error.value) {
                showToastWithRedirect(
                    'success',
                    t('change_password.success'),
                    $localePath('/profile'),
                );
            }
        } catch (error) {
            $showToast('error', t('change_password.failed'));
        }
    }
};
</script>

<template>
  <div>
    <GatewayIllustration
      :title="$t('change_password.title')"
      :image="ForgetPasswordArt"
    />
    <div style="padding: 0rem 1.5rem 1.5rem;">
      <div>
        <XInputText
          v-model="formData.old_password"
          :field-name="$t('form.old_password')"
          type="password"
        />
        <XInputText
          v-model="formData.password"
          :field-name="$t('form.new_password')"
          type="password"
          :message="hasInvalidPassword === true ? $t('error.password_not_conform_to_requirement') : ''"
          :is-valid="hasInvalidPassword === false"
          @blur="validatePassword"
        >
          <template #hint>
            <span
              style="font-size: 0.75rem !important;text-transform: uppercase;"
              v-html="$t('signup.password_length_hint')"
            />
          </template>
        </XInputText>
        <XInputText
          v-model="formData.password_confirm"
          :field-name="$t('form.password_confirm')"
          type="password"
          :message="hasInvalidPasswordConfirmation === true ? $t('error.password_do_not_match') : ''"
          :is-valid="hasInvalidPasswordConfirmation === false"
          @blur="validatePassword"
        />
      </div>
      <ErrorMessage v-if="errorMessage" :message="errorMessage" class="mt-3" />
      <GradientButtonNext
        :label="$t('form.confirm')"
        @click="onClickChangePassword"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
