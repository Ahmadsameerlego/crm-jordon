import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import employeeRoutes from "./employee";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/employee/login",
      name: "EmployeeLogin",
      component: () => import("@/views/employee/LoginView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/employee",
      meta: { requiresEmployeeAuth: true },
      children: [
        {
          path: "dashboard",
          name: "EmployeeDashboard",
          component: () => import("@/views/employee/DashboardView.vue"),
        },
        {
          path: "clients",
          name: "EmployeeClients",
          component: () => import("@/views/employee/ClientsView.vue"),
        },
        {
          path: "potential-clients",
          name: "EmployeePotentialClients",
          component: () => import("@/views/employee/PotentialClientsView.vue"),
        },
        {
          path: "real-clients",
          name: "EmployeeRealClients",
          component: () => import("@/views/employee/RealClientsView.vue"),
        },
        {
          path: "clients/:clientId/requests",
          name: "ClientRequests",
          component: () => import("@/views/employee/ClientRequestsView.vue"),
          props: true,
        },
        {
          path: "clients/:clientId/price-offers",
          name: "ClientPriceOffers",
          component: () => import("@/views/employee/PriceOffersView.vue"),
          props: true,
        },
        {
          path: "notifications",
          name: "emp-notifications",
          component: () => import("@/views/employee/EmpNotificationsView.vue"),
          props: true,
        },
        {
          path: "quotations",
          name: "ClientQuotations",
          component: () => import("@/views/employee/QuotationsView.vue"),
          props: true,
        }
      ],
    },
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/LoginView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/admin",
      name: "AdminDashboard",
      component: () => import("@/views/AdminDashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/employees",
      name: "Employees",
      component: () => import("@/views/EmployeesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/departments",
      name: "Departments",
      component: () => import("@/views/AdminDepartmentsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/profile",
      name: "Profile",
      component: () => import("@/views/ProfileView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/clients",
      name: "AdminClients",
      component: () => import("@/views/AdminClientsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/deals",
      name: "AdminDeals",
      component: () => import("@/views/AdminDealsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/notifications",
      name: "Notifications",
      component: () => import("@/views/notificationView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/quotations",
      name: "Quotations",
      component: () => import("@/views/AdminQuotations.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check authentication status
  if (!authStore.isAuthenticated && authStore.token) {
    await authStore.checkAuth();
  }

  // Handle routes that require authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
    return;
  }

  // Handle routes that require guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated && to.path !== "/employee/login") {
    next("/admin");
    return;
  }

  next();
});

export default router;
