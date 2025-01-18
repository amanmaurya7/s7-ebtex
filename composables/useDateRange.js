import moment from 'moment';

export const useDateRange = (range = 24, toDate) => {
    const to = moment(toDate).endOf('day');
    const from = moment(toDate).subtract(range, 'h').startOf('day');

    return { from: from.toISOString(), to: to.toISOString() };
};
