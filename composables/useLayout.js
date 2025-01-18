
export const useLayout = () => {
    const paddingTop = ref('60px');
    const paddingBottom = ref('60px');
    const wrapperStyle = computed(() => ({
        backgroundColor: '#FFFFFF',
        height: '100%',
        minHeight: '100vh',
        paddingTop: paddingTop.value,
        paddingBottom: paddingBottom.value,
    }));

    return {
        wrapperStyle,
    };
};
