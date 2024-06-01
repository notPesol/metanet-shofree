<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Cart</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <table class="min-w-full">
          <thead>
            <tr>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Id
              </th>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Product
              </th>

              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Price
              </th>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Quantuty
              </th>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Total price
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cartItem in data" :key="cartItem.id" class="border-t">
              <td class="p-2">{{ cartItem.id }}</td>
              <td class="p-2">{{ cartItem.product?.name }}</td>
              <td class="p-2">{{ cartItem.product?.price }}</td>
              <td class="p-2">{{ cartItem.quantity }}</td>
              <td class="p-2">
                {{ (cartItem.product?.price || 0) * cartItem.quantity }}
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4 flex justify-between gap-2">
          <button
            v-if="totalItem"
            @click="() => makeOrder()"
            class="bg-green-700 text-white p-2 rounded hover:bg-gray-700"
          >
            Make an order
          </button>
          <div class="flex gap-2 items-center justify-end">
            <label for="page" class="block text-gray-700 font-semibold"
              >Page</label
            >
            <select
              id="page"
              class="px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
              v-model="page"
            >
              <option
                v-for="pageOption of pageOptions"
                :key="pageOption.value"
                :value="pageOption.value"
              >
                {{ pageOption.label }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from "~/interfaces";
import { CartItemAssociationView } from "~/utils/constants";

definePageMeta({
  middleware: "auth",
});

const nuxtApp = useNuxtApp();
const { $toast } = nuxtApp;

const authStore = useAuthStore();
const uiStore = useUiStore();

const { setLoading } = uiStore;

const { fetchData } = useApi();

const page = ref(1);
const totalPage = ref(1);
const totalItem = ref(0);
const data = ref<CartItem[]>([]);

const pageOptions = computed(() => {
  const pages = [];
  for (let i = 1; i <= totalPage.value; i++) {
    pages.push({
      label: i,
      value: i,
    });
  }
  return pages;
});

const makeOrder = async () => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData("order-association", {
    method: "POST",
  });

  if (response?.message === "success") {
    $toast(`Make an order successfully.`, { type: "success" });
    navigateTo('/order')
  }
  if (error) {
    $toast(error?.data?.message || "Make an order failed.", {
      type: "error",
    });
  }
  setLoading(false);
};

const getCartItems = async () => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData(
    `cart-item-association/me/${CartItemAssociationView.cartItemProduct}`,
    {
      query: { page: page.value, limit: 10, count: true },
    }
  );

  if (response) {
    data.value = response.data;
    totalPage.value = Math.ceil(response.totalItem / 10);
    totalItem.value = response.totalItem || 0;
  }
  if (error) {
    $toast(error?.data?.message || "Fetch cart items failed.", {
      type: "error",
    });
  }

  setLoading(false);
};

watch(page, async (page) => {
  await getCartItems();
});

await getCartItems();
</script>
