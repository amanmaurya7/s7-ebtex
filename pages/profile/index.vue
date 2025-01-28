<script setup>
import TransparentButton from '@/components/Common/TransparentButton.vue';
import GradientButton from '@/components/Common/GradientButton.vue';
import OkText from '@/components/Common/OkText.vue';
import WarningText from '@/components/Common/WarningText.vue';
import WaitingText from '@/components/Common/WaitingText.vue';
import XInputText from '@/components/Common/XInputText.vue';
import useProfile from '@/composables/useProfile';
import { KYC_ELEMENT_ID } from '@/pages/constants';

definePageMeta({
    middleware: ['user-auth'],
});

const {
    prepareUser,
    userInfo,
    formData,
    previewAvatar,
    hasVerifiedIdentity,
    hasVerifiedEmail,
    isMyReferralCodeValid,
    onClickSave,
    onClickVerify,
    goEmailVerify,
    onSelectAvatar,
    copyReferralCode,
    hasPendingKYC,
    isSaving,
} = useProfile();

const focusToUserName = ref(false);
const delayBlurringUsername = () => {
    setTimeout(() => {
        focusToUserName.value = false;
    }, 500);
};

const mockPassword = ref('abcdefgh');

await prepareUser();
useKYC({ elId: KYC_ELEMENT_ID.HIDDEN });
</script>

