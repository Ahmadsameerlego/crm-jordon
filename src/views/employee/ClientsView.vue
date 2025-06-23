<template>
  <EmployeeLayout>
    <template #title>{{ $t("employees.title") }}</template>
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('common.search')"
            class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
          />
          <i
            class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="showAddModal = true" class="btn-primary">
          <i class="pi pi-plus mr-2"></i>
          {{ $t("employees.addEmployee") }}
        </button>
      </div>
    </div>
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                اسم الشركة
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                اسم المسئول
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                رقم الجوال
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                البريد
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="client in filteredClients" :key="client.id">
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
              >
                {{ client.companyName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ client.contactName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ client.mobile }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ client.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link :to="`/employee/clients/${client.id}/requests`" class="btn-secondary"
                  >طلبات العميل</router-link
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="showAddModal" class="modal-overlay ">
      <div class="modal-content p-4">
        <h3 class="text-lg font-semibold mb-4">إضافة عميل جديد</h3>
        <form @submit.prevent="addClient">
          <input v-model="form.companyName" placeholder="اسم الشركة" class="input-field mb-2" />
          <input
            v-model="form.companyAddress"
            placeholder="عنوان الشركة"
            class="input-field mb-2"
          />
          <input v-model="form.contactName" placeholder="اسم المسئول" class="input-field mb-2" />
          <input v-model="form.mobile" placeholder="رقم الجوال" class="input-field mb-2" />
          <input v-model="form.email" placeholder="البريد" class="input-field mb-2" />
          <input v-model="form.website" placeholder="الموقع الالكتروني" class="input-field mb-2" />
          <input v-model="form.facebook" placeholder="فيسبوك" class="input-field mb-2" />
          <input v-model="form.instagram" placeholder="انستجرام" class="input-field mb-2" />
          <textarea v-model="form.notes" placeholder="ملاحظات" class="input-field mb-2"></textarea>
          <div class="flex justify-end space-x-2 space-x-reverse">
            <button type="button" class="btn-secondary" @click="showAddModal = false">إلغاء</button>
            <button type="submit" class="btn-primary">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  </EmployeeLayout>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useEmployeeAuthStore } from "@/stores/employeeAuth";
import { useEmployeeClientsStore } from "@/stores/employeeClients";
import EmployeeLayout from "@/components/Employee/EmployeeLayout.vue";

const auth = useEmployeeAuthStore();
const clientsStore = useEmployeeClientsStore();
const showAddModal = ref(false);
const searchQuery = ref("");
const form = ref({
  companyName: "",
  companyAddress: "",
  contactName: "",
  mobile: "",
  email: "",
  website: "",
  facebook: "",
  instagram: "",
  notes: "",
});
const myClients = computed(() => clientsStore.getClientsByEmployee(auth.employee?.id || ""));
const filteredClients = computed(() => {
  if (!searchQuery.value) return myClients.value;
  const q = searchQuery.value.toLowerCase();
  return myClients.value.filter(
    (c) =>
      (c.companyName || "").toLowerCase().includes(q) ||
      (c.contactName || "").toLowerCase().includes(q) ||
      (c.mobile || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
  );
});
function addClient() {
  clientsStore.addClient({ ...form.value, employeeId: auth.employee?.id || "" });
  showAddModal.value = false;
  Object.keys(form.value).forEach((k) => (form.value[k] = ""));
}
</script>
