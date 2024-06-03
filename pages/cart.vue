<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Cart</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <Table :headers="tableHeaders" :rows="mappedRows">
          <template #action="{ row }">
            <button
              @click="() => deleteCartItem(row.id)"
              class="bg-red-800 text-white p-2 rounded hover:bg-gray-700"
            >
              Delete
            </button>
          </template>
        </Table>
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
import type { ICartItem, IOrder, IResponse, ITableHeader } from "~/interfaces";
import { CartItemAssociationView } from "~/utils/constants";

definePageMeta({
  middleware: "auth",
});

const tableHeaders: ITableHeader[] = [
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
    label: "Total price",
    key: "totalPrice",
  },
  {
    label: "Action",
    key: "action",
  },
];

const nuxtApp = useNuxtApp();
const { $toast } = nuxtApp;

const authStore = useAuthStore();
const uiStore = useUiStore();

const { setLoading } = uiStore;

const { fetchData } = useApi();

const page = ref(1);
const totalPage = ref(1);
const totalItem = ref(0);
const data = ref<ICartItem[]>([]);

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

const mappedRows = computed(() => {
  return data.value.map((e) => ({
    ...e,
    product: e.product?.name,
    price: e.product?.price,
    totalPrice: (e.product?.price || 0) * e.quantity,
  }));
});

const deleteCartItem = async (id: number) => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData<IResponse<number>>(
    `cart-item/me/${id}`,
    {
      method: "DELETE",
    }
  );

  if (response?.message === "success") {
    $toast(`Delete cart item successfully.`, { type: "success" });
    await getCartItems();
  }
  if (error) {
    $toast(error?.data?.message || "Delete cart item failed.", {
      type: "error",
    });
  }
  setLoading(false);
};

const makeOrder = async () => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData<IResponse<IOrder>>(
    "order-association",
    {
      method: "POST",
    }
  );

  if (response?.message === "success") {
    $toast(`Make an order successfully.`, { type: "success" });
    navigateTo("/order");
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
  const { response, error } = await fetchData<IResponse<ICartItem[]>>(
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
