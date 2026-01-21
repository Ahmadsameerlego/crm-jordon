<template>
  <div style="max-width: 100%;" class="min-h-screen bg-gray-50 dark:bg-gray-900" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
    <div class="flex">
      <!-- Sidebar -->
      <div
        class="fixed inset-y-0 z-50 transition-transform duration-300 ease-in-out"
        :class="[
          locale === 'ar' ? 'right-0' : 'left-0',
          isSidebarOpen
            ? 'translate-x-0'
            : locale === 'ar'
            ? 'translate-x-full'
            : '-translate-x-full',
        ]"
      >
        <div
          class="w-64 h-full bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700"
        >
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ $t("navigation.title") }}
              </h2>
              <button
                @click="toggleSidebar"
                class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <i class="pi pi-times text-lg"></i>
              </button>
            </div>

            <nav class="space-y-2">
              <router-link
                to="/employee/dashboard"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/employee/dashboard'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-home mr-3"></i>
                {{ $t("navigation.dashboard") }}
              </router-link>

              <router-link
                to="/employee/clients"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/employee/clients'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-users mr-3"></i>
                جميع العملاء
              </router-link>
              <router-link
                to="/employee/quotations"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/employee/quotations'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-users mr-3"></i>
                العروض
              </router-link>

              <router-link
                to="/employee/potential-clients"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/employee/potential-clients'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-user-plus mr-3"></i>
                العملاء المحتملون
              </router-link>

              <router-link
                to="/employee/real-clients"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/employee/real-clients'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-check-circle mr-3"></i>
                العملاء الحقيقيون
              </router-link>
            </nav>
          </div>
        </div>
      </div>

      <!-- Overlay -->
      <div
        v-if="isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
      ></div>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col" style="max-width: 100%;">
        <!-- Header -->
        <header
          class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
        >
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex items-center">
                <!-- Sidebar Toggle -->
                <button
                  @click="toggleSidebar"
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mr-4"
                >
                  <i class="pi pi-bars text-lg"></i>
                </button>

                <h1 class="text-2xl font-bold text-gray-900 dark:text-white hidden lg:block">
                  <slot name="title">{{ $t("dashboard.title") }} </slot>
                </h1>
              </div>

              <div class="flex items-center space-x-4 gap-3">
                <!-- Language Toggle -->
                <button
                  @click="toggleLanguage"
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :title="$t('common.language')"
                >
                  <i class="pi pi-globe text-lg"></i>
                </button>

                 <router-link
                  to="/employee/notifications"
                  class="relative p-2 rounded-lg  bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :title="$t('common.profile')"
                >
                  <i class="pi pi-bell text-lg"></i>
                  <span v-if="countNotifications > 0" class="absolute bg-red-500 rounded-full w-5 h-5 top-[-10px] left-[-10px] inline-flex items-center justify-center px-1.5">
                    {{countNotifications}}
                  </span>
                </router-link>


                <!-- Theme Toggle -->
                <button
                  @click="toggleTheme"
                  class="p-2 rounded-lg bg-gray-100  dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :title="$t('common.theme')"
                >
                  <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-lg"></i>
                </button>

                <!-- Profile Icon (optional for employee) -->
                <!--
                <router-link
                  to="/employee/profile"
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :title="$t('common.profile')"
                >
                  <i class="pi pi-user text-lg"></i>
                </router-link>
                -->

                <!-- Logout -->
                <button @click="handleLogout" class="btn-secondary">
                  <i class="pi pi-sign-out mr-2"></i>
                  {{ $t("auth.logout") }}
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Main Content Area -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8" style="max-width: 100%;">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useEmployeeAuthStore } from "@/stores/employeeAuth";
import { useTheme } from "@/composables/useTheme";
import { useI18n } from "vue-i18n";
import { set } from "@vueuse/core";
import axios from "axios";

const countNotifications = ref(0);


const router = useRouter();
const authStore = useEmployeeAuthStore();
const { isDark, toggleTheme } = useTheme();
const { locale } = useI18n();

const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleLanguage = () => {
  locale.value = locale.value === "ar" ? "en" : "ar";
};

const handleLogout = () => {

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");

  setTimeout(() => {
    window.location.reload();
  }, 500);
};

// API Methods
const fetchClients = async () => {
  try {
    const { data } = await axios.post("https://crm.be-kite.com/backend/api/client_home", {
      lang: "ar"
    },
    {
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    }
  );

      countNotifications.value = data.notification_count;
  } catch (error) {
    console.error("Error fetching clients:", error);
  }
};
onMounted(fetchClients);
</script>
