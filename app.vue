<template>
  <div>
    <FullLoading v-if="uiStore.isLoading" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const uiStore = useUiStore();
const authStore = useAuthStore();

const { accessToken } = storeToRefs(authStore);

const { fetchProfile } = authStore;

watch(accessToken, async (accessToken) => {
  if (accessToken) {
    await fetchProfile();
  }
});
</script>
