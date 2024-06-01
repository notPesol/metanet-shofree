<template>
  <div class="w-64 h-screen bg-gray-800 text-white">
    <ul class="p-4">
      <li v-for="item in menuItems" :key="item.text" class="mb-4">
        <NuxtLink :to="item.link" class="block p-2 rounded hover:bg-gray-700">{{
          item.text
        }}</NuxtLink>
      </li>
      <li
        @click="authStore.logout"
        class="mb-4 block p-2 rounded hover:bg-red-700"
      >
        Logout
      </li>
    </ul>
  </div>
</template>

<script setup>
const menuItems = [
  // { text: "Home", link: "/" },
  { text: "Profile-Wallet", link: "/profile" },
  // { text: "Wallet", link: "/wallet" },
  { text: "Product", link: "/product" },
  { text: "Cart", link: "/cart" },
  { text: "Order", link: "/order" },
];

const authStore = useAuthStore();
</script>
