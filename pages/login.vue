<template>
  <div class="flex items-center justify-center bg-gray-100 min-h-screen">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center">LOGIN"</h2>
      <form @submit.prevent="submit">
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold">Username</label>
          <input
            v-model="username"
            type="text"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 font-semibold">Password</label>
          <input
            v-model="password"
            type="password"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-indigo-500 text-white py-2 rounded-lg"
        >
          LOGIN
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
});

const nuxtApp = useNuxtApp();
const { $toast } = nuxtApp;

const authStore = useAuthStore();
const uiStore = useUiStore();

const { login } = authStore;
const { setLoading } = uiStore;

const { fetchData } = useApi();

const username = ref("");
const password = ref("");

const loginHandler = async () => {
  const { response, error } = await fetchData(`authentication/login`, {
    method: "POST",
    body: { username: username.value, password: password.value },
  });
  if (response) {
    await login(response.data.accessToken);
    $toast("Login successfully.", { type: "success" });
    navigateTo("/profile", { replace: true });
  } else {
    $toast(error?.data?.message || "Login failed.", { type: "error" });
  }
};

const submit = async () => {
  setLoading(true);
  await loginHandler();
  setLoading(false);
};
</script>
