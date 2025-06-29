<template>
  <EmployeeLayout>
    <template #title>{{ $t("dashboard.title") }} </template>
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
    <div v-else class="space-y-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(stat, key, index) in statsCards"
          :key="key"
          class="card p-6 animate-fade-in"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center"
                :class="stat.bgColor"
              >
                <i :class="stat.icon" class="text-white"></i>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ $t(`dashboard.stats.${key}`) }}
              </p>
              <p class="text-2xl font-bold text-gray-900 dark:text-white">
                {{ stat.value }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Revenue Chart -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("dashboard.stats.monthlyRevenue") }}
          </h3>
          <div class="h-64">
            <canvas ref="revenueChart"></canvas>
          </div>
        </div>
        <!-- Conversion Rate Chart -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("dashboard.stats.conversionRate") }}
          </h3>
          <div class="h-64">
            <canvas ref="conversionChart"></canvas>
          </div>
        </div>
      </div>
      <!-- Tables Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Recent Clients -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("dashboard.recentClients") }}
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {{ $t("employees.name") }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {{ $t("employees.email") }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {{ $t("common.status") }}
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-for="client in recentClients" :key="client.id">
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ client.companyName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ client.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                    >
                      {{ client.status || "-" }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Recent Visits -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("dashboard.recentVisits") }}
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {{ $t("common.date") }}
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    {{ $t("common.name") }}
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
              >
                <tr v-for="visit in recentVisits" :key="visit.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ visit.dateTime }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ getClientName(visit.clientId) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </EmployeeLayout>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Chart, registerables } from "chart.js";
import { useEmployeeClientsStore } from "@/stores/employeeClients";
import { useEmployeeVisitsStore } from "@/stores/employeeVisits";
import { useEmployeeAuthStore } from "@/stores/employeeAuth";
import { useI18n } from "vue-i18n";
import EmployeeLayout from "@/components/Employee/EmployeeLayout.vue";

Chart.register(...registerables);

const clientsStore = useEmployeeClientsStore();
const visitsStore = useEmployeeVisitsStore();
const auth = useEmployeeAuthStore();
const { locale } = useI18n();

const revenueChart = ref();
const conversionChart = ref();

const isLoading = ref(false);

const myClients = computed(() => clientsStore.getClientsByEmployee(auth.employee?.id || ""));
const myVisits = computed(() =>
  visitsStore.visits.filter((v) => myClients.value.some((c) => c.id === v.clientId))
);

const statsCards = computed(() => ({
  totalClients: {
    value: myClients.value.length,
    icon: "pi pi-users",
    bgColor: "bg-blue-500",
  },
  totalVisits: {
    value: myVisits.value.length,
    icon: "pi pi-calendar",
    bgColor: "bg-green-500",
  },
  // Add more stats as needed
}));

const recentClients = computed(() => myClients.value.slice(-5).reverse());
const recentVisits = computed(() => myVisits.value.slice(-5).reverse());

function getClientName(clientId: string) {
  return clientsStore.clients.find((c) => c.id === clientId)?.companyName || "غير محدد";
}

onMounted(() => {
  // Example chart data, you can customize as needed
  if (revenueChart.value) {
    new Chart(revenueChart.value, {
      type: "line",
      data: {
        labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
        datasets: [
          {
            label: "الإيرادات",
            data: [1000, 1200, 900, 1400, 1100, 1300],
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
  if (conversionChart.value) {
    new Chart(conversionChart.value, {
      type: "doughnut",
      data: {
        labels: ["تمت", "قيد التنفيذ", "ملغاة"],
        datasets: [
          {
            label: "معدل التحويل",
            data: [60, 30, 10],
            backgroundColor: ["rgb(34,197,94)", "rgb(59,130,246)", "rgb(239,68,68)"],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });
  }
});
onMounted(() => {
  console.log("DashboardView mounted");
});
</script>
