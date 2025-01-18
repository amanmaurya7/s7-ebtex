<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store/user';
const { userInfo } = storeToRefs(useUserStore());
const emit = defineEmits(['paymentConfirmed']);
const props = defineProps({
    onBack: {
        type: Function,
        required: true,
    },
    fiatAmount: {
        type: Number,
        required: true,
    },
    cryptoType: {
        type: String,
        required: true,
    },
});

// Iframe related
const iframeSrc = useRuntimeConfig().public.onrampCryptoFrameUrl;
const iframeRef = ref(null);
const trustedDomains = [iframeSrc];
const defaultErrorEvent = 'default_error';

// Iframe message handling
const respondIframe = (message) => {
    console.log('respondIframe', message);
    iframeRef.value.contentWindow.postMessage(JSON.stringify(message), '*');
};

const createMessage = (eventName, data, error) => {
    const result = { event: eventName, data, error };
    if (!data) delete result.data;
    if (!error) delete result.error;
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
            if (!eventName) return;
            console.log(`[OnRamp] ${eventName}`, parsedMessage);

            if (eventName === 'payment_confirmed') {
                emit('paymentConfirmed');
                return;
            }

            if (eventName === 'copy-to-clipboard') {
                window.navigator.clipboard.writeText(parsedMessage.data);
                return;
            }

            if (eventName === 'crypto_ingress_config') {
                const runtimeConfig = useRuntimeConfig();
                respondIframe(createMessage(`${eventName}_response`, {
                    min_amount: props.fiatAmount,
                    max_amount: props.fiatAmount,
                    fiat: 'USD',
                    crypto_type: props.cryptoType,
                    crypto_currency: props.cryptoType,
                    x_api_key: runtimeConfig.public.onrampXApiKey,
                    user_info: {
                        merchant_customer_id: userInfo.value._id,
                    },
                    customization: {
                        primary_color: 'rgb(80, 0, 151)',
                        font_color: '#ffffff',
                        font_color_type: 'dark',
                        font_family: 'Nunito, sans-serif',
                        background_color: 'rgb(23, 3, 47)',
                    },
                }));
                return;
            }
            
            const { getOnrampIframeActionResponse } = useApi();
            const response = await getOnrampIframeActionResponse(eventName, parsedMessage.data);
            const payload = response;
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

<style lang="scss" scoped>
.iframe-container {
  position: fixed;
  width: 100vw;
  background: rgba(0, 0, 0, 0.3);
  top: 0;
  bottom: 0;
  left: 0;
//   padding: 2vh 2vw;
  z-index: 1000;
}

#crypto-iframe {
  border: none;
  width: 100vw;
  margin: 0 auto;
  height: 100vh;
}
</style> 