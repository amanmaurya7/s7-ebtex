<template>
  <div class="page-footer">
    <div class="footer-content">
      <img src="/images/v1.5/logo-footer.png" alt="logo" class="footer-logo">
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
  </div>
</template>

<style lang="scss" scoped>
.page-footer {
    background-color: black;
    padding: 5px 20px;
    text-align: center;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
}

.footer-logo {
    width: 150px;
    transition: transform 0.3s ease;

    @media (min-width: 768px) {
        width: 180px;
    }
}

.slogan {
    text-transform: uppercase;
    font-weight: bold;
    color: white;
    margin: 20px 0;

    @media (min-width: 768px) {
        font-size: 1.2rem;
        margin: 30px 0;
    }
}

.bottom-text-links {
    color: white;
}

.text-link {
    font-size: 0.75rem;
    padding: 0 10px;
    transition: color 0.3s ease;

    @media (min-width: 768px) {
        font-size: 0.9rem;
        padding: 0 10px;
    }

    &:hover {
        color: #ccc;
    }
}
</style>