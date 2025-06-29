<template>
  <EmployeeLayout>
    <template #title>عروض الأسعار</template>

    <div class="mb-6">
      <h2 class="text-xl font-bold">عروض الأسعار - {{ clientName }}</h2>
    </div>

    <PriceOffersManager :client-id="clientId" :client-name="clientName" :is-employee="true" />
  </EmployeeLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useEmployeeClientsStore } from "@/stores/employeeClients";
import EmployeeLayout from "@/components/Employee/EmployeeLayout.vue";
import PriceOffersManager from "@/components/PriceOffersManager.vue";

const route = useRoute();
const clientsStore = useEmployeeClientsStore();

const clientId = computed(() => route.params.clientId as string);
const client = computed(() => clientsStore.getClientById(clientId.value));
const clientName = computed(() => client.value?.companyName || "غير محدد");
</script>

<style scoped>
.card {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  color: #222;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
  min-width: 320px;
  max-width: 100vw;
}
.dark .modal-content {
  background: #23272f;
  color: #f3f4f6;
}
.btn-primary {
  @apply bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition;
}
.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition;
}
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100;
}
</style>
