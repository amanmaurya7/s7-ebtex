<script setup>
import GatewayIllustration from '@/components/Gateway/Illustration';
import ForgetPasswordArt from '@/assets/svg/EX-Illustration-half-Password-Reset.svg';
import XInputText from '~/components/Common/XInputText.vue';
import GradientButton from '~/components/Common/GradientButton.vue';
import ErrorMessage from '~/components/Common/ErrorMessage.vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

definePageMeta({
    middleware: [
        function () {
            const { $localePath, $router } = useNuxtApp();
            const { token } = useRoute().query;
            if (!token) {
                $router.replace($localePath({ name: 'auth-login' }));
            }
        },
    ],
});

const { t } = useI18n();
const { $localePath } = useNuxtApp();
const { reallyResetPassword, postToken } = useApi();
const { resetPasswordSchema } = useYupSchema();
const { validateForm } = useValidateForm();
const router = useRouter();
const formData = reactive({
    password: '',
    password_confirm: '',
});

const hasInvalidPassword = ref(false);
const hasInvalidPasswordConfirmation = computed(() => !!formData.password && formData.password !== formData.password_confirm);
const validatePassword = () => {
    const schema = resetPasswordSchema.fields.password;
    hasInvalidPassword.value = !schema.isValidSync(formData.password);
};

const errorMessage = ref(null);
const onClickResetPassword = async () => {
    errorMessage.value = null;
    const isValid = await validateForm({
        payload: formData,
        schema: resetPasswordSchema,
    });

    if (isValid) {
        try {
            const { error } = await reallyResetPassword(
                router.currentRoute.value.query.email,
                router.currentRoute.value.query.token,
                formData.password,
                {
                    onResponseError: (error) => {
                        errorMessage.value = error.response?._data?.message || t('error.fail_to_reset');
                    },
                },
            );

            if (!error.value) {
                // auto login
                const { error: loginError, data } = await postToken({
                    email: router.currentRoute.value.query.email,
                    password: formData.password,
                }, {
                    onResponseError: () => {
                        // skip common handler
                    },
                });

                if (loginError.value) {
                    errorMessage.value = t('error.fail_to_reset');
                } else {
                    const { token } = data.value;
                    await userStore.setToken(token);
                    navigateTo({
                        path: $localePath('/auth/login/troubleshooting/welcome'),
                        query: { message: t('troubleshooting.reset_password_complete') },
                    });
                }
            }
        } catch (error) {
            errorMessage.value = t('error.fail_to_reset');
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
    <div style="padding: 0rem 1.5rem 1.5rem;">
      <div>
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
      <ErrorMessage v-if="errorMessage" :message="errorMessage" />
      <GradientButton @click="onClickResetPassword">
        <template #content>
          <div class="flex gap-2 align-items-center">
            <span style="font-size:0.9375rem !important;">
              {{ $t('button.reset_password') }}
            </span>
            <img src="/images/v1.5/icon-chevron-right.png" alt="deposit" widh="10" height="12">
          </div>
        </template>
      </GradientButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.p-card) {
  margin: 0 1.25rem;
}

:deep(.form-group) {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>
