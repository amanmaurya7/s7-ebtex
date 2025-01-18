<script setup>
const html = ref('');
const { getSitePage } = useApi();
const { data } = await getSitePage('about-us');

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
  <div class="bg-w2-500">
    <div class="text-center mb-4 uppercase font-1375 pt-250 font-bold" v-html="$t('info.about_us')" />
    <TabView :active-index="0" @tab-change="onTabChange">
      <TabPanel :header="$t('info.company')" contentStyle="padding: 2.5rem 15px 30px">
        <div class="content-wrap" v-html="html" />
      </TabPanel>
      <TabPanel :header="$t('info.privacy_policy')" />
      <TabPanel :header="$t('info.terms_of_use')" />
    </TabView>
  </div>
</template>
