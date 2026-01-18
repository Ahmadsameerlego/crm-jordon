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

        <!-- Recent visits -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("dashboard.lastVisits") }}
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.date") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.name") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.phone") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.notes") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.status") }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="state in totalVisits" :key="state.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ state.date_time }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ state.provider_full_name}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ state.provider_phone }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ state.notes }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ state.status_f }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Recent Requires -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("dashboard.lastRequires") }}
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.date") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.name") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.phone") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.notes") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.status") }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="state in totalRequires" :key="state.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ state.date_time }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ state.provider_full_name}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ state.provider_phone }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ state.notes }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ state.status_f }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <!-- Recent follow -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ $t("dashboard.last_follows") }}
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.date") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.name") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.phone") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.notes") }}
                  </th>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {{ $t("common.status") }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="state in last_follows" :key="state.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ state.date_time }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ state.provider_full_name}}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ state.provider_phone }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ state.notes }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ state.status_f }}
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
import { useI18n } from "vue-i18n";
import { formatCurrency } from "@/utils/export";
import AdminLayout from "@/components/Employee/EmployeeLayout.vue";

const { locale } = useI18n();


// ✅ استيت داخلي بدل store
const isLoading = ref(true);
const stats = ref<any>({});
const recentClients = ref<any[]>([]);
const recentQuotations = ref<any[]>([]);
const totalVisits = ref<any[]>([]);
const totalRequires = ref<any[]>([]);
const last_follows = ref<any[]>([]);

// 🟦 جلب البيانات من الـ API
const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");
    const fd = new FormData();
    const response = await axios.post(
      "https://crm.be-kite.com/backend/api/home" , fd ,
      {
        headers: {
          Authorization: token, 
        },
      }
    );

    const data = response.data?.data;
    console.log(response.data?.data)

    stats.value = {
      totalClients: data.clients_count,
      all_visits_count: data.all_visits_count,
      all_follows_count: data.all_follows_count,
      all_requires_count: data.all_requires_count,
      all_offers_count : data.all_offers_count,
      agreedOffers : data.agree_offers_count,
      refusedOffers : data.refused_offers_count,
    };  
    recentClients.value = data.last_clients || [];
    recentQuotations.value = data.last_offers || [];
    totalVisits.value = data.last_visits || [];
    totalRequires.value = data.last_requires || [];
    last_follows.value = data.last_follows || [];

  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  } finally {
    isLoading.value = false;
  }
};
// أيقونات وخلفيات لكل stat key
const statIconMap: Record<string, string> = {
  totalClients: "pi pi-users",
  all_visits_count: "pi pi-briefcase",
  all_follows_count: "pi pi-file",
  all_requires_count: "pi pi-check",
  agreedOffers: "pi pi-clock",
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
