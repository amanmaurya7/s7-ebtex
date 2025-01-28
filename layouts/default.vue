<script setup>
import { useLayoutStore } from '@/store/layout';

const { getLayoutParameters, connectToAbly } = useLayoutStore();
await getLayoutParameters();
await connectToAbly();
const { wrapperStyle } = useLayout();

const setupChatbotCustomization = () => {
  let currentHeader = null;

  const handleResize = () => {
    const chatWindow = document.getElementById('chatbase-bubble-window');
    if (!chatWindow) return;

    const wrapper = chatWindow.querySelector('.chat-wrapper');
    if (!wrapper) return;

    if (window.innerWidth >= 640) {
      if (!currentHeader) {
        // Create header for mobile view
        currentHeader = document.createElement('div');
        currentHeader.innerHTML = `
          <header class="relative flex items-center justify-between px-5 text-zinc-50" style="background: #3C3C3F">
            <div class="mt-4 mb-2 flex h-10 items-center">
            </div>
            <div class="flex items-center">
                <button class="close-chat-btn flex items-center justify-center" title="Close chat bubble" style="position: absolute; right: 20px; top: 60%; transform: translateY(-50%); background: none; border: none; outline: none; padding: 0; cursor: pointer; opacity: 0.8;">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 92 92">
                  <path d="M70.7 64.3c1.8 1.8 1.8 4.6 0 6.4-.9.9-2 1.3-3.2 1.3-1.2 0-2.3-.4-3.2-1.3L46 52.4 27.7 70.7c-.9.9-2 1.3-3.2 1.3s-2.3-.4-3.2-1.3c-1.8-1.8-1.8-4.6 0-6.4L39.6 46 21.3 27.7c-1.8-1.8-1.8-4.6 0-6.4 1.8-1.8 4.6-1.8 6.4 0L46 39.6l18.3-18.3c1.8-1.8 4.6-1.8 6.4 0 1.8 1.8 1.8 4.6 0 6.4L52.4 46l18.3 18.3z" fill="#ffffff"/>
                </svg>
              </button>
            </div>
          </header>
        `;
                    wrapper.insertBefore(currentHeader, wrapper.firstChild);

                    // Add click handler for close button
                    const closeBtn = currentHeader.querySelector('.close-chat-btn');
                    closeBtn.addEventListener('click', () => {
                      chatWindow.style.display = 'none';
                    });
                  }
                } else {
                  // Remove header for desktop view
                  if (currentHeader) {
                    currentHeader.remove();
                    currentHeader = null;
                  }
                }
              };

              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.addedNodes.length) {
                    const chatWindow = document.getElementById('chatbase-bubble-window');
                    if (chatWindow && !chatWindow.dataset.customized) {
                    // Create wrapper div
                    const wrapper = document.createElement('div');
                    wrapper.className = 'chat-wrapper';
                    wrapper.style.cssText = 'display: flex; flex-direction: column; height: 100%;';

                    // Move the iframe into the wrapper
                    const iframe = chatWindow.querySelector('iframe');
                    const loadingDiv = chatWindow.querySelector('div');
                    
                    if (loadingDiv) wrapper.appendChild(loadingDiv);
                    if (iframe) {
                      iframe.style.flex = '1';
                      wrapper.appendChild(iframe);
                    }

                    // Clear chatWindow and add wrapper
                    chatWindow.innerHTML = '';
                    chatWindow.appendChild(wrapper);

                    // Initial header setup based on window width
                    handleResize();
                    
                    chatWindow.dataset.customized = 'true';
                  }
                }
              });
            });

  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', handleResize);
};

onMounted(() => {
    window.embeddedChatbotConfig = {
        chatbotId: "Ix9bqFBNFqDGbJ2e-Uf0K",
        domain: "www.chatbase.co"
    };
    setupChatbotCustomization();
});

</script>

<template>
  <div :style="wrapperStyle" class="min-h-screen">
    <TopNav />
    <div class="overflow-hidden">
      <div>
        <slot />
      </div>
      <PageFooter />
    </div>

    <Navbar />
    <CustomToast />
  </div>
</template>

<style lang="scss" scoped>
.close-chat-btn:hover svg {
  opacity: 0.8;
}
</style>


