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
            class="pl-10 pr-2  py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
          />
          <i
            class="pi pi-search absolute left-2 right-auto top-3 transform -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>
      <div class="flex items-center space-x-4">
        <button @click="exportData" class="btn-secondary mx-3">
          <i class="pi pi-download mr-2"></i>
          {{ $t("table.export") }}
        </button>
        <button @click="showAddModal = true" class="btn-primary mx-3">
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
                المسمى الوظيفي
                <i
                  v-if="sortField === 'position'"
                  :class="sortOrder === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'"
                  class="mr-1"
                ></i>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('departmentName')"
              >
                القسم
                <i
                  v-if="sortField === 'departmentName'"
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
              v-for="employee in filteredEmployees"
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ employee.departmentName || "غير محدد" }}
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
      <!-- <div
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
      </div> -->
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
                المسمى الوظيفي
              </label>
              <input
                v-model="formData.position"
                type="text"
                class="input-field"
                :class="{ 'border-red-500': errors.position }"
                required
                placeholder="مثال: مدير مبيعات، مطور برمجيات"
              />
              <p v-if="errors.position" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.position }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                القسم
              </label>
              <select
                v-model="formData.departmentId"
                class="input-field"
                :class="{ 'border-red-500': errors.departmentId }"
                required
              >
                <option value="">اختر القسم</option>
                <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                  {{ dept.name }}
                </option>
              </select>
              <p v-if="errors.departmentId" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errors.departmentId }}
              </p>
            </div>

            <div >
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                كلمة المرور
              </label>
              <input
                v-model="formData.password"
                type="text"
                class="input-field"
                placeholder="اتركها فارغة لتوليد كلمة مرور عشوائية"
              />
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                إذا تركتها فارغة، سيتم توليد كلمة مرور عشوائية
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

            <div v-if="errorMessages">
              <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ errorMessages }}
              </p>
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

    <!-- Success Modal for New Employee -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content p-6 max-w-md">
        <div class="text-center">
          <i class="pi pi-check-circle text-4xl text-green-500 mb-4"></i>
          <h3 class="text-lg font-semibold mb-2">تم إضافة الموظف بنجاح</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">
            تم إنشاء حساب للموظف الجديد. يرجى حفظ بيانات الدخول التالية:
          </p>
          <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
            <p><strong>البريد الإلكتروني:</strong> {{ newEmployeeData.email }}</p>
            <p><strong>كلمة المرور:</strong> {{ newEmployeeData.password }}</p>
          </div>
          <button @click="showSuccessModal = false" class="btn-primary">تم</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useDepartmentsStore } from "@/stores/departments";
import { useForm } from "@/composables/useForm";
import { exportToCSV, exportToXLSX } from "@/utils/export";
import type { Employee } from "@/types/employee";
import AdminLayout from "@/components/AdminLayout.vue";

// Stores
const departmentsStore = useDepartmentsStore();

// Table state
const employees = ref<Employee[]>([]);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortField = ref<keyof Employee>("name");
const sortOrder = ref<"asc" | "desc">("asc");
const errorMessages = ref("");
// Modal state
const showAddModal = ref(false);
const showEditModal = ref(false);
const showSuccessModal = ref(false);
const editingEmployee = ref<Employee | null>(null);
const newEmployeeData = ref<{ email: string; password: string }>({ email: "", password: "" });

// Form state
const { formData, errors, isSubmitting, validateForm, resetForm } = useForm(
  {
    name: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    position: "",
    departmentId: "",
    profilePicture: "",
  },
  {
    name: { required: true, minLength: 2 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: true, minLength: 7 },
    city: { required: true },
    position: { required: true },
    departmentId: { required: true },
  }
);

