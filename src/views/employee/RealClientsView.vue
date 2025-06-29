<template>
  <EmployeeLayout>
    <template #title>العملاء الحقيقيون</template>
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-bold">العملاء الحقيقيون</h2>
      <div class="flex items-center space-x-4 space-x-reverse">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث باسم الشركة أو المسئول..."
          class="pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
        />
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
  </EmployeeLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useEmployeeAuthStore } from "@/stores/employeeAuth";
import { useEmployeeClientsStore } from "@/stores/employeeClients";
import EmployeeLayout from "@/components/Employee/EmployeeLayout.vue";

const auth = useEmployeeAuthStore();
const clientsStore = useEmployeeClientsStore();
const searchQuery = ref("");

// Get real clients only
const realClients = computed(() =>
  clientsStore.getClientsByStatus(auth.employee?.id || "", "real")
);

const filteredClients = computed(() => {
  if (!searchQuery.value) return realClients.value;
  const q = searchQuery.value.toLowerCase();
  return realClients.value.filter(
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

// Inject dummy data for real clients
if (realClients.value.length === 0) {
  clientsStore.clients.push(
    {
      id: "real1",
      employeeId: auth.employee?.id || "emp1",
      companyName: "شركة التميز للخدمات",
      companyAddress: "الرياض، شارع العليا",
      contactName: "أحمد محمد",
      mobile: "0501111111",
      email: "ahmed@excellence.com",
      website: "https://excellence.com",
      facebook: "excellence_services",
      instagram: "excellence_insta",
      notes: "عميل حقيقي - خدمات مستمرة",
      status: "real",
    },
    {
      id: "real2",
      employeeId: auth.employee?.id || "emp1",
      companyName: "مؤسسة الابتكار المتقدم",
      companyAddress: "جدة، شارع التحلية",
      contactName: "سارة خالد",
      mobile: "0552222222",
      email: "sara@innovation.com",
      website: "https://innovation.com",
      facebook: "innovation_adv",
      instagram: "innovation_insta",
      notes: "عميل حقيقي - مشاريع متقدمة",
      status: "real",
    },
    {
      id: "real3",
      employeeId: auth.employee?.id || "emp1",
      companyName: "شركة النجاح المضمون",
      companyAddress: "الدمام، شارع الملك خالد",
      contactName: "خالد علي",
      mobile: "0533333333",
      email: "khaled@success.com",
      website: "https://success.com",
      facebook: "success_guaranteed",
      instagram: "success_insta",
      notes: "عميل حقيقي - شراكة طويلة المدى",
      status: "real",
    }
  );
}
</script>

<style scoped>
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition;
}
</style>
