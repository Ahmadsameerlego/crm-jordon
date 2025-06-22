<template>
  <AdminLayout>
    <template #title>{{ $t("dashboard.title") }}</template>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Dashboard Content -->
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
                    {{ client.name }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ client.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusClass(client.status)"
                    >
                      {{ getStatusText(client.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Recent Quotations -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("dashboard.recentQuotations") }}
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Amount
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
                <tr v-for="quotation in recentQuotations" :key="quotation.id">
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ quotation.title }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
                  >
                    {{ formatCurrency(quotation.amount, quotation.currency) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getQuotationStatusClass(quotation.status)"
                    >
                      {{ getQuotationStatusText(quotation.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { Chart, registerables } from "chart.js";
import { useDashboardStore } from "@/stores/dashboard";
import { useI18n } from "vue-i18n";
import { formatCurrency } from "@/utils/export";
import AdminLayout from "@/components/AdminLayout.vue";

Chart.register(...registerables);

const dashboardStore = useDashboardStore();
const { locale } = useI18n();

const revenueChart = ref<HTMLCanvasElement>();
const conversionChart = ref<HTMLCanvasElement>();

const isLoading = computed(() => dashboardStore.isLoading);
const stats = computed(() => dashboardStore.stats);
const recentClients = computed(() => dashboardStore.recentClients);
const recentQuotations = computed(() => dashboardStore.recentQuotations);

const statsCards = computed(() => ({
  totalClients: {
    value: stats.value.totalClients,
    icon: "pi pi-users",
    bgColor: "bg-blue-500",
  },
  totalEmployees: {
    value: stats.value.totalEmployees,
    icon: "pi pi-user",
    bgColor: "bg-green-500",
  },
  totalQuotations: {
    value: stats.value.totalQuotations,
    icon: "pi pi-file",
    bgColor: "bg-yellow-500",
  },
  totalDeals: {
    value: stats.value.totalDeals,
    icon: "pi pi-check-circle",
    bgColor: "bg-purple-500",
  },
}));

const getStatusClass = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "inactive":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "prospect":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "active":
      return locale.value === 'ar' ? "نشط" : "Active";
    case "inactive":
      return locale.value === 'ar' ? "غير نشط" : "Inactive";
    case "prospect":
      return locale.value === 'ar' ? "محتمل" : "Prospect";
    default:
      return status;
  }
};

const getQuotationStatusClass = (status: string) => {
  switch (status) {
    case "accepted":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "sent":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "draft":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

const getQuotationStatusText = (status: string) => {
  switch (status) {
    case "accepted":
      return locale.value === 'ar' ? "مقبول" : "Accepted";
    case "rejected":
      return locale.value === 'ar' ? "مرفوض" : "Rejected";
    case "sent":
      return locale.value === 'ar' ? "مرسل" : "Sent";
    case "draft":
      return locale.value === 'ar' ? "مسودة" : "Draft";
    default:
      return status;
  }
};

onMounted(async () => {
  await dashboardStore.fetchDashboardData();

  // Initialize charts
  if (revenueChart.value && conversionChart.value) {
    // Revenue Chart
    new Chart(revenueChart.value, {
      type: "line",
      data: {
        labels: locale.value === 'ar' 
          ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
          : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: locale.value === 'ar' ? "الإيرادات" : "Revenue",
            data: [1200000, 1350000, 1100000, 1400000, 1250000, 1500000, 1600000, 1450000, 1700000, 1550000, 1800000, 1650000],
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
            ticks: {
              callback: function (value) {
                return formatCurrency(Number(value));
              },
            },
          },
        },
      },
    });

    // Conversion Chart
    new Chart(conversionChart.value, {
      type: "doughnut",
      data: {
        labels: locale.value === 'ar' 
          ? ["مقبول", "مرفوض", "قيد المراجعة"]
          : ["Accepted", "Rejected", "Pending"],
        datasets: [
          {
            data: [65, 20, 15],
            backgroundColor: [
              "rgb(34, 197, 94)",
              "rgb(239, 68, 68)",
              "rgb(59, 130, 246)",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
    });
  }
});
</script>
