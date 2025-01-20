import pkg from './package.json';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    runtimeConfig: {
        public: {
            baseURL: process.env.API_ENDPOINT,
            clientVersion: pkg.version,
            myaffiliateQueryName: process.env.MYAFFILIATE_QUERY_NAME || 'referral',
            onrampXApiKey: process.env.ONRAMP_X_API_KEY || 'zfKDYAvEywegH2R829bZV2IH26wv2WTj3G74xoVE',
            onrampCryptoFrameUrl: process.env.ONRAMP_CRYPTO_FRAME_URL || 'https://stage-crypto-iframe.onramp.ltd',
            skipKYC: process.env.SKIP_KYC === 'true',
            disabledCC: process.env.DISABLED_CC === 'true',
        },
    },

    ssr: false,
    devtools: { enabled: true },

    build: {
        transpile: ['primevue'],
    },

    css: [
        'primeicons/primeicons.css',
    ],

    modules: [
        'nuxt-icon',
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        'nuxt-lodash',
        '@pinia-plugin-persistedstate/nuxt',
        '@nuxtjs/google-fonts',
        '@zadigetvoltaire/nuxt-gtm',
        '@nuxtjs/sitemap',
        '@nuxtjs/robots',
    ],

    i18n: {
        vueI18n: './i18n.config.ts',
        locales: [
            { code: 'en', name: 'ENGLISH' },
            { code: 'ja', name: '日本語' },
        ],
        strategy: 'prefix_and_default',
        defaultLocale: 'en',
        detectBrowserLanguage: {
            useCookie: true,
            fallbackLocale: 'en',
            redirectOn: 'no prefix',
        },
    },

    pinia: {
        autoImports: [
            'defineStore', // import { defineStore } from 'pinia'
        ],
    },

    app: {
        head: {
            script: [
                {
                    src: 'https://www.chatbase.co/embed.min.js',
                    chatbotId: 'Ix9bqFBNFqDGbJ2e-Uf0K',
                    domain: 'www.chatbase.co',
                    defer: true,
                },
            ],
        },
    },

    googleFonts: {
        families: {
            Montserrat: '100..900',
        },
    },

    gtm: {
        id: process.env.GTM_ID || '',
        defer: false,
        compatibility: false,
        enabled: true,
        debug: process.env.NODE_ENV === 'development',
        loadScript: true,
        enableRouterSync: true,
        ignoredViews: [],
        trackOnNextTick: false,
        devtools: true,
    },

    compatibilityDate: '2024-08-11',
});