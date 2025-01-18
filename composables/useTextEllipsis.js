export const useTextEllipsis = (text, limit = 27) => {
    if(text.length > limit) {
        return text.slice(0, limit) + '...';
    }
    return text;
};
