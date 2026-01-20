<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900" :dir="locale === 'ar' ? 'rtl' : 'ltr'">
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
                to="/admin"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/admin'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-home mr-3"></i>
                {{ $t("navigation.dashboard") }}
              </router-link>

              <router-link
                to="/admin/employees"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/admin/employees'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-users mr-3"></i>
                {{ $t("navigation.employees") }}
              </router-link>

              <router-link
                to="/admin/departments"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/admin/departments'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-building mr-3"></i>
                الأقسام
              </router-link>

              <router-link
                to="/admin/clients"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/admin/clients'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-user mr-3"></i>
                {{ $t("navigation.clients") }}
              </router-link>

              <router-link
                to="/admin/quotations"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/admin/quotations'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-file mr-3"></i>
                الطلبات
              </router-link>

              <router-link
                to="/admin/deals"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                :class="[
                  $route.path === '/admin/deals'
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
                ]"
              >
                <i class="pi pi-check-circle mr-3"></i>
                {{ $t("navigation.deals") }}
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

                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
                  <slot name="title">{{ $t("dashboard.title") }}</slot>
                </h1>
              </div>

              <div class="flex items-center space-x-4">
                <!-- Language Toggle -->
                <button
                  @click="toggleLanguage"
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :title="$t('common.language')"
                >
                  <i class="pi pi-globe text-lg"></i>
                </button>

                <!-- Theme Toggle -->
                <button
                  @click="toggleTheme"
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :title="$t('common.theme')"
                >
                  <i :class="isDark ? 'pi pi-sun' : 'pi pi-moon'" class="text-lg"></i>
                </button>

                <!-- Employee Login Link -->
                <!-- <router-link
                  to="/employee/login"
                  class="p-2 rounded-lg bg-blue-100 dark:bg-blue-700 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-600 transition-colors"
                  title="تسجيل دخول الموظفين"
                >
                  <i class="pi pi-user-plus text-lg"></i>
                 تسجيل الدخول للموظفين
                </router-link> -->

                <!-- Profile Icon -->
                <router-link
                  to="/admin/notifications"
                  class="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :title="$t('common.profile')"
                >
                  <i class="pi pi-bell text-lg"></i>
                  <span v-if="countNotifications > 0" class="absolute bg-red-500 rounded-full w-5 h-5 top-[-10px] left-[-10px] inline-flex items-center justify-center px-1.5">
                    {{countNotifications}}
                  </span>
                </router-link>
                <!-- Profile Icon -->
                <router-link
                  to="/admin/profile"
                  class="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  :title="$t('common.profile')"
                >
                  <i class="pi pi-user text-lg"></i>
                </router-link>

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
        <main class="flex-1 p-4 sm:p-6 lg:p-8">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed , onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useTheme } from "@/composables/useTheme";
import { useI18n } from "vue-i18n";
import axios from 'axios';


const router = useRouter();
const authStore = useAuthStore();
const { isDark, toggleTheme } = useTheme();
const { locale } = useI18n();
const countNotifications = ref(0);
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const toggleLanguage = () => {
  locale.value = locale.value === "ar" ? "en" : "ar";
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

// Close sidebar on route change
router.afterEach(() => {
  isSidebarOpen.value = false;
});

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

<style scoped>
/* RTL specific styles */
[dir="rtl"] .pi {
  transform: scaleX(-1);
}

[dir="rtl"] .mr-3 {
  margin-right: 0;
  margin-left: 0.75rem;
}

[dir="rtl"] .mr-4 {
  margin-right: 0;
  margin-left: 1rem;
}

[dir="rtl"] .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

[dir="rtl"] .space-x-4 > * + * {
  margin-left: 0;
  margin-right: 1rem;
}

[dir="rtl"] .space-x-2 > * + * {
  margin-left: 0;
  margin-right: 0.5rem;
}

[dir="rtl"] .space-x-reverse > * + * {
  margin-left: 0;
  margin-right: 0.5rem;
}
</style>
