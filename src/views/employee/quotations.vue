<template>
  <AdminLayout>
    <template #title>العملاء</template>

    <main class="flex-1 p-2 sm:p-4 lg:p-8 w-full">
      <div class="mb-6 flex justify-between items-center">
        <h2 class="text-xl font-bold">الطلبات (عروض الأسعار)</h2>
      </div>
      <div class="card">
        <div class="overflow-x-auto">
          <table
            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          >
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  اسم الموظف
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  جوال الموظف
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  البريد
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  اسم المزود
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  الخدمة
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  الملاحظات
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  المبلغ
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  الحالة
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  تاريخ الطلب
                </th>
                <th
                  class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  ملف العرض
                </th>
              </tr>
            </thead>
            <tbody
              class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
            >
              <tr>
                <td class="px-4 py-3 whitespace-nowrap text-sm">1</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  شركة كوكو ناو
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">0785155008</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  wafa@be-kite.com
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  Al Hakam Al Taleb
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  عرض سعر موقع الكتروني
                </td>
                <td
                  class="px-4 py-3 whitespace-nowrap text-sm notes-cell"
                  title="عرض سعر موقع الكتروني تعريفي"
                >
                  عرض سعر موقع الكتروني تعريفي
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">700</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">في الانتظار</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  2025-07-30 03:50 pm
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <a
                    href="https://crm.be-kite.com/backend/public/images/sliders/30-07-2517538906091811302295.pdf"
                    target="_blank"
                    class="text-blue-600 underline"
                    >عرض الملف</a
                  >
                </td>
              </tr>
              <!---->
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import AdminLayout from "@/components/Employee/EmployeeLayout.vue";

interface Client {
  id: number;
  companyName: string;
  contactName: string;
  mobile: string;
  email: string;
}

const clients = ref<Client[]>([]);
const searchQuery = ref("");
const isLoading = ref(false);
const error = ref<string | null>(null);

// Modals
const showDetailsModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const selectedClient = ref<Client | null>(null);
const clientToDelete = ref<Client | null>(null);

const isSubmitting = ref(false);
const formData = ref<Client>({
  id: 0,
  companyName: "",
  contactName: "",
  mobile: "",
  email: "",
});

const filteredClients = computed(() => {
  if (!searchQuery.value) return clients.value;
  return clients.value.filter(
    (c) =>
      c.companyName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.contactName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Fetch clients
async function fetchClients() {
  isLoading.value = true;
  error.value = null;
  try {
    const { data } = await axios.post(
      "https://crm.be-kite.com/backend/api/clients",
      {
        lang: "ar",
      }
    );
    clients.value = data.data || [];
  } catch (err) {
    error.value = "حدث خطأ أثناء تحميل العملاء";
  } finally {
    isLoading.value = false;
  }
}

function openDetails(client: Client) {
  selectedClient.value = client;
  showDetailsModal.value = true;
}

function editClient(client: Client) {
  formData.value = { ...client };
  showEditModal.value = true;
}

function confirmDelete(client: Client) {
  clientToDelete.value = client;
  showDeleteModal.value = true;
}

function closeModals() {
  showEditModal.value = false;
  showDeleteModal.value = false;
  formData.value = {
    id: 0,
    companyName: "",
    contactName: "",
    mobile: "",
    email: "",
  };
}

// Update client
async function handleUpdate() {
  if (!formData.value.id) return;
  isSubmitting.value = true;
  try {
    await axios.post(
      "https://crm.be-kite.com/backend/api/update-client",
      formData.value
    );
    const index = clients.value.findIndex((c) => c.id === formData.value.id);
    if (index !== -1) clients.value[index] = { ...formData.value };
    showEditModal.value = false;
  } catch (err) {
    console.error("Error updating client", err);
  } finally {
    isSubmitting.value = false;
  }
}

// Delete client
async function handleDelete() {
  if (!clientToDelete.value) return;
  isSubmitting.value = true;
  try {
    await axios.post("https://crm.be-kite.com/backend/api/delete-client", {
      id: clientToDelete.value.id,
    });
    clients.value = clients.value.filter(
      (c) => c.id !== clientToDelete.value!.id
    );
    showDeleteModal.value = false;
  } catch (err) {
    console.error("Error deleting client", err);
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(fetchClients);
</script>


<style scoped>
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  color: #222;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  min-width: 320px;
  max-width: 100vw;
}
.dark .modal-content {
  background: #23272f;
  color: #f3f4f6;
}
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition;
}
</style>
