import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { User } from "@/types";
import authService from "@/services/authService";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem("token"));
  const isLoading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  const login = async (userType: "admin" | "employee", email: string, password: string) => {
    isLoading.value = true;
    try {
      const response = await authService.login(userType, email, password);

      user.value = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: userType,
        createdAt: response.user.createdAt,
      };

      token.value = response.token;
      localStorage.setItem("token", response.token);

      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
  };

  const checkAuth = async () => {
    if (!token.value) return false;

    try {
      // Simulate API call to verify token
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock user data
      const mockUser: User = {
        id: "1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
        createdAt: new Date().toISOString(),
      };

      user.value = mockUser;
      return true;
    } catch (error) {
      logout();
      return false;
    }
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    checkAuth,
  };
});
