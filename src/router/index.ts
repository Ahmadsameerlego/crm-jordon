import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: "/admin/profile",
      name: "Profile",
      component: () => import("@/views/ProfileView.vue"),
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
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/admin");
    return;
  }

  next();
});

export default router;
