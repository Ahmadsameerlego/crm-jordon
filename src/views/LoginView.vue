<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 p-4"
  >
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8 animate-fade-in">
        <div
          class="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
        >
          <i class="pi pi-building text-white text-3xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">نظام إدارة العملاء</h1>
        <p class="text-gray-600 dark:text-gray-300">Customer Relationship Management</p>
      </div>

      <!-- Login Form -->
      <div class="card p-8 shadow-xl animate-slide-up">
        <h2 class="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
          {{ $t("auth.login") }}
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ $t("auth.email") }}
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              :placeholder="$t('auth.email')"
              class="input-field"
              :class="{ 'border-red-500': errors.email }"
              required
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.email }}
            </p>
          </div>

          <!-- Password Field -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              {{ $t("auth.password") }}
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              :placeholder="$t('auth.password')"
              class="input-field"
              :class="{ 'border-red-500': errors.password }"
              required
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
              {{ errors.password }}
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="btn-primary w-full py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <i class="pi pi-spin pi-spinner mr-2"></i>
              {{ $t("common.loading") }}
            </span>
            <span v-else>
              {{ $t("auth.login") }}
            </span>
          </button>
        </form>

        <!-- Demo Credentials -->
        <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
            <strong>Demo Credentials:</strong>
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Email: admin@example.com<br />
            Password: password
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useForm } from "@/composables/useForm";

const router = useRouter();
const authStore = useAuthStore();

const { formData, errors, isSubmitting, validateForm } = useForm(
  {
    email: "",
    password: "",
  },
  {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      required: true,
      minLength: 6,
    },
  }
);

const handleLogin = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    const result = await authStore.login(formData.email, formData.password);

    if (result.success) {
      router.push("/admin");
    } else {
      errors.email = result.error || "Login failed";
    }
  } catch (error) {
    errors.email = "An error occurred during login";
  } finally {
    isSubmitting.value = false;
  }
};
</script>
