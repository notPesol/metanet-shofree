<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Profile</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-700">Username:</span>
          <span class="text-2xl font-bold text-gray-900">{{
            user?.username || "-"
          }}</span>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-700">Created at:</span>
          <span class="text-gray-600">{{
            user?.createdAt ? formatDateTime(user?.createdAt) : "-"
          }}</span>
        </div>
      </div>
    </div>
    <div>
      <h1 class="text-3xl font-bold mb-4">Wallet</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-700">Balance:</span>
          <span class="text-2xl font-bold text-gray-900">{{
            wallet?.balance || "-"
          }}</span>
        </div>
        <div class="flex justify-between items-center mb-4">
          <span class="text-gray-700">Last Updated:</span>
          <span class="text-gray-600">{{
            wallet?.updatedAt ? formatDateTime(wallet?.updatedAt) : "-"
          }}</span>
        </div>
        <div class="flex justify-end gap-2">
          <button
            @click="() => getWallet()"
            class="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Wallet } from "~/interfaces";

definePageMeta({
  middleware: "auth",
});

const nuxtApp = useNuxtApp();
const { $toast } = nuxtApp;

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const uiStore = useUiStore();

const { setLoading } = uiStore;

const { fetchData } = useApi();

const wallet = ref<Wallet>();

const getWallet = async (isShowToat: boolean = true) => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData("wallet/me");
  if (response) {
    wallet.value = response.data;
    if (isShowToat) {
      $toast("Fetch wallet successfully.", { type: "success" });
    }
  }
  if (error) {
    $toast(error?.data?.message || "Fetch wallet failed.", { type: "error" });
  }

  setLoading(false);
};

await getWallet(false);
</script>