<template>
  <!-- Wrap content in a responsive container -->
  <div class="profile-container">
    <div class="bg-m1-500">
      <div :id="KYC_ELEMENT_ID.HIDDEN" class="hidden" />
      <div class="text-white uppercase font-bold font-1375 text-center mb-2" v-html="$t('profile.page_title')" />

      <div class="flex justify-content-center align-items-center mt-4 mb-2">
        <div class="image-circle">
          <img v-if="previewAvatar" :src="previewAvatar">
          <img v-else-if="formData.avatar" :src="formData.avatar">
          <input
            id="image-from-library"
            ref="image-from-library"
            type="file"
            accept="image/*"
            class="hidden"
            @input="onSelectAvatar"
          >
          <input
            id="image-from-camera"
            ref="image-from-camera"
            type="file"
            capture="environment"
            accept="image/*"
            class="hidden"
            @input="onSelectAvatar"
          >
        </div>
      </div>

      <div class="flex justify-content-center align-items-center gap-2 mx-3 mt-4">
        <TransparentButton @click="$refs['image-from-library'].click()">
          <template #content>
            <img src="/images/v1.5/icon-photo.png" alt="select photo" :width="20" :height="17" class="mr-2">
            {{ $t('button.choose_from_the_library') }}
          </template>
        </TransparentButton>
        <TransparentButton @click="$refs['image-from-camera'].click()">
          <template #content>
            <img src="/images/v1.5/icon-cam.png" alt="take a photo" :width="20" :height="17" class="mr-2">
            {{ $t('button.take_a_photo') }}
          </template>
        </TransparentButton>
      </div>

      <div class="mx-3 mb-3">
        <XInputText
          v-model="formData.display_name"
          :field-name="$t('form.display_name')"
          type="text"
          tint="--k1-500"
          class="text-center bg-transparent text-white"
          :label="$t('form.display_name')"
          @focus="focusToUserName = true"
          @blur="delayBlurringUsername"
        />

        <GradientButton v-if="formData.avatar?.has || focusToUserName" tint="yellow" :loading="isSaving" class="mt-2 small-button" @click="onClickSave">
          <template #content>
            <img src="/images/v1.5/icon-save.png" alt="save" width="20" class="mr-3">
            <span class="font-9375">{{ $t('button.save_settings') }}</span>
          </template>
        </GradientButton>
      </div>

      <div class="mt-4 bg-w2-500 pt-250">
        <div
          class="text-center font-bold font-1375 uppercase mb-4"
          v-html="$t('profile.header.my_credentials')"
        />

        <!-- Phone -->
        <div class="bg-white px-3 pb-3 bt-m3-a20">
          <XInputText
            v-model="userInfo.phone"
            type="text"
            disabled
            :field-name="$t('form.phone')"
            class="disabled-x-input-text"
          >
            <template #hint>
              <OkText :message="$t('general.verified')" />
            </template>
          </XInputText>
        </div>

        <!-- Email -->
        <div class="bg-white px-3 pb-3 bt-m3-a20">
          <XInputText
            v-model="userInfo.email"
            type="text"
            disabled
            :field-name="$t('form.email')"
            class="disabled-x-input-text"
          >
            <template #hint>
              <OkText v-if="hasVerifiedEmail" :message="$t('general.verified')" />
              <WarningText v-else :warning-wording="$t('general.unverified')" />
            </template>
          </XInputText>
          <div v-if="!hasVerifiedEmail">
            <GradientButton
              class="mt-1"
              tint="yellow"
              @click="goEmailVerify"
            >
              <template #content>
                <img src="/images/v1.5/icon-mail.png" alt="email" :width="20" :height="17" class="mr-3">
                {{ $t('button.go_verify_email') }}
              </template>
            </GradientButton>
            <div class="text-center font-75 mt-3" v-html="$t('profile.email_verification_hint')" />
          </div>
        </div>

        <!-- Password -->
        <div class="bg-white px-3 pb-3 bt-m3-a20">
          <XInputText
            v-model="mockPassword"
            type="password"
            :toggle-mask="false"
            disabled
            :field-name="$t('form.password')"
            class="disabled-x-input-text"
          />
          <div>
            <GradientButton
              class="mt-1"
              tint="yellow"
              @click="navigateTo(localePath('/profile/change-password'))"
            >
              <template #content>
                <img src="/images/v1.5/icon-password.png" alt="password" :width="20" :height="17" class="mr-3">
                {{ $t('button.go_change_password') }}
              </template>
            </GradientButton>
          </div>
        </div>
      </div>

      <!-- Identity -->
      <!-- <div class="bg-white px-3 pt-4 pb-4 bt-m3-a20 bb-m3-a20">
        <div class="flex justify-content-between">
          <div class="font-bold">
            {{ $t('profile.identity') }}
          </div>
          <WaitingText v-if="hasPendingKYC" :message="$t('general.verifying_identity')" />
          <OkText v-else-if="hasVerifiedIdentity" :message="$t('general.verified')" />
          <WarningText v-else :warning-wording="$t('general.unverified')" />
        </div>
        <div v-if="hasPendingKYC" class="font-75 mt-3">
          {{ $t('profile.identity_verification_hint_pending') }}
        </div>
        <div v-if="(!hasVerifiedIdentity && !hasPendingKYC) || userInfo?.redo_kyc">
          <GradientButton class="mt-3" tint="yellow" @click="onClickVerify">
            <template #content>
              <img src="/images/v1.5/icon-id.png" alt="email" :width="20" :height="17" class="mr-3">
              {{ $t((userInfo?.redo_kyc) ? 'button.redo_kyc_verification' : 'button.verify_id') }}
            </template>
          </GradientButton>
          <div class="text-center font-75 mt-3" v-html="$t('profile.identity_verification_hint')" />
        </div>
      </div> -->

      <!-- Referral Code -->
      <!-- Identity -->
      <div class="bg-white px-3 pt-4 pb-4 bt-m3-a20 bb-m3-a20">
        <div class="font-bold">
          {{ $t('profile.header.referral_code') }}
        </div>
        <div v-if="isMyReferralCodeValid" class="py-3">
          <div>
            <div class="font-bold font-125 text-k1-500">{{ userInfo.referral_code }}</div>
            <div class="text-xs text-gray-600">
              <p v-if="userInfo.referral_code_expires_at">
                {{ $t('profile.expiration_date', { date:
                  $filters.formatDate(userInfo.referral_code_expires_at, locale === 'ja' ? 'YYYY年MM月DD日' : 'YYYY/MM/DD')
                }) }}
              </p>
              <p>
                {{ $t('profile.remaining_usage_count', { count: userInfo.referral_code_quota || 0 }) }}
              </p>
            </div>
          </div>
          <GradientButton
            tint="yellow"
            @click="copyReferralCode"
          >
            <template #content>
              {{ $t('button.copy_referral_code') }}
            </template>
          </GradientButton>
        </div>
        <div v-else class="font-75 mt-3">
          {{ $t('profile.no_referral_code_yet') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.p-panel) {
  margin: 0 1.25rem;
}

.user-profile-form {
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

:deep(.form-group) {
  display: flex;
  flex-direction: column;
  gap: .75rem;
}

.image-circle {
  width: 200px;
  aspect-ratio: 1;
  background-color: var(--m1-500);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--m5-500);
  box-shadow: 0 0 2px 1px var(--m5-500);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.avatar-container {
  position: relative;

  &:hover {
    .btn-delete-avatar {
      display: inline-flex;
    }
  }

  .btn-delete-avatar {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(40%, -40%);
    display: none;
  }
}

.disabled-x-input-text {
  :deep(input) {
    margin-top: .75rem;
    border: 1px solid var(--m3-a20);
    color: var(--text-color-a20);
  }
  padding-bottom: .75rem;
}
    
@media (min-width: 1024px) {
  .profile-container {
    max-width: 60%;
    margin: 0 auto;
  }
  .image-circle {
    width: 300px;
    height: 300px;
  }
}
</style>
