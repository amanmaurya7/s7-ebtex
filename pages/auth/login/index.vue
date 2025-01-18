<script setup>
import * as yup from 'yup';
import { useUserStore } from '@/store/user';
import { usePreferenceStore } from '@/store/preference';
import SignUpArt from '@/assets/svg/EX-Illustration-half-SignIn.svg';
import XInputText from '@/components/Common/XInputText.vue';
import ErrorMessage from '~/components/Common/ErrorMessage.vue';
import GradientButton from '@/components/Common/GradientButton.vue';
import LockArt from '@/assets/svg/EX-Aid-Password.svg';
import GatewayIllustration from '@/components/Gateway/Illustration.vue';
import TransparentButton from '@/components/Common/TransparentButton.vue';

const { signInSchema } = useYupSchema();
const { t } = useI18n();
const route = useRoute();
const userStore = useUserStore();
const { $localePath, $router } = useNuxtApp();
const { postToken } = useApi();

const hasValidEmail = ref(null);
const validateEmail = (force) => {
    if (!force && formData.email === '') {
        return null;
    }
    if (!formData.email) {
        hasValidEmail.value = false;
        return;
    }

    const schema = yup.string().email();
    hasValidEmail.value = schema.isValidSync(formData.email);
};
const hasValidPassword = ref(null);
const validatePassword = (force) => {
    if (!force && formData.email === '') {
        return null;
    }
    const schema = signInSchema.fields.password;
    hasValidPassword.value = schema.isValidSync(formData.password);
};

const { hint, redirectURL } = route.query;
const title = t(hint ?? 'login.title');
const formData = reactive({
    email: '',
    password: '',
});
const invalid = ref(false);
const errorMessage = ref('');

const onClickSubmit = async (formData) => {
    validateEmail(true);
    validatePassword(true);
    if(hasValidEmail.value === false || hasValidPassword.value === false) {
        return;
    }

    const { data, error } = await postToken({
        email: formData.email,
        password: formData.password,
    }, {
        onResponseError: () => {
            // skip common handler
        },
    });

    if (!error.value) {
        const { token } = data.value;
        await userStore.setToken(token);

        const { preferences } = usePreferenceStore();
        const locale = preferences?.locale === 'jp' ? 'ja' : preferences?.locale;
        navigateTo(redirectURL ? $localePath(redirectURL) : $localePath('/', locale));
    } else {
        invalid.value = true;
        const { statusCode } = error.value.data;
        if (statusCode === 401) {
            errorMessage.value = t('error.email_and_password_incorrect');
        }
    }
};

const onTabClick = (event) => {
    if (event.index == 1) {
        $router.push($localePath('/auth/signup'));
    }
};
</script>

<template>
  <div>
    <GatewayIllustration
      :title="title"
      :image="SignUpArt"
      style="border-bottom:none;"
    />
    <TabView class="custom-p-tabview" @tab-click="onTabClick">
      <TabPanel>
        <template #header>
          {{ $t('login.tab') }}
        </template>
        <div style="padding:1.5rem 1rem;">
          <XInputText
            v-model="formData.email"
            :field-name="$t('form.email')"
            type="text"
            :message="hasValidEmail === false ? $t('signup.email_not_valid') : ''"
            :is-valid="hasValidEmail"
            :placeholder="$t('placeholder.type_your_email')"
            @change="validateEmail"
          />
          <XInputText
            v-model="formData.password"
            :field-name="$t('form.password')"
            type="password"
            class="password-input"
            :placeholder="$t('placeholder.type_your_password')"
            :is-valid="hasValidPassword"
            :message="hasValidPassword === false ? $t('error.please_enter_password') : ''"
            @change="validatePassword"
          />
          <ErrorMessage v-if="invalid" :message="errorMessage" class="mt-4" />
          <GradientButton
            :disabled="!(hasValidEmail && hasValidPassword)"
            @click="onClickSubmit(formData)"
          >
            <template #content>
              {{ $t('login.button') }}
              <img src="/images/v1.5/icon-chevron-right.png" alt="arrow-right" width="8" class="ml-2">
            </template>
          </GradientButton>
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          {{ $t('signup.tab') }}
        </template>
      </TabPanel>
    </TabView>
    <div class="auth-secondary-bottom-button py-3">
      <TransparentButton @click="navigateTo($localePath('/auth/login/troubleshooting'))">
        <template #content>
          <img :src="LockArt" width="12" height="12" class="lock-icon tint-m3-500-filter">
          <span class="text-m3-500 ml-1">{{ $t('login.forgot_password') }}</span>
        </template>
      </TransparentButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

:deep(.p-card) {
  margin: 0 1.25rem;
}


.lock-icon {
  margin-right: 0.4rem;
  transform: rotate(270deg)
}

:deep(.password-input input) {
  color: var(--m4-500);
}
</style>
