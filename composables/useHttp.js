import { storeToRefs } from 'pinia';
import { useUserStore } from '../store/user';
import { $fetch } from 'ofetch';

export const useHttp = () => {
    const runtimeConfig = useRuntimeConfig();
    const { locale } = useNuxtApp().$i18n;
    const userStore = useUserStore();
    const { token } = storeToRefs(userStore);

    const apiFetch = (url, options, single = false) => {
        let headers = Object.assign(options.headers || {}, {
            'accept-language': locale.value === 'ja' ? 'jp' : locale.value,
            'accept': 'application/json',
            'cookie': '',
        });

        if (token.value) {
            headers.Authorization = `Bearer ${token.value}`;
        }

        const fetchMethod = single ? $fetch : useFetch;

        return fetchMethod(url, {
            ...options,
            baseURL: runtimeConfig.public.baseURL,
            headers,
            onResponseError({ response }) {
                // Catch 401 globally
                if (response.status === 401) {
                    if (options.method === 'PUT' && url === '/passwords') {
                        // Don't do anything for this password reset case
                    } else {
                        userStore.logout({ isForce: true });
                        return;
                    }
                }

                if (!options.onResponseError) {
                    useCommonErrorHandler(response);
                } else {
                    options.onResponseError({ response });
                }
            },
        });
    };

    return {
        get: (url, params, options) => {
            return apiFetch(url, { method: 'GET', params, ...options });
        },
        post: (url, body, options) => {
            return apiFetch(url, { method: 'POST', body, ...options });
        },
        put: (url, body, options) => {
            return apiFetch(url, { method: 'PUT', body, ...options });
        },
        delete: (url, body, options) => {
            return apiFetch(url, { method: 'DELETE', body, ...options });
        },
        postSingle: (url, body, options) => {
            return apiFetch(url, { method: 'POST', body, ...options }, true);
        },
        getSingle: (url, params, options) => {
            return apiFetch(url, { method: 'GET', params, ...options }, true);
        },
    };
};
