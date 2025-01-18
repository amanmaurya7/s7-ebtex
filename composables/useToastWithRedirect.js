export const useToastWithRedirect = () => {
    const { $showToast } = useNuxtApp();
    const timer = ref(null);

    const showToastWithRedirect = (type, message, redirectPath) => {
        if (timer.value) {
            clearTimeout(timer.value);
        }

        $showToast(type, message);
        timer.value = setTimeout(() => {
            navigateTo(redirectPath);
        }, 1000);
    };

    return {
        showToastWithRedirect,
    };
};
