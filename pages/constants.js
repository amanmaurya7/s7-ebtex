import { paymentIcons } from '@/assets/svg';

export const NA = '--';
export const CHART_ASPECT_RATIO = 1.5;
export const CHART_BOX_WIDTH = 20;
export const CHART_BOX_HEIGHT = 2;
export const CHART_BAR_THICKNESS = 2;
export const CHART_BAR_PERCENTAGE = 0.5;
export const MIN_PLEDGE = 10;

export const NEW_BET_MERGE_TYPE = {
    NEW: 'new',
    SPLITTED: 'splitted',
    ROLLED: 'rolled',
};

export const eventSortOptions = [
    { name: 'sort_option.relevance', code: 'relevance' },
    { name: 'sort_option.new', code: 'newest' },
    { name: 'sort_option.24_hours_trading_volume', code: '24 hours trading volume' },
    { name: 'sort_option.time_left', code: 'time left' },
    { name: 'sort_option.elapsed_time_since_creation', code: 'elapsed time since creation' },
    { name: 'sort_option.traders', code: 'number of participating traders' },
    { name: 'sort_option.max_return', code: 'maximum return (earnings)' },
    { name: 'sort_option.min_return', code: 'minimum return (earnings)' },
    { name: 'sort_option.max_leverage', code: 'maximum leverage (multiplier)' },
];

export const activeWagerPositionSortOptions = [
    { name: 'sort_option.most_recently_traded', code: 'most recently traded' },
    { name: 'sort_option.time_to_expiration', code: 'time to expiration' },
    { name: 'sort_option.biggest_wager', code: 'biggest wager' },
];

export const inactiveWagerPositionSortOptions = [
    { name: 'sort_option.most_recently_traded', code: 'most recently traded' },
    { name: 'sort_option.recently_closed', code: 'recently closed' },
    { name: 'sort_option.biggest_wager', code: 'biggest wager' },
];

export const PAYMENT_METHOD_CODE = {
    BANK_TRANSFER: 'BANK_TRANSFER',
    CREDIT_CARD: 'CREDIT_CARD',
    CRYPTOCURRENCY: 'CRYPTOCURRENCY',
    ID_BANK_TRANSFER: 'ID_BANK_TRANSFER',
};

export const DEFAULT_PAYMENT_METHODS = [
    {
        code: PAYMENT_METHOD_CODE.CREDIT_CARD,
        icon: paymentIcons.creditCard,
        active_icon: paymentIcons.creditCardActive,
        disabled_icon: paymentIcons.creditCardDisabled,
    },
    {
        code: PAYMENT_METHOD_CODE.CRYPTOCURRENCY,
        icon: paymentIcons.bitcoin,
        active_icon: paymentIcons.bitcoinActive,
        disabled_icon: paymentIcons.bitcoinDisabled,
    },
];

export const DEPOSIT_PAYMENT_METHODS = [
    {
        code: PAYMENT_METHOD_CODE.BANK_TRANSFER,
        icon: paymentIcons.bank,
        active_icon: paymentIcons.bankActive,
        disabled_icon: paymentIcons.bankDisabled,
    },
    ...DEFAULT_PAYMENT_METHODS,
];

export const WITHDRAW_PAYMENT_METHODS = [
    {
        code: PAYMENT_METHOD_CODE.ID_BANK_TRANSFER,
        icon: paymentIcons.bank,
        active_icon: paymentIcons.bankActive,
        disabled_icon: paymentIcons.bankDisabled,
    },
    ...DEFAULT_PAYMENT_METHODS,
];

export const MY_AFFILIATE_CACHE_KEY = 'my-affiliate';

export const PAYMENT_RESULT = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    CANCELED: 'CANCELED',
};

export const BETTING_RESULT = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
};

