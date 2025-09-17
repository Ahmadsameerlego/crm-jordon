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
    v-for="(stat, key, index) in stats"
    :key="key"
    class="card p-6 animate-fade-in"
    :style="{ animationDelay: `${index * 0.1}s` }"
  >
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          :class="getStatBg(key)"
        >
          <i :class="[getStatIcon(key), 'text-white']" aria-hidden="true"></i>
        </div>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
          {{ $t(`dashboard.stats.${key}`) }}
        </p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ stat }}
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
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("employees.name") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("employees.email") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.phone") }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="client in recentClients" :key="client.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ client.full_name || "—" }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ client.email_info || "—" }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    +{{ client.phone_code }} {{ client.phone_info }}
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
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.title") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.amount") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.status") }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="quotation in recentQuotations" :key="quotation.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ quotation.service_title_ar }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatCurrency(quotation.sub_total) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700">
                      {{ quotation.status_f }}
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
import { ref, onMounted } from "vue";
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { useI18n } from "vue-i18n";
import { formatCurrency } from "@/utils/export";
import AdminLayout from "@/components/AdminLayout.vue";

Chart.register(...registerables);

const { locale } = useI18n();

const revenueChart = ref<HTMLCanvasElement>();
const conversionChart = ref<HTMLCanvasElement>();

// ✅ استيت داخلي بدل store
const isLoading = ref(true);
const stats = ref<any>({});
const recentClients = ref<any[]>([]);
const recentQuotations = ref<any[]>([]);

// 🟦 جلب البيانات من الـ API
const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");
    const fd = new FormData();
    const response = await axios.post(
      "https://crm.be-kite.com/backend/api/client_home" ,
      {
        headers: {
          Authorization: token, // لو API محتاج Bearer token
        },
      }
    );

    const data = response.data?.data;
    console.log(response.data?.data)

    stats.value = {
      totalClients: data.clients_count,
      totalEmployees: data.employees_count,
      totalQuotations: data.all_offers_count,
      totalDeals: data.agree_offers_count,
      newOffers : data.new_offers_count,
      refusedOffers : data.refused_offers_count
    };
    recentClients.value = data.last_clients || [];
    recentQuotations.value = data.last_offers || [];

    // 🔥 الرسم البياني هيبني من chart_months و chart_values
    setTimeout(() => {
      if (revenueChart.value) {
      new Chart(revenueChart.value, {
        type: "line",
        data: {
          labels: data.chart_months,
          datasets: [
            {
              label: locale.value === "ar" ? "العروض" : "Offers",
              data: data.chart_values,
              borderColor: "rgb(59, 130, 246)",
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
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
    }

    if (conversionChart.value) {
      new Chart(conversionChart.value, {
        type: "doughnut",
        data: {
          labels:
            locale.value === "ar"
              ? ["مقبول", "مرفوض", "جديد"]
              : ["Accepted", "Rejected", "New"],
          datasets: [
            {
              data: [
                data.agree_offers_count,
                data.refused_offers_count,
                data.new_offers_count,
              ],
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
            legend: { position: "bottom" },
          },
        },
      });
    }
    }, 1500);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
};
// أيقونات وخلفيات لكل stat key
const statIconMap: Record<string, string> = {
  totalClients: "pi pi-users",
  totalEmployees: "pi pi-briefcase",
  totalQuotations: "pi pi-file",
  totalDeals: "pi pi-check",
  newOffers: "pi pi-clock",
  refusedOffers: "pi pi-times",
  // لو عايز تضيف مفاتيح جديدة حطها هنا
};

const statBgMap: Record<string, string> = {
  totalClients: "bg-indigo-500",
  totalEmployees: "bg-yellow-500",
  totalQuotations: "bg-blue-500",
  totalDeals: "bg-green-500",
  newOffers: "bg-primary-500",
  refusedOffers: "bg-red-500",
  // تعديل الألوان كما تحب
};

// دوال مساعدة تستدعيها من التمبلت
const getStatIcon = (key: string) => statIconMap[key] || "pi pi-info-circle";
const getStatBg = (key: string) => statBgMap[key] || "bg-primary-500";

onMounted(() => {
  fetchDashboardData();
});
</script>
