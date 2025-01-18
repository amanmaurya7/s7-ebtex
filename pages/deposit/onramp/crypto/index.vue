<script setup>
import { useUserStore } from '@/store/user';

definePageMeta({
    middleware: ['user-auth'],
});

const route = useRoute();

const { getOnrampIframeActionResponse } = useApi();
const userStore = useUserStore();
const iframeSrc = useRuntimeConfig().public.onrampCryptoFrameUrl;
const iframeRef = ref(null);
const trustedDomains = [iframeSrc];
const defaultErrorEvent = 'default_error';

const respondIframe = (message) => {
    console.log('respondIframe', message);
    iframeRef.value.contentWindow.postMessage(JSON.stringify(message), '*');
};

const createMessage = (eventName, data, error) => {
    const result = { event: eventName, data, error };
    if (!data) {
        delete result.data;
    }
    if (!error) {
        delete result.error;
    }
    return result;
};

const createError = (error) => {
    return { event: defaultErrorEvent, error };
};

const handleOnRampMessage = async (event) => {
    const isFromOnRamp = trustedDomains.find((trustedDomain) => trustedDomain === event.origin);
    if (isFromOnRamp) {
        try {
            const parsedMessage = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            const eventName = parsedMessage.event;
            if (!eventName) {
                return;
            }
            console.log(`[OnRamp] ${eventName}`, parsedMessage);

            if (eventName === 'copy-to-clipboard') {
                window.navigator.clipboard.writeText(parsedMessage.data);
                return;
            }
            
            const response = await getOnrampIframeActionResponse(eventName, parsedMessage.data);
            let payload;
            if (eventName === 'crypto_ingress_config') {
                payload = {
                    ...response,
                    x_api_key: 'zfKDYAvEywegH2R829bZV2IH26wv2WTj3G74xoVE',
                };
            } else {
                payload = response;
            }

            respondIframe(createMessage(`${eventName}_response`, payload));
        } catch (error) {
            respondIframe(createError(error));
            return false;
        }
    }
    return true;
};

onMounted(() => {
    window.addEventListener('message', handleOnRampMessage);
});

onUnmounted(() => {
    window.removeEventListener('message', handleOnRampMessage);
});


</script>

<template>
  <div class="iframe-container">
    <iframe
      id="crypto-iframe"
      ref="iframeRef"
      :src="iframeSrc"
    />
  </div>
</template>

<style scoped>
.iframe-container {
    position: fixed;
    width: 100vw;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    bottom: 0;
    padding: 2rem 5vw;
}

#crypto-iframe {
  border: none;
  width: 90vw;
  margin: 0 auto;
  min-width: 320px;
  min-height: 80vh;
  max-height: 768px;
}
</style>