export const KYC_ELEMENT_ID = {
    DEFAULT: 'sumsub-websdk-container',
    PHONE_VERIFICATION: 'sumsub-websdk-phone-verification-container',
    HIDDEN: 'hidden-sumsub-websdk-container',
};

export const NOTIFICATIONS = {
    // registration The Welcome Notification
    registration: {
        toastType: 'success',
        walletRelated: false,
        icon: 'EVERY_X',
    },
    // ACR01 Trophy Email Verified
    ACR01: {
        toastType: 'success',
        walletRelated: false,
        icon: 'TROPHY',
    },
    // EI01 Event ending soon
    EI01: {
        toastType: 'warning',
        walletRelated: false,
        icon: 'CLOCK',
    },
    // EI02 Stop Warning
    EI02: {
        toastType: 'warning',
        walletRelated: false,
        icon: 'STOP',
    },
    // EI03 Stop Triggered
    EI03: {
        toastType: 'error',
        walletRelated: false,
        icon: 'STOP',
    },
    // EI04 Winner
    EI04: {
        toastType: 'success',
        walletRelated: true,
        icon: 'WON',
    },
    // EI06 Event ended
    EI06: {
        toastType: 'warning',
        walletRelated: false,
        icon: 'CROSS',
    },
    // EI07 New Favorite Event
    EI07: {
        toastType: 'info',
        walletRelated: false,
        icon: 'STAR',
    },
    // EI08 EveryX Updated
    EI08: {
        toastType: 'info',
        walletRelated: false,
        icon: 'EVERY_X',
    },
    // DW01 Low Balance
    DW01: {
        toastType: 'warning',
        walletRelated: true,
        icon: 'WALLET',
    },
    // DW03 Deposit Confirmed
    DW03: {
        toastType: 'success',
        walletRelated: true,
        icon: 'DEPOSIT_WITHDRAWAL',
    },
    // DW04 Withdrawal Confirmed
    DW04: {
        toastType: 'success',
        walletRelated: true,
        icon: 'DEPOSIT_WITHDRAWAL',
    },
    // DW05 Deposit Failed
    DW05: {
        toastType: 'error',
        walletRelated: true,
        icon: 'DEPOSIT_WITHDRAWAL_ERROR',
    },
    // DW06 Withdrawal Failed
    DW06: {
        toastType: 'error',
        walletRelated: true,
        icon: 'DEPOSIT_WITHDRAWAL_ERROR',
    },
};

export const NOTIFICATION_TIMESTAMP_FORMAT = {
    en: 'MM/DD HH:mm',
    ja: 'MM月DD日 HH:mm',
};

export const CRYPTO_TYPE = {
    BTC: 'BTC',
    ETH: 'ETH',
};

export const BANK_ACCOUNT_TYPE = {
    REGULAR: 'regular',
    SAVINGS: 'savings',
};

export const TRANSACTION_TYPE = {
    DEPOSIT: 'deposit',
    WITHDRAW: 'withdraw',
    WITHDRAW_ROLLBACK: 'withdraw_rollback',
};

// 0: on-going, 1: won, -1: lost, -2: margin-called
export const WAGER_STATUS = {
    WIN: 1,
    LOST: -1,
    MARGIN_CALL: -2,
    REVERSAL: -3,
    DEFAULT: 0,
};

export const EVENT_STATUS = {
    CREATED: 'created',
    OPEN: 'open',
    CLOSED: 'closed',
    PAUSED: 'paused',
    RESOLVED: 'resolved',
    CANCELED: 'canceled',
    INACTIVE: 'inactive',
};

export const LOGIN_RESUME_KEY = 'event-detail-login-resume';

export const CHART_COLORS = [
    '#00E673', '#00E6E6', '#0073E6',
    '#00E67333', '#00E6E633', '#0073E633',
    '#00E67366', '#00E6E666', '#0073E666',
    '#00E67399', '#00E6E699', '#0073E699',
    '#00E673CC', '#00E6E6CC', '#0073E6CC',
];