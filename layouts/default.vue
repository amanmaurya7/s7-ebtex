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
              <button class="close-chat-btn flex items-center justify-center" title="Close chat bubble" style="position: absolute; right: 14px; top: 7  0%; transform: translateY(-50%); background: #3C3C3F; color: white; font-size: 24px; width: 28px; height: 28px; line-height: 1; border: none; outline: none; padding: 0;">
                X
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
</style>