// Fetch employees
const fetchEmployees = async () => {
  try {
    const { data } = await axios.post("https://crm.be-kite.com/backend/api/employees", { params: { lang: "ar" } });
    employees.value = data.data.map((emp: any) => ({
      id: emp.id,
      name: emp.first_name,
      email: emp.email,
      phone: emp.phone,
      city: emp.city,
      position: emp.job,
      departmentName: emp.section_title,
      departmentId: emp.section_id,
      profilePicture: emp.avatar_photo,
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
  }
};

// fetch departments 
const departments = ref<Array<{ id: number; name: string; description: string; manager: string; createdAt: string }>>([]);
const fetchDepartments = async () => {
  try {
    const { data } = await axios.post(
      "https://crm.be-kite.com/backend/api/sections?lang=ar"
    );

    departments.value = data.data.map((d: any) => ({
      id: d.id,
      name: d.title,
      description: d.desc,
      manager: d.manager,
      createdAt: d.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching departments:", error);
  }
};

// Add employee
const addEmployee = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  try {
    const payload = {
      lang: "ar",
      user_type: "employee",
      first_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      section_id: formData.departmentId,
      job: formData.position,
      password: formData.password,
      photo: formData.profilePicture,
    };

    const { data } = await axios.post("https://crm.be-kite.com/backend/api/register", payload);

    if (data.key===1 ) {
      newEmployeeData.value = {
        email: formData.email,
        password: data.password,
      };
      showSuccessModal.value = true;
          await fetchEmployees();
    closeModal();

    }else{
      errorMessages.value = data.msg || "حدث خطأ ما";
    }

  } catch (error) {
    console.error("Error adding employee:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Update employee
const updateEmployee = async () => {
  if (!validateForm() || !editingEmployee.value) return;

  isSubmitting.value = true;
  try {
    const payload = {
      user_id: editingEmployee.value.id,
      first_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: formData.city,
      section_id: formData.departmentId,
      job: formData.position,
      password: formData.password,
      photo: formData.profilePicture,
    };

   const {data} =  await axios.post("https://crm.be-kite.com/backend/api/update-user", payload);
   if (data.key===1 ) {
     await fetchEmployees();
     closeModal();
   }else{
     errorMessages.value = data.msg || "حدث خطأ ما";
   }
  } catch (error) {
    console.error("Error updating employee:", error);
  } finally {
    isSubmitting.value = false;
  }
};
const handleSubmit = async () => {
  console.log("Submitting form...");
  if (showEditModal.value) {
    await updateEmployee();
  } else {
    await addEmployee();
  }
};
// Delete employee
const deleteEmployee = async (id: number) => {
  if (!confirm("هل أنت متأكد أنك تريد حذف هذا الموظف؟")) return;

  try {
   const {data} = await axios.post("https://crm.be-kite.com/backend/api/destroy-user", { user_id: id });

   if (data.key===1 ) {
     await fetchEmployees();
   }else{
     errorMessages.value = data.msg || "حدث خطأ ما";
   }
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
};

// Edit modal
const editEmployee = (employee: Employee) => {
  editingEmployee.value = employee;
  formData.name = employee.name;
  formData.email = employee.email;
  formData.phone = employee.phone;
  formData.city = employee.city;
  formData.position = employee.position;
  formData.departmentId = employee.departmentId;
  formData.profilePicture = employee.profilePicture || "";
  showEditModal.value = true;
};

// Pagination + Sorting
const filteredEmployees = computed(() => {
  let filtered = employees.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.email.toLowerCase().includes(query) ||
        e.phone.includes(query) ||
        e.city?.toLowerCase().includes(query) ||
        e.position.toLowerCase().includes(query) ||
        (e.departmentName && e.departmentName.toLowerCase().includes(query))
    );
  }

  filtered.sort((a, b) => {
    const aValue = a[sortField.value];
    const bValue = b[sortField.value];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder.value === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return 0;
  });

  return filtered;
});

const totalItems = computed(() => filteredEmployees.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value));

const paginatedEmployees = computed(() => filteredEmployees.value.slice(startIndex.value, endIndex.value));

const sortBy = (field: keyof Employee) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  editingEmployee.value = null;
  resetForm();
};

// Export
const exportData = () => {
  const data = employees.value.map((employee) => ({
    Name: employee.name,
    Email: employee.email,
    Phone: employee.phone,
    City: employee.city,
    Position: employee.position,
    Department: employee.departmentName || "غير محدد",
  }));
  exportToCSV(data, "employees");
  exportToXLSX(data, "employees");
};

onMounted(async () => {
  await Promise.all([fetchEmployees(), departmentsStore.fetchDepartments()]);
  await fetchDepartments();
});
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
  max-width: 500px;
  width: 90%;
}

.dark .modal-content {
  background: #1f2937;
  color: white;
}

.input-field {
  @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100;
}
</style>
