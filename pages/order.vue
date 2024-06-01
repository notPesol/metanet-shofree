<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Cart</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex gap-2 items-center justify-end mb-4">
          <label for="status" class="block text-gray-700 font-semibold"
            >Status</label
          >
          <select
            id="status"
            class="px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
            v-model="orderStatus"
          >
            <option
              v-for="option of orderStatusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
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
                Total amount
              </th>

              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Status
              </th>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Created at
              </th>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Updated at
              </th>
              <th
                class="p-2 bg-gray-200 text-left text-sm font-medium text-gray-700"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in data" :key="order.id" class="border-t">
              <td class="p-2">{{ order.id }}</td>
              <td class="p-2">{{ order.totalAmount }}</td>
              <td class="p-2">{{ mapOrderStatus[order.status] }}</td>
              <td class="p-2">{{ formatDateTime(order.createdAt) }}</td>
              <td class="p-2">{{ formatDateTime(order.updatedAt) }}</td>
              <td class="p-2">
                <template v-if="order.status === 'pending'">
                  <button
                    v-if="order.status === 'pending'"
                    @click="payOrder(order.id)"
                    class="bg-green-700 text-white p-2 rounded hover:bg-gray-700"
                  >
                    Pay
                  </button>
                </template>
                <template v-else>-</template>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="mt-4 flex justify-between gap-2">
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
import type { Order, OrderStatus } from "~/interfaces";
import { orderStatusOptions } from "~/utils/constants";

definePageMeta({
  middleware: "auth",
});

const nuxtApp = useNuxtApp();
const { $toast } = nuxtApp;

const authStore = useAuthStore();
const uiStore = useUiStore();

const { setLoading } = uiStore;

const { fetchData } = useApi();

const orderStatus = ref<OrderStatus>("pending");
const page = ref(1);
const totalPage = ref(1);
const totalItem = ref(0);
const data = ref<Order[]>([]);

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

const payOrder = async (orderId: number) => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData(
    `order-association/payment/${orderId}`,
    {
      method: "POST",
    }
  );

  if (response?.message === "success") {
    $toast(`Pay an order successfully.`, { type: "success" });
    await getOrders();
  }
  if (error) {
    $toast(error?.data?.message || "There was an error in payment.", {
      type: "error",
    });
  }
  setLoading(false);
};

const getOrders = async () => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData(`order/me`, {
    query: {
      page: page.value,
      limit: 10,
      count: true,
      status: orderStatus.value,
    },
  });

  if (response) {
    data.value = response.data;
    totalPage.value = Math.ceil(response.totalItem / 10);
    totalItem.value = response.totalItem || 0;
  }
  if (error) {
    $toast(error?.data?.message || "Fetch orders failed.", {
      type: "error",
    });
  }

  setLoading(false);
};

watch(page, async (page) => {
  totalPage.value = 1;
  totalItem.value = 0;
  await getOrders();
});

watch(orderStatus, async (orderStatus) => {
  page.value = 1;
  totalPage.value = 1;
  totalItem.value = 0;
  await getOrders();
});

await getOrders();
</script>
