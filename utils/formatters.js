import moment from 'moment';
import { NA } from '@/pages/constants';
import humanizeDuration from 'humanize-duration';

export const formatDate = (date, format) => {
    const { locale } = useNuxtApp().$i18n;
    return moment(date).format(format
        ? format
        : locale.value === 'ja'
            ? 'YYYY年MM月DD日 HH:mm:ss'
            : 'YYYY/MM/DD HH:mm:ss');
};

export const round = (number, decimalPlaces = 0) => {
    if (isNumber(number)) {
        return parseFloat(number.toFixed(decimalPlaces));
    }
    return 0;
};

export const htmlToPlainText = (html) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    return dom.body.textContent || '';
};

export const formatAmount = (amount, decimalPlaces = 0) => {
    amount = parseFloat(amount);
    return !isNaN(amount)
        ? amount >= 0
            ? `$${round(amount, decimalPlaces).toLocaleString()}`
            : `-$${round(-amount, decimalPlaces).toLocaleString()}`
        : NA;
};

export const formatNumber = (number, decimalPlaces = 0) => {
    return !isNaN(number)
        ? round(number, decimalPlaces).toLocaleString()
        : NA;
};

export const formatPercentage = (percentage, decimalPlaces = 0) => {
    percentage = parseFloat(percentage);
    return !isNaN(percentage)
        ? `${round(percentage, decimalPlaces)}%`
        : NA;
};

export const formatSignedPercentage = (percentage, decimalPlaces = 0) => {
    const formatted = formatPercentage(percentage, decimalPlaces);
    return (formatted === NA || percentage <= 0)
        ? formatted
        : `+${formatted}`;
};

export const formatProbability = (probability, decimalPlaces = 0) => {
    probability = parseFloat(probability);
    return !isNaN(probability)
        ? `${round(probability * 100, decimalPlaces)}%`
        : NA;
};

export const formatSignedProbability = (probability, decimalPlaces = 0) => {
    const formatted = formatProbability(probability, decimalPlaces);
    return (formatted === NA || probability < 0)
        ? formatted
        : `+${formatted}`;
};

export const DURATION_MODE = {
    COMPACT: 'compact',
    FULL: 'full',
};

export const formatDuration = (duration, language, mode = DURATION_MODE.COMPACT) => {
    if (language === 'en') {
        return humanizeDuration(duration, {
            languages: {
                customEN: {
                    y: () => mode === DURATION_MODE.COMPACT ? 'y' : 'year',
                    mo: () => mode === DURATION_MODE.COMPACT ? 'mo' : 'month',  
                    w: () => mode === DURATION_MODE.COMPACT ? 'w' : 'week',  
                    d: () => mode === DURATION_MODE.COMPACT ? 'd' : 'day',  
                    h: () => mode === DURATION_MODE.COMPACT ? 'h' : 'hour',  
                    m: () => mode === DURATION_MODE.COMPACT ? 'm' : 'minute',  
                    s: () => mode === DURATION_MODE.COMPACT ? 's' : 'second',  
                    ms: () => mode === DURATION_MODE.COMPACT ? 'ms' : 'ms',
                },
            },
            language: 'customEN',
            largest: 2,
            delimiter: ' ',
            spacer: mode === DURATION_MODE.COMPACT ? '' : ' ',
            units: ['y', 'mo', 'w', 'd', 'h', 'm', 's'],
            round: true,
        });
    } else {
        return humanizeDuration(duration, {
            language,
            largest: 2,
            delimiter: '',
            spacer: '',
        });
    }
};