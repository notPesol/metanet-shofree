<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Order</h1>
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
        <Table :headers="tableHeaders" :rows="mappedRows">
          <template #action="{ row }">
            <div class="flex gap-2">
              <template v-if="row.status === 'pending'">
                <button
                  @click="payOrder(row.id)"
                  class="bg-green-700 text-white p-2 rounded hover:bg-gray-700"
                >
                  Pay
                </button>
              </template>
              <button
                @click="selectedOrder = row"
                class="bg-blue-700 text-white p-2 rounded hover:bg-gray-700"
              >
                View
              </button>
            </div>
          </template>
        </Table>
        <div class="mt-4 flex justify-end gap-2">
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
    <Modal v-if="selectedOrder" class="w-full !max-w-[90%]">
      <template #header
        ><h2 class="text-lg leading-6 font-medium text-gray-900">
          Order#{{ selectedOrder.id }} Order items
        </h2></template
      >
      <template #body>
        <Table :headers="orderItemTableHeaders" :rows="mappedOrderItems" />
        <div class="mt-4 flex justify-end gap-2">
          <div class="flex gap-2 items-center justify-end">
            <label for="page" class="block text-gray-700 font-semibold"
              >Page</label
            >
            <select
              id="orderItemPage"
              class="px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
              v-model="orderItemPage"
            >
              <option
                v-for="option of orderItemPageOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <button
            @click="() => clearSelectedOrder()"
            class="bg-red-800 text-white p-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import type { Order, OrderItem, OrderStatus, TableHeader } from "~/interfaces";
import {
  OrderItemAssociationView,
  orderStatusOptions,
} from "~/utils/constants";

definePageMeta({
  middleware: "auth",
});

const tableHeaders: TableHeader[] = [
  {
    label: "Id",
    key: "id",
  },
  {
    label: "Total amount",
    key: "totalAmount",
  },
  {
    label: "Status",
    key: "mappedStatus",
  },
  {
    label: "Created at",
    key: "createdAt",
  },
  {
    label: "Updated at",
    key: "updatedAt",
  },
  {
    label: "Action",
    key: "action",
  },
];
const orderItemTableHeaders: TableHeader[] = [
  {
    label: "Id",
    key: "id",
  },

  {
    label: "Product",
    key: "product",
  },
  {
    label: "Price",
    key: "price",
  },
  {
    label: "Quantity",
    key: "quantity",
  },
  {
    label: "Total amount",
    key: "totalAmount",
  },
];

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

const selectedOrder = ref<Order>();
const orderItems = ref<OrderItem[]>([]);
const orderItemPage = ref(1);
const orderItemTotalPage = ref(1);
const orderItemTotalItem = ref(0);

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

const orderItemPageOptions = computed(() => {
  const pages = [];
  for (let i = 1; i <= orderItemTotalPage.value; i++) {
    pages.push({
      label: i,
      value: i,
    });
  }
  return pages;
});

const mappedRows = computed(() => {
  return data.value.map((e) => ({
    ...e,
    mappedStatus: mapOrderStatus[e.status],
    createdAt: formatDateTime(e.createdAt),
    updatedAt: formatDateTime(e.updatedAt),
  }));
});

const mappedOrderItems = computed(() => {
  return orderItems.value.map((e) => ({
    ...e,
    product: e.product?.name,
    totalAmount: +e.price * e.quantity,
  }));
});

const clearSelectedOrder = () => {
  selectedOrder.value = undefined;
  orderItems.value = [];
  orderItemPage.value = 1;
  orderItemTotalPage.value = 1;
  orderItemTotalItem.value = 0;
};

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
const getOrderItems = async () => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData(
    `order-item-association/${OrderItemAssociationView.orderItemProduct}`,
    {
      query: {
        page: orderItemPage.value,
        limit: 10,
        count: true,
        orderId: selectedOrder.value?.id,
      },
    }
  );

  if (response) {
    orderItems.value = response.data;
    orderItemTotalPage.value = Math.ceil(response.totalItem / 10);
    orderItemTotalItem.value = response.totalItem || 0;
  }
  if (error) {
    $toast(error?.data?.message || "Fetch order items failed.", {
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

watch(orderItemPage, async (page) => {
  orderItemTotalPage.value = 1;
  orderItemTotalItem.value = 0;
  await getOrderItems();
});

watch(orderStatus, async (orderStatus) => {
  page.value = 1;
  totalPage.value = 1;
  totalItem.value = 0;
  await getOrders();
});

watch(selectedOrder, async (selectedOrder) => {
  if (selectedOrder?.id) {
    page.value = 1;
    totalPage.value = 1;
    totalItem.value = 0;
    await getOrderItems();
  }
});

await getOrders();
</script>
