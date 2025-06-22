<template>
  <AdminLayout>
    <template #title>{{ $t("employees.title") }}</template>

    <!-- Header Actions -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="$t('common.search')"
            class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
          />
          <i
            class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="exportData" class="btn-secondary">
          <i class="pi pi-download mr-2"></i>
          {{ $t("table.export") }}
        </button>
        <button @click="showAddModal = true" class="btn-primary">
          <i class="pi pi-plus mr-2"></i>
          {{ $t("employees.addEmployee") }}
        </button>
      </div>
    </div>

    <!-- Data Table -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('name')"
              >
                {{ $t("employees.name") }}
                <i
                  v-if="sortField === 'name'"
                  :class="sortOrder === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'"
                  class="mr-1"
                ></i>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('email')"
              >
                {{ $t("employees.email") }}
                <i
                  v-if="sortField === 'email'"
                  :class="sortOrder === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'"
                  class="mr-1"
                ></i>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('phone')"
              >
                {{ $t("employees.phone") }}
                <i
                  v-if="sortField === 'phone'"
                  :class="sortOrder === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'"
                  class="mr-1"
                ></i>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('city')"
              >
                {{ $t("employees.city") }}
                <i
                  v-if="sortField === 'city'"
                  :class="sortOrder === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'"
                  class="mr-1"
                ></i>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('position')"
              >
                {{ $t("employees.position") }}
                <i
                  v-if="sortField === 'position'"
                  :class="sortOrder === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'"
                  class="mr-1"
                ></i>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {{ $t("common.actions") }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="employee in employees"
              :key="employee.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      v-if="employee.profilePicture"
                      :src="employee.profilePicture"
                      :alt="employee.name"
                      class="h-10 w-10 rounded-full object-cover"
                    />
                    <div
                      v-else
                      class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                    >
                      <i class="pi pi-user text-primary-600 dark:text-primary-400"></i>
                    </div>
                  </div>
                  <div class="mr-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ employee.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ employee.position }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.city }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.position }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button
                    @click="editEmployee(employee)"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    @click="deleteEmployee(employee.id)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="bg-white dark:bg-gray-800 px-4 py-3 border-t border-gray-200 dark:border-gray-700 sm:px-6"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t("table.previous") }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              class="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ $t("table.next") }}
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ $t("table.showing") }}
                <span class="font-medium">{{ startIndex + 1 }}</span>
                {{ $t("table.to") }}
                <span class="font-medium">{{ endIndex }}</span>
                {{ $t("table.of") }}
                <span class="font-medium">{{ totalItems }}</span>
                {{ $t("table.results") }}
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="pi pi-chevron-right"></i>
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    page === currentPage
                      ? 'z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i class="pi pi-chevron-left"></i>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Employee Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {{ showEditModal ? $t("employees.editEmployee") : $t("employees.addEmployee") }}
          </h3>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t("employees.name") }}
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="input-field"
                :class="{ 'border-red-500': errors.name }"
                required
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t("employees.email") }}
              </label>
              <input
                v-model="formData.email"
                type="email"
                class="input-field"
                :class="{ 'border-red-500': errors.email }"
                required
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t("employees.phone") }}
              </label>
              <input
                v-model="formData.phone"
                type="tel"
                class="input-field"
                :class="{ 'border-red-500': errors.phone }"
                required
              />
              <p v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.phone }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t("employees.city") }}
              </label>
              <input
                v-model="formData.city"
                type="text"
                class="input-field"
                :class="{ 'border-red-500': errors.city }"
                required
              />
              <p v-if="errors.city" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.city }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t("employees.position") }}
              </label>
              <input
                v-model="formData.position"
                type="text"
                class="input-field"
                :class="{ 'border-red-500': errors.position }"
                required
              />
              <p v-if="errors.position" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.position }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {{ $t("employees.profilePicture") }}
              </label>
              <input
                v-model="formData.profilePicture"
                type="url"
                class="input-field"
                :placeholder="$t('employees.profilePicturePlaceholder')"
              />
            </div>

            <div class="flex justify-end space-x-3 space-x-reverse pt-4">
              <button type="button" @click="closeModal" class="btn-secondary">
                {{ $t("common.cancel") }}
              </button>
              <button type="submit" class="btn-primary" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="flex items-center justify-center">
                  <i class="pi pi-spin pi-spinner mr-2"></i>
                  {{ $t("common.loading") }}
                </span>
                <span v-else>
                  {{ showEditModal ? $t("common.update") : $t("common.save") }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useEmployeesStore } from "@/stores/employees";
