import moment from 'moment';

export const useChartDateFormat = (date, type) => {
    const format = type === 'daily' ? 'MM/DD HH:mm' : 'HH:mm';
    return moment(date).format(format);
};
