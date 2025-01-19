<script setup>
import * as yup from 'yup';
import { KYC_ELEMENT_ID } from '@/pages/constants';
import { MY_AFFILIATE_CACHE_KEY  } from '@/pages/constants';
import { useUserStore } from '@/store/user';
import { useApi } from '@/composables/useApi';
import SignUpArt from '@/assets/svg/EX-Illustration-half-SignUp.svg';
import XInputText from '@/components/Common/XInputText.vue';
import XInputPhoneNumber from '@/components/Common/XInputPhoneNumber.vue';
import GradientButton from '@/components/Common/GradientButton.vue';
import { storeToRefs } from 'pinia';
import usePhoneVerificationKYC from '@/composables/usePhoneVerificationKYC';
import XInputCountryCode from '@/components/Common/XInputCountryCode.vue';

const { createPhoneVerificationKyc, validateRegistrationForm } = useApi();

const { $localePath, $router } = useNuxtApp();
const { t } = useI18n();
const { postRegister, getSitePage } = useApi();
const userStore = useUserStore();
const { signupForm } = storeToRefs(userStore);
const { signUpSchema } = useYupSchema();
const activeIndex = ref(0);
const termsChecked = ref(false);
const validationErrors = ref({
    display_name: null,
    email: null,
    password: null,
    password_confirm: null,
    phone: null,
    country: null,
});
signupForm.value.progress = 0;

watch(activeIndex, (newValue) => {
    if (newValue === 0) {
        signupForm.value.progress = 0;
    } else if (newValue === 1) {
        signupForm.value.progress = 50;
    } else if (newValue === 2) {
        signupForm.value.progress = 75;
        setTimeout(() => {
            const { launchWebSdk } = usePhoneVerificationKYC({
                elId: KYC_ELEMENT_ID.PHONE_VERIFICATION,
                kycToken: phoneVerificationToken.value,
                onVerified: onPhoneNumberVerified,
            });
            launchWebSdk(phoneVerificationToken.value, signupForm.value.phone);
        }, 100);
    }
});

const validateForm = async () => {
    // frontend form validation
    validationErrors.value = {};
    try {
        const validationPayload = {
            ...signupForm.value,
            phone: signupForm.value.phone.replace(/^\+*[0-9]+-/, ''),
        };
        await signUpSchema.validate(validationPayload, { abortEarly: false });
    } catch (err) {
        err.inner.forEach((error) => {
            validationErrors.value[error.path] = error.message;
        });
        return false;
    }

    // backend data validation
    try {
        const validationResult = await validateRegistrationForm({
            email: signupForm.value.email,
            display_name: signupForm.value.display_name,
            phone: signupForm.value.phone,
        });

        if (validationResult) {
            let hasRegisteredField = false;
            for (const key of Object.keys(validationResult)) {
                validationErrors.value[key] = null;
                if (validationResult[key] === 'registered') {
                    validationErrors.value[key] = t(`form.${key}_already_registered`);
                    hasRegisteredField = true;
                }
            }
            if (hasRegisteredField) {
                return false;
            }
        }
        return true;
    } catch (err) {
        return false;
    }
};

const validateField = async (field) => {
    try {
        await signUpSchema.validateAt(field, signupForm.value);
        validationErrors.value[field] = null;
    } catch (err) {
        validationErrors.value[field] = err.message;
    }
};

const displayNameInput = ref(null);
const phoneNumberInput = ref(null);
const emailInput = ref(null);
const passwordInput = ref(null);
const passwordConfirmInput = ref(null);
const referralCodeInput = ref(null);
const countryInput = ref(null);
watch(validationErrors, (newValue) => {
    if (newValue) {
        const fieldRefMap = [
            { field: 'display_name', ref: displayNameInput },
            { field: 'phone', ref: phoneNumberInput },
            { field: 'email', ref: emailInput }, 
            { field: 'password', ref: passwordInput },
            { field: 'password_confirm', ref: passwordConfirmInput },
            { field: 'country', ref: countryInput },
            { field: 'referral_code', ref: referralCodeInput }
        ];

        for (const item of fieldRefMap) {
            if (item.ref.value && validationErrors.value[item.field]) {
                item.ref.value.$el.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
                return;
            }
        }
    }
}, { deep: true });

const onClickSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
        if (activeIndex.value == 0) {
            activeIndex.value += 1;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (activeIndex.value == 1) {
            await onClickCreateAccount();
        }
    }
};

const onFieldBlur = async (field) => {
    if (validationErrors.value[field] !== null || signupForm.value[field]) {
        await validateField(field);
    }
};

watch(() => signupForm.value.country, (newValue) => {
    onFieldBlur('country');
}, { immediate: true });

const phoneVerificationToken = ref(null);
const phoneVerificationExternalUserId = ref(null);
const invokePhoneVerification = async () => {
    const { data, error } = await createPhoneVerificationKyc();
    if (error.value) {
        console.error(error.value);
    } else {
        phoneVerificationToken.value = data.value?.token;
        phoneVerificationExternalUserId.value = data.value?.external_user_id;
        const runtimeConfig = useRuntimeConfig();
        if (runtimeConfig.public.skipKYC) {
            signupForm.value.external_user_id = phoneVerificationExternalUserId.value;
            await onClickCreateAccount();
        } else {
            activeIndex.value = 2;
        }
    }
};

const onClickCreateAccount = async () => {
    if (!signupForm.value.external_user_id) {
        invokePhoneVerification();
        return;
    }
    const myaffiliateID = window.localStorage.getItem(MY_AFFILIATE_CACHE_KEY);
    const payload = { 
        ...signupForm.value,
        country: signupForm.value.country,
    };
    if (myaffiliateID) {
        payload['myaffiliate_id'] = myaffiliateID;
    }
    delete payload.password_confirm;
    delete payload.progress;
    activeIndex.value = 3;
    const { data, error } = await postRegister(payload);
    if (!error.value) {
        window.localStorage.setItem(MY_AFFILIATE_CACHE_KEY, null);
        const { token } = data.value;
        await userStore.setToken(token);
        navigateTo(
            $localePath({
                name: 'auth-signup-success',
                query: {
                    email: encodeURIComponent(payload.email),
                },
            }),
        );
    } else {
        activeIndex.value = 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const [
    { data: terms },
] = await Promise.all([
    getSitePage('terms'),
]);

const onTabClick = (event) => {
    if (event.index == 0) {
        $router.push($localePath('/auth/login'));
    }
};

const hasValidEmail = computed(() => {
    const schema = yup.string().email();
    return schema.isValidSync(signupForm.email);
});
const hasValidPassword = computed(() => {
    return !!signupForm.value.password;
});
const hasValidUsername = computed(() => {
    return !!signupForm.value.display_name;
});
const isProceedDisabled = computed(() => {
    return !hasValidEmail.value
        || !hasValidUsername.value
        || !hasValidPassword.value
        || !hasValidUsername.value
        || (activeIndex.value === 1 && !termsChecked.value)
        || (activeIndex.value === 2);
});

const onPhoneNumberChange = (value) => {
    signupForm.value.phone = value;
};

const onPhoneNumberVerified = () => {
    signupForm.value.external_user_id = phoneVerificationExternalUserId.value;
    onClickCreateAccount();
};

</script>

<template>
  <div>
    <GatewayIllustration
      :title="$t('signup.title')"
      :image="SignUpArt"
      style="border-bottom:none;"
    />
    <div v-if="activeIndex == 0">
      <TabView class="custom-p-tabview" :active-index="1" @tab-click="onTabClick">
        <TabPanel>
          <template #header>
            {{ $t('login.tab') }}
          </template>
        </TabPanel>
        <TabPanel>
          <template #header>
            {{ $t('signup.tab') }}
          </template>
          <div style="padding:1.5rem 1rem;">
            <XInputText
              ref="displayNameInput"
              v-model="signupForm.display_name"
              :field-name="$t('form.display_name')"
              :placeholder="$t('placeholder.type_your_username')"
              type="text"
              :message="validationErrors.display_name"
              :is-valid="!validationErrors.display_name"
              @blur="onFieldBlur('display_name')"
            />
            <XInputPhoneNumber
              ref="phoneNumberInput"
              :value="signupForm.phone"
              :is-valid="!validationErrors.phone"
              :message="validationErrors.phone"
              :field-name="$t('form.phone_number')"
              :placeholder="$t('placeholder.type_your_phone_number')"
              @change="onPhoneNumberChange"
              @blur="onFieldBlur('phone')"
            />
            <XInputText
              ref="emailInput"
              v-model="signupForm.email"
              :field-name="$t('form.email')"
              type="text"
              :placeholder="$t('placeholder.type_your_email')"
              :message="validationErrors.email"
              :is-valid="!validationErrors.email"
              @blur="onFieldBlur('email')"
            />
            <XInputText
              ref="passwordInput"
              v-model="signupForm.password"
              class="password-input"
              :field-name="$t('form.password')"
              type="password"
              :placeholder="$t('placeholder.type_your_password')"
              :is-valid="!validationErrors.password"
              :message="validationErrors.password"
              :bubble-message="$t('signup.password_content_hint')"
              @blur="onFieldBlur('password')"
            >
              <template #hint>
                <div
                  class="text-right"
                  style="font-size: 0.75rem !important;text-transform: uppercase;"
                  v-html="$t('signup.password_length_hint')"
                />
              </template>
            </XInputText>
            <XInputText
              ref="passwordConfirmInput"
              v-model="signupForm.password_confirm"
              :field-name="$t('form.password_confirm')"
              type="password"
              :placeholder="$t('placeholder.type_your_password_again')"
              :is-valid="!validationErrors.password_confirm"
              :message="validationErrors.password_confirm"
              @blur="onFieldBlur('password_confirm')"
            />
            <XInputText
              ref="referralCodeInput"
              v-model="signupForm.referral_code"
              :message="$t('form.optional')"
              :field-name="$t('form.referral_code')"
              type="text"
              :placeholder="$t('placeholder.type_your_referral_code')"
            />
            <XInputCountryCode
              ref="countryInput"
              :is-valid="!!signupForm.country"
              :message="validationErrors.country"
              v-model="signupForm.country"
              :field-name="$t('form.country')"
              :placeholder="$t('placeholder.select_your_country')"
            />
          </div>
        </TabPanel>
      </TabView>
    </div>
    <div v-else-if="activeIndex == 1">
      <div class="terms-section">
        <div class="terms-content tint-scrollbar" v-html="terms.html" />
        <div class="mt-4 gap-3 flex px-2">
          <Checkbox ref="termsCheckbox" v-model="termsChecked" :binary="true" />
          <label style="font-size: 0.9375rem;" @click="termsChecked = !termsChecked"><b>{{ $t('signup.i_have_read_and_agree') }}</b></label>
        </div>
      </div>
    </div>
    <div v-else-if="activeIndex == 2">
      <div :id="KYC_ELEMENT_ID.PHONE_VERIFICATION" class="bg-white" />
    </div>
    <div v-else-if="activeIndex == 3">
      <Loading />
    </div>
    <div v-if="activeIndex < 2" class="text-center px-3 mb-4">
      <GradientButton
        :disabled="isProceedDisabled"
        @click="onClickSubmit"
      >
        <template #content>
          {{ $t('button.proceed') }}
          <img src="/images/v1.5/icon-chevron-right.png" alt="arrow-right" width="8" class="ml-2" :class="{'tint-m4-500-filter': isProceedDisabled}">
        </template>
      </GradientButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.custom-p-tabview {
  max-width: 768px;
  margin: 0 auto;
}

:deep(.p-card), section {
  margin: 0 1.25rem;
  
  @media (min-width: 768px) {
    margin: 0 auto;
    max-width: 640px;
  }
}

.terms-section {
  padding: 1.5rem 1rem 0;
  max-width: 768px;
  margin: 0 auto;

  @media (min-width: 768px) {
    padding: 2rem;
  }

  .terms-content {
    padding: 2rem 1.5rem;
    border: 1px solid var(--m3-a20);
    border-radius: 0.5rem;
    max-height: 45vh;
    overflow-y: auto;

    @media (min-width: 768px) {
      max-height: 60vh;
      padding: 2.5rem;
    }
  }
}

:deep(.password-input .bubble) {
  margin-left: -1rem;
  margin-right: -1rem;

  @media (min-width: 768px) {
    margin-left: 0;
    margin-right: 0;
    max-width: 480px;
  }
}

.text-center {
  @media (min-width: 768px) {
    margin-top: 2rem;
  }
}
</style>
