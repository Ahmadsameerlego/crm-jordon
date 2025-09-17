<template>
  <AdminLayout>
    <template #title>العملاء</template>

    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <h2 class="text-xl font-bold">كل العملاء</h2>
      <div class="flex flex-col md:flex-row gap-2 items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث باسم الشركة أو المسئول..."
          class="pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="card p-6 text-center text-red-600 dark:text-red-400">
      <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
      <p>{{ error }}</p>
      <button @click="fetchClients" class="btn-primary mt-4">إعادة المحاولة</button>
    </div>

    <!-- Clients Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم الشركة</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم المسئول</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">رقم الجوال</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم الموظف</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">إجراءات</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200">
            <tr v-for="client in filteredClients" :key="client.id">
              <td class="px-6 py-4 text-sm font-medium">{{ client.first_name }}</td>
              <td class="px-6 py-4 text-sm">{{ client.full_name }}</td>
              <td class="px-6 py-4 text-sm">{{ client.phone_info }}</td>
              <td class="px-6 py-4 text-sm">{{ client.upload_by_name }}</td>
              <td class="px-6 py-4 text-sm font-medium flex gap-2">
                <button class="btn-secondary" @click="openDetails(client)">عرض</button>
                <button class="btn-primary" @click="editClient(client)">تعديل</button>
                <button class="btn-danger" @click="confirmDelete(client)">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty -->
      <div v-if="filteredClients.length === 0" class="text-center py-12">
        <i class="pi pi-users text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-500">لا يوجد عملاء</p>
      </div>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay">
      <div class="modal-content p-6 max-w-2xl">
        <h3 class="text-lg font-semibold mb-4">تفاصيل العميل</h3>
        <p><strong>اسم الشركة:</strong> {{ selectedClient?.companyName }}</p>
        <p><strong>اسم المسئول:</strong> {{ selectedClient?.contactName }}</p>
        <p><strong>الجوال:</strong> {{ selectedClient?.mobile }}</p>
        <p><strong>البريد:</strong> {{ selectedClient?.email }}</p>
        <div class="flex justify-end mt-4">
          <button class="btn-secondary" @click="showDetailsModal = false">إغلاق</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content p-6 max-w-md">
        <h3 class="text-lg font-semibold mb-4">تعديل العميل</h3>
        <form @submit.prevent="handleUpdate">
          <input v-model="formData.companyName" placeholder="اسم الشركة" class="input mb-3" required />
          <input v-model="formData.contactName" placeholder="اسم المسئول" class="input mb-3" required />
          <input v-model="formData.mobile" placeholder="الجوال" class="input mb-3" required />
          <input v-model="formData.email" placeholder="البريد" class="input mb-3" />
          <div class="flex justify-end gap-2">
            <button type="button" class="btn-secondary" @click="closeModals">إلغاء</button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span> تحديث
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content p-6 max-w-md">
        <h3 class="text-lg font-semibold mb-4">تأكيد الحذف</h3>
        <p class="mb-4">هل تريد حذف العميل <b>{{ clientToDelete?.companyName }}</b>؟</p>
        <div class="flex justify-end gap-2">
          <button class="btn-secondary" @click="showDeleteModal = false">إلغاء</button>
          <button class="btn-danger" @click="handleDelete" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span> حذف
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import AdminLayout from "@/components/AdminLayout.vue";

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
    const { data } = await axios.post("https://crm.be-kite.com/backend/api/clients", {
      lang: "ar",
    });
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
  formData.value = { id: 0, companyName: "", contactName: "", mobile: "", email: "" };
}

// Update client
async function handleUpdate() {
  if (!formData.value.id) return;
  isSubmitting.value = true;
  try {
    await axios.post("https://crm.be-kite.com/backend/api/update-client", formData.value);
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
    clients.value = clients.value.filter((c) => c.id !== clientToDelete.value!.id);
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
