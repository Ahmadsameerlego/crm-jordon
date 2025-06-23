<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">تسجيل دخول الموظف</h2>
      <form @submit.prevent="login">
        <div class="mb-4">
          <input
            v-model="email"
            type="email"
            placeholder="البريد الإلكتروني"
            class="input-field"
            required
          />
        </div>
        <div class="mb-4">
          <input
            v-model="password"
            type="password"
            placeholder="كلمة المرور"
            class="input-field"
            required
          />
        </div>
        <button type="submit" class="btn-primary w-full">دخول</button>
        <div v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useEmployeeAuthStore } from "@/stores/employeeAuth";

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const auth = useEmployeeAuthStore();

function login() {
  if (auth.login(email.value, password.value)) {
    router.push("/employee/dashboard");
  } else {
    error.value = "بيانات الدخول غير صحيحة";
  }
}
</script>
