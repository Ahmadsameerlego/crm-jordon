<template>
  <AdminLayout>
    <template #title>الصفقات</template>
    <div class="mb-6 flex justify-between items-center">
      <h2 class="text-xl font-bold">الصفقات - العملاء الحقيقيون</h2>
    </div>
    <div class="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div class="flex flex-col md:flex-row gap-2 items-center">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="ابحث باسم الشركة أو المسئول..."
          class="pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
        />
        <select
          v-model="selectedEmployee"
          class="pl-3 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">كل الموظفين</option>
          <option v-for="emp in employeeNames" :key="emp.id" :value="emp.id">
            {{ emp.name }}
          </option>
        </select>
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
                <button class="btn-secondary" @click="openPriceOffersModal(client)">
                  عرض العروض ({{ getPriceOffersCount(client.id) }})
                </button>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button class="btn-secondary" @click="openDetails(client)">عرض التفاصيل</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Client Details Modal -->
    <div v-if="showDetailsModal" class="modal-overlay">
      <div class="modal-content p-4 max-w-2xl">
        <h3 class="text-lg font-semibold mb-4">تفاصيل العميل</h3>
        <div class="mb-4">
          <strong>اسم الشركة:</strong> {{ selectedClient?.companyName }}<br />
          <strong>اسم المسئول:</strong> {{ selectedClient?.contactName }}<br />
          <strong>رقم الجوال:</strong> {{ selectedClient?.mobile }}<br />
          <strong>البريد:</strong> {{ selectedClient?.email }}<br />
        </div>
        <div class="mb-4">
          <h4 class="font-bold mb-2">الزيارات</h4>
          <ul class="list-disc pl-6">
            <li v-for="visit in getVisits(selectedClient?.id || '')" :key="visit.id">
              {{ visit.dateTime }} - {{ visit.report || "لا يوجد تقرير" }}
            </li>
            <li v-if="getVisits(selectedClient?.id || '').length === 0">لا يوجد زيارات</li>
          </ul>
        </div>
        <div class="mb-4">
          <h4 class="font-bold mb-2">المتطلبات</h4>
          <ul class="list-disc pl-6">
            <li v-for="req in getRequirements(selectedClient?.id || '')" :key="req.id">
              {{ req.service }} - {{ req.description }}
            </li>
            <li v-if="getRequirements(selectedClient?.id || '').length === 0">لا يوجد متطلبات</li>
          </ul>
        </div>
        <div class="flex justify-end">
          <button class="btn-secondary" @click="showDetailsModal = false">إغلاق</button>
        </div>
      </div>
    </div>

    <!-- Price Offers Modal -->
    <div v-if="showPriceOffersModal" class="modal-overlay">
      <div class="modal-content p-4 max-w-6xl h-5/6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">عروض الأسعار - {{ selectedClient?.companyName }}</h3>
          <button @click="showPriceOffersModal = false" class="text-gray-500 hover:text-gray-700">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        <div class="h-full overflow-y-auto">
          <PriceOffersManager
            :client-id="selectedClient?.id || ''"
            :client-name="selectedClient?.companyName || ''"
            :is-employee="false"
          />
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import AdminLayout from "@/components/AdminLayout.vue";
import type { Client } from "@/types/client";
import { useEmployeeClientsStore } from "@/stores/employeeClients";
import { useEmployeeVisitsStore } from "@/stores/employeeVisits";
import { useEmployeeRequirementsStore } from "@/stores/employeeRequirements";
import PriceOffersManager from "@/components/PriceOffersManager.vue";

const clientsStore = useEmployeeClientsStore();
const visitsStore = useEmployeeVisitsStore();
const reqsStore = useEmployeeRequirementsStore();

const searchQuery = ref("");
const selectedEmployee = ref("");

// Get only real clients
const realClients = computed(() => clientsStore.clients.filter((c) => c.status === "real"));

// Unique employee names for dropdown (fake for demo)
const employeeNames = computed(() => {
  const map: Record<string, string> = {
    emp1: "أحمد علي",
    emp2: "سارة محمد",
    emp3: "خالد سعيد",
  };
  return Array.from(new Set(realClients.value.map((c) => c.employeeId))).map((id) => ({
    id,
    name: map[id as keyof typeof map] || id,
  }));
});

const filteredClients = computed(() => {
  let result = realClients.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (c) =>
        (c.companyName || "").toLowerCase().includes(q) ||
        (c.contactName || "").toLowerCase().includes(q)
    );
  }
  if (selectedEmployee.value) {
    result = result.filter((c) => c.employeeId === selectedEmployee.value);
  }
  return result;
});

const showDetailsModal = ref(false);
const showPriceOffersModal = ref(false);
const selectedClient = ref<Client | null>(null);

function openDetails(client: Client) {
  selectedClient.value = client;
  showDetailsModal.value = true;
}

function openPriceOffersModal(client: Client) {
  selectedClient.value = client;
  showPriceOffersModal.value = true;
}

function getVisits(clientId: string) {
  return visitsStore.visits.filter((v) => v.clientId === clientId);
}

function getRequirements(clientId: string) {
  return reqsStore.requirements.filter((r) => r.clientId === clientId);
}

function getPriceOffers(clientId: string) {
  return clientsStore.getPriceOffersByClient(clientId);
}

function getPriceOffersCount(clientId: string) {
  return clientsStore.getPriceOffersByClient(clientId).length;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ar-SA");
}

function getStatusText(status: string) {
  const statuses = {
    pending: "معلق",
    accepted: "مقبول",
    rejected: "مرفوض",
    completed: "مكتمل",
  };
  return statuses[status as keyof typeof statuses] || status;
}

function getStatusClass(status: string) {
  const classes = {
    pending: "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs",
    accepted: "bg-green-100 text-green-800 px-2 py-1 rounded text-xs",
    rejected: "bg-red-100 text-red-800 px-2 py-1 rounded text-xs",
    completed: "bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs",
  };
  return classes[status as keyof typeof classes] || "";
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
</style>