import { useForm } from "@/composables/useForm";
import { exportToCSV, exportToXLSX } from "@/utils/export";
import type { Employee } from "@/types/employee";
import AdminLayout from "@/components/AdminLayout.vue";

const employeesStore = useEmployeesStore();

// Table state
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortField = ref<keyof Employee>("name");
const sortOrder = ref<"asc" | "desc">("asc");

// Modal state
const showAddModal = ref(false);
const showEditModal = ref(false);
const editingEmployee = ref<Employee | null>(null);

// Form state
const { formData, errors, isSubmitting, validateForm, resetForm } = useForm(
  {
    name: "",
    email: "",
    phone: "",
    city: "",
    position: "",
    profilePicture: "",
    department: "",
    hireDate: "",
    status: "active",
  },
  {
    name: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: true, minLength: 10 },
    city: { required: true },
    position: { required: true },
    department: { required: true },
    hireDate: { required: true },
    status: { required: true },
  }
);

// Computed properties
const filteredEmployees = computed(() => {
  let filtered = employeesStore.employees;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (employee) =>
        employee.name.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.phone.includes(query) ||
        employee.city.toLowerCase().includes(query) ||
        employee.position.toLowerCase().includes(query)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    const aValue = a[sortField.value];
    const bValue = b[sortField.value];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder.value === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return 0;
  });

  return filtered;
});

const totalItems = computed(() => filteredEmployees.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value));

const employees = computed(() => {
  return filteredEmployees.value.slice(startIndex.value, endIndex.value);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;

  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    const start = Math.max(1, currentPage.value - 2);
    const end = Math.min(totalPages.value, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }

  return pages;
});

// Methods
const sortBy = (field: keyof Employee) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

const goToPage = (page: number) => {
  currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const exportData = () => {
  const data = filteredEmployees.value.map((employee) => ({
    Name: employee.name,
    Email: employee.email,
    Phone: employee.phone,
    City: employee.city,
    Position: employee.position,
    Department: employee.department,
    HireDate: employee.hireDate,
    Status: employee.status,
  }));

  exportToCSV(data, "employees");
  exportToXLSX(data, "employees");
};

const editEmployee = (employee: Employee) => {
  editingEmployee.value = employee;
  formData.name = employee.name;
  formData.email = employee.email;
  formData.phone = employee.phone;
  formData.city = employee.city;
  formData.position = employee.position;
  formData.profilePicture = employee.profilePicture || "";
  formData.department = employee.department;
  formData.hireDate = employee.hireDate;
  formData.status = employee.status;
  showEditModal.value = true;
};

const deleteEmployee = async (id: string) => {
  if (confirm("Are you sure you want to delete this employee?")) {
    await employeesStore.deleteEmployee(id);
  }
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;

  try {
    if (showEditModal.value && editingEmployee.value) {
      await employeesStore.updateEmployee(editingEmployee.value.id, formData as Partial<Employee>);
    } else {
      await employeesStore.addEmployee(
        formData as Omit<Employee, "id" | "createdAt" | "updatedAt">
      );
    }

    closeModal();
  } catch (error) {
    console.error("Error saving employee:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingEmployee.value = null;
  resetForm();
};

onMounted(async () => {
  await employeesStore.getEmployees();
});
</script>
