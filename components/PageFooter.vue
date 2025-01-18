<template>
  <div class="page-footer">
    <img src="/images/v1.5/logo-footer.png" alt="logo" width="150">
    <div class="slogan" v-html="$t('general.footer_slogan')" />
    <div class="bottom-text-links">
      <nuxt-link class="text-link" :to="localePath('about')">
        {{ $t('sidenav.about_us') }}
      </nuxt-link>
      |
      <nuxt-link class="text-link" :to="localePath('privacy')">
        {{ $t('sidenav.privacy') }}
      </nuxt-link>
      |
      <nuxt-link class="text-link" :to="localePath('terms')">
        {{ $t('sidenav.terms') }}
      </nuxt-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-footer {
    background-color: black;
    padding: 45px 0;
    text-align: center;
}

.slogan {
    text-transform: uppercase;
    font-weight: bold;
    color: white;
    margin-bottom: 15px;
}

.bottom-text-links {
    color: white;
}

.text-link {
    font-size: 0.75rem !important;

}

</style>