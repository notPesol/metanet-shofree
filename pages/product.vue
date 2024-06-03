<template>
  <div class="flex flex-col gap-4">
    <div>
      <h1 class="text-3xl font-bold mb-4">Products</h1>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <Table :headers="tableHeaders" :rows="data">
          <template #description="{ row }">
            {{ row.description || "-" }}
          </template>
          <template #updatedAt="{ row }">
            {{ formatDateTime(row.updatedAt) }}
          </template>
          <template #action="{ row }">
            <button
              @click="selectedProduct = row"
              class="bg-green-700 text-white p-2 rounded hover:bg-gray-700"
            >
              Add to cart
            </button>
          </template>
        </Table>
        <div class="mt-4 flex gap-2 items-center justify-end">
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
    <Modal v-if="selectedProduct" @clickOutside="() => closeModal()">
      <template #header>
        <h2 class="text-lg leading-6 font-medium text-gray-900">Add to cart</h2>
      </template>
      <template #body>
        <div class="flex flex-col gap-2 w-full">
          <div class="mb-4">
            <p>Product name: {{ selectedProduct.name }}</p>
          </div>
          <div class="mb-4">
            <label for="inputAmount" class="block text-gray-700 font-semibold"
              >Amount</label
            >
            <input
              id="inputAmount"
              type="number"
              min="1"
              step="1"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
              v-model="inputAmount"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2 w-full">
          <button
            @click="() => addToCart()"
            class="bg-blue-800 text-white p-2 rounded hover:bg-gray-700"
          >
            Confirm
          </button>
          <button
            @click="() => closeModal()"
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
import type {
  ICartItem,
  ICreateCartItem,
  IProduct,
  IResponse,
  ITableHeader,
} from "~/interfaces";

definePageMeta({
  middleware: "auth",
});

const tableHeaders: ITableHeader[] = [
  {
    label: "Id",
    key: "id",
  },
  {
    label: "Name",
    key: "name",
  },
  {
    label: "Description",
    key: "description",
  },
  {
    label: "Price",
    key: "price",
  },
  {
    label: "Stock",
    key: "stock",
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

const nuxtApp = useNuxtApp();
const { $toast } = nuxtApp;

const authStore = useAuthStore();
const uiStore = useUiStore();

const { setLoading } = uiStore;

const { fetchData } = useApi();

const page = ref(1);
const totalPage = ref(1);
const data = ref<IProduct[]>([]);

const selectedProduct = ref<IProduct>();
const inputAmount = ref<number>(0);

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

const closeModal = () => {
  selectedProduct.value = undefined;
  inputAmount.value = 0;
};

const addToCart = async () => {
  if (!authStore.accessToken) {
    return;
  }

  if (inputAmount.value <= 0) {
    $toast(`The amount must be greater than 0.`, { type: "warning" });
    return;
  }

  setLoading(true);
  const body: ICreateCartItem = {
    userId: authStore.user?.id,
    productId: selectedProduct.value?.id,
    quantity: inputAmount.value,
  };
  const { response, error } = await fetchData<IResponse<ICartItem>>(
    "cart-item",
    {
      method: "POST",
      body,
    }
  );

  if (response?.message === "success") {
    $toast(`Add to cart successfully.`, { type: "success" });
    await getProducts();
  }
  if (error) {
    $toast(error?.data?.message || "Fetch transaction failed.", {
      type: "error",
    });
  }
  closeModal();
  setLoading(false);
};

const getProducts = async () => {
  if (!authStore.accessToken) {
    return;
  }

  setLoading(true);
  const { response, error } = await fetchData<IResponse<IProduct[]>>(
    "product",
    {
      query: { page: page.value, limit: 10, count: true },
    }
  );

  if (response) {
    data.value = response.data;
    totalPage.value = Math.ceil(response.totalItem / 10);
  }
  if (error) {
    $toast(error?.data?.message || "Fetch transaction failed.", {
      type: "error",
    });
  }

  setLoading(false);
};

watch(page, async (page) => {
  await getProducts();
});

await getProducts();
</script>
