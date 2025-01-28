<script setup>
const html = ref('');
const { getSitePage } = useApi();
const { data } = await getSitePage('terms');

if(data.value) {
    html.value = data.value.html;
}

const { $localePath } = useNuxtApp();
const onTabChange = (event) => {
    const url = [
        '/about',
        '/privacy',
        '/terms',
    ];
    navigateTo($localePath(url[event.index]));
};
</script>

<template>
  <div class="bg-w2-500 p-4 md:p-8 lg:p-12">
    <div class="text-center mb-4 uppercase font-1275 pt-250 font-bold text-3xl" v-html="$t('info.about_us')" />
    <TabView :active-index="2" @tab-change="onTabChange">
      <TabPanel :header="$t('info.company')" />
      <TabPanel :header="$t('info.privacy_policy')" />
      <TabPanel :header="$t('info.terms_of_use')" contentStyle="padding: 2.5rem 15px 30px;">
        <div v-html="html" class="prose lg:prose-xl mx-auto" />
      </TabPanel>
    </TabView>
  </div>
</template>
