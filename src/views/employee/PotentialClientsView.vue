<template>
  <EmployeeLayout>
    <template #title>العملاء المحتملون</template>
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-bold">العملاء المحتملون</h2>
      <div class="flex items-center space-x-4 space-x-reverse">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث باسم الشركة أو المسئول..."
          class="pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
        />
        <button @click="showAddModal = true" class="btn-primary">
          <i class="pi pi-plus mr-2"></i>
          إضافة عميل محتمل
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
                عروض الأسعار
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                <router-link
                  :to="`/employee/clients/${client.id}/price-offers`"
                  class="btn-secondary"
                >
                  عرض العروض ({{ getPriceOffersCount(client.id) }})
                </router-link>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link
                  :to="`/employee/clients/${client.id}/requests`"
                  class="btn-secondary mr-2"
                >
                  طلبات العميل
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Client Modal -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal-content p-4">
        <h3 class="text-lg font-semibold mb-4">إضافة عميل محتمل جديد</h3>
        <form @submit.prevent="addClient">
          <input
            v-model="form.companyName"
            placeholder="اسم الشركة"
            class="input-field mb-2"
            required
          />
          <input
            v-model="form.companyAddress"
            placeholder="عنوان الشركة"
            class="input-field mb-2"
          />
          <input
            v-model="form.contactName"
            placeholder="اسم المسئول"
            class="input-field mb-2"
            required
          />
          <input v-model="form.mobile" placeholder="رقم الجوال" class="input-field mb-2" required />
          <input v-model="form.email" placeholder="البريد" class="input-field mb-2" required />
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

// Get potential clients only
const potentialClients = computed(() =>
  clientsStore.getClientsByStatus(auth.employee?.id || "", "potential")
);

const filteredClients = computed(() => {
  if (!searchQuery.value) return potentialClients.value;
  const q = searchQuery.value.toLowerCase();
  return potentialClients.value.filter(
    (c) =>
      (c.companyName || "").toLowerCase().includes(q) ||
      (c.contactName || "").toLowerCase().includes(q) ||
      (c.mobile || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
  );
});

function getPriceOffersCount(clientId: string) {
  return clientsStore.getPriceOffersByClient(clientId).length;
}

function addClient() {
  clientsStore.addClient({
    ...form.value,
    employeeId: auth.employee?.id || "",
    status: "potential",
  });
  showAddModal.value = false;
  Object.keys(form.value).forEach((k) => ((form.value as any)[k] = ""));
}

// Inject dummy data for potential clients
if (potentialClients.value.length === 0) {
  clientsStore.clients.push(
    {
      id: "pot1",
      employeeId: auth.employee?.id || "emp1",
      companyName: "شركة المستقبل للتكنولوجيا",
      companyAddress: "الرياض، شارع الملك فهد",
      contactName: "محمد أحمد",
      mobile: "0501234567",
      email: "mohamed@future-tech.com",
      website: "https://future-tech.com",
      facebook: "futuretech",
      instagram: "futuretech_insta",
      notes: "عميل محتمل - مهتم بالخدمات التقنية",
      status: "potential",
    },
    {
      id: "pot2",
      employeeId: auth.employee?.id || "emp1",
      companyName: "مؤسسة النجاح للاستثمار",
      companyAddress: "جدة، شارع التحلية",
      contactName: "فاطمة علي",
      mobile: "0559876543",
      email: "fatima@success-invest.com",
      website: "https://success-invest.com",
      facebook: "successinvest",
      instagram: "success_invest",
      notes: "عميل محتمل - يبحث عن حلول استثمارية",
      status: "potential",
    },
    {
      id: "pot3",
      employeeId: auth.employee?.id || "emp1",
      companyName: "شركة الإبداع للإنتاج",
      companyAddress: "الدمام، شارع الملك خالد",
      contactName: "علي حسن",
      mobile: "0532468101",
      email: "ali@creativity-prod.com",
      website: "https://creativity-prod.com",
      facebook: "creativityprod",
      instagram: "creativity_prod",
      notes: "عميل محتمل - يحتاج خدمات إنتاجية",
      status: "potential",
    }
  );
}
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
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100;
}
</style>
