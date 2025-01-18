import { useHttp } from './useHttp';

export const useApi = () => {
    return {
        getEvents: (params, options) => {
            return useHttp().get('/events', params, options);
        },
        getEventDetail: (eventId, params, options) => {
            return useHttp().get(`/events/${eventId}`, params, options);
        },
        getSearchEvents: (params, options) => {
            return useHttp().get('/search-events', params, options);
        },
        getRelatedEvents: (eventId, params, options) => {
            return useHttp().get(`/events/${eventId}/related-events`, params, options);
        },
        getLayoutParameters: (params, options) => {
            return useHttp().get('/layout', params, options);
        },
        getCollection: (slug, params, options) => {
            return useHttp().get(`/collections/${slug}`, params, options);
        },
        getCollections: (params, options) => {
            return useHttp().get('/collections', params, options);
        },
        getCategories: (params, options) => {
            return useHttp().get('/categories', params, options);
        },
        getCategoryDetail: (categorySlug, params, options) => {
            return useHttp().get(`/categories/${categorySlug}`, params, options);
        },
        getTag: (slug, params, options) => {
            return useHttp().get(`/tags/${slug}`, params, options);
        },
        getTags: (params, options) => {
            return useHttp().get('/tags', params, options);
        },
        getEventRecentWagers: (eventId, params, options) => {
            return useHttp().get(`/events/${eventId}/recent-wagers`, params, options);
        },
        getEventBoxPlot: (eventId, params, options) => {
            return useHttp().get(`/events/${eventId}/box-plot`, params, options);
        },
        getEventMarketHistory(eventId, params, options) {
            const url = `/events/${eventId}/history`;
            return useHttp().get(url, params, options);
        },
        getOutcomeHistory: async (eventId, outcomeId, params, options) => {
            const url = `/events/${eventId}/outcomes/${outcomeId}/history`;
            return useHttp().get(url, params, options);
        },
        getOutcomeRecentWagers: (eventId, outcomeId, params, options) => {
            return useHttp().get(`/events/${eventId}/outcomes/${outcomeId}/recent-wagers`, params, options);
        },
        getOutcomeWagersByProbability: (eventId, outcomeId, params, options) => {
            return useHttp().get(`/events/${eventId}/outcomes/${outcomeId}/wagers-by-probability`, params, options);
        },
        postQuote: (formData, options) => {
            return useHttp().post('/quotes', formData, options);
        },
        postWager: (formData, options) => {
            return useHttp().post('/wagers', formData, options);
        },
        getDashboard: (params, options) => {
            return useHttp().get('/dashboard', params, options);
        },
        getDashboardChartData: async (chartName, params, options) => {
            return useHttp().get(`/dashboard/${chartName}`, params, options);
        },
        getDashboardWagerPosition: (params, options) => {
            return useHttp().get('/dashboard/wager-positions', params, options);
        },
        getDashboardEventWagerPositions: (params, options) => {
            return useHttp().get('/dashboard/wager-position-events', params, options);
        },
        getWallets: (params, options) => {
            return useHttp().get('/wallets', params, options);
        },
        getMe: (params, options) => {
            return useHttp().get('/me', params, options);
        },
        createPhoneVerificationKyc: (params, options) => {
            return useHttp().post('/phone-verification', params, options);
        },
        getKYC: (options) => {
            return useHttp().get('/kyc', {}, options);
        },
        getSitePage: (code, params, options) => {
            return useHttp().get(`/pages/${code}`, params, options);
        },
        getFaqs: (params, options) => {
            return useHttp().get('/faqs', params, options);
        },
        postToken: (formData, options) => {
            return useHttp().post('/tokens', formData, options);
        },
        validateRegistrationForm: (formData, options) => {
            return useHttp().postSingle('/register-validations', formData, options);
        },
        postRegister: (formData, options) => {
            return useHttp().post('/register', formData, options);
        },
        updateProfile: (formData, options) => {
            return useHttp().put('/profile', formData, options);
        },
        uploadFile: (formData, options) => {
            return useHttp().post('/uploads', formData, options);
        },
        requestPasswordReset: (formData, options) => {
            return useHttp().post('/passwords', formData, options);
        },
        resetPassword: (formData, options) => {
            return useHttp().put('/passwords', formData, options);
        },
        reallyResetPassword: (email, token, password, options) => {
            return useHttp().post('/passwords', { email, token, password }, options);
        },
        changePassword: (oldPassword, password, options) => {
            return useHttp().put('/passwords', { old_password: oldPassword, password }, options);
        },
        requestEmailVerification: (options) => {
            return useHttp().post('/email-verification', {}, options);
        },
        verifyEmail: (email, token, options) => {
            return useHttp().put('/email-verification', { email, token }, options);
        },
        getPreferences: (params, options) => {
            return useHttp().get('/preferences', params, options);
        },
        updateNotificationPreference: (notification, formData, options) => {
            return useHttp().put(`/preferences/notifications/${notification}`, formData, options);
        },
        updateWagerPreference: (formData, options) => {
            return useHttp().put('/preferences/wager', formData, options);
        },
        updateFavoriteTagsPreference: (slug, formData, options) => {
            return useHttp().put(`/preferences/favorite-tags/${slug}`, formData, options);
        },
        updatePreference: (formData, options) => {
            return useHttp().put('/preferences', formData, options);
        },
        updateNotificationMethodPreference: (method, formData, options) => {
            return useHttp().put(`/preferences/notification-methods/${method}`, formData, options);
        },
        getNotificationStat: (options) => {
            return useHttp().get('/notification-stat', {}, options);
        },
        getNotifications: (params, options) => {
            return useHttp().get('/notifications', params, options);
        },
        getNotification: (id, options) => {
            return useHttp().get(`/notifications/${id}`, {}, options);
        },
        getNotificationTypes: (options) => {
            return useHttp().get('/notifications/types', { pagination: false }, options);
        },
        updateNotification: (id, payload, options) => {
            return useHttp().put(`/notifications/${id}`, payload, options);
        },
        readNotification: (id, options) => {
            return useHttp().post(`/notifications/${id}/read`, {}, options);
        },
        unreadNotification: (id, options) => {
            return useHttp().post(`/notifications/${id}/unread`, {}, options);
        },

        getKYCAccessToken: (params, options) => {
            return useHttp().post('/kyc', params, options);
        },
        getCountries: () => {
            return useHttp().get('/misc/countries?pagination=false');
        },
        getTransactions: (walletId, params, option) => {
            return useHttp().get(`/wallets/${walletId}/transactions`, params, option);
        },
        getBanks: (params, option) => {
            return useHttp().get('/misc/banks', params, option);
        },
        getBankBranches: (bankCode, params, option) => {
            return useHttp().get(`/misc/banks/${bankCode}/branches`, params, option);
        },
        deposits: (params, options) => {
            return useHttp().post('/deposits', params, options);
        },
        withdraws: (params, options) => {
            return useHttp().post('/withdraws', params, options);
        },
        getDepositMethods: (params, option) => {
            return useHttp().get('/deposit_methods', params, option);
        },
        getWithdrawMethods: (params, option) => {
            return useHttp().get('/withdraw_methods', params, option);
        },
        getWagerPositionHistory: (wagerPositionId, params, options) => {
            return useHttp().get(`/dashboard/wager-positions/${wagerPositionId}/history`, params, options);
        },
        getWagerPosition: (wagerPositionId, params, options) => {
            return useHttp().get(`/dashboard/wager-positions/${wagerPositionId}`, params, options);
        },
        getSlashPaymentUrl: ({ amount, currency }, options) => {
            return useHttp().postSingle('/wallets/deposit/slash', { amount, currency }, options);
        },
        getOnRampCreditCardUrl: ({ amount, currency, cardType }, options) => {
            return useHttp().postSingle('/wallets/deposit/onramp/cc', { amount, currency, card_type: cardType }, options);
        },
        getOnrampIframeActionResponse: (action, payload, options) => {
            return useHttp().postSingle('/wallets/deposit/onramp/crypto', { action, data: payload }, options);
        },
        getOnRampWithdrawUrl: ({ amount, currency }, options) => {
            return useHttp().postSingle('/wallets/withdraw/onramp', { amount, currency }, options);
        },
        getDepositRequest: (orderId, options) => {
            return useHttp().getSingle(`/wallets/deposit_requests/${orderId}`, {}, options);
        },
        getWithdrawRequest: (orderId, options) => {
            return useHttp().getSingle(`/wallets/withdraw_requests/${orderId}`, {}, options);
        },
    };
};
