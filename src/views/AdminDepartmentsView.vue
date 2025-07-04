<template>
  <AdminLayout>
    <template #title>الأقسام</template>

    <!-- Header Actions -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center space-x-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="البحث في الأقسام..."
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
          تصدير البيانات
        </button>
        <button @click="showAddModal = true" class="btn-primary">
          <i class="pi pi-plus mr-2"></i>
          إضافة قسم جديد
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card p-6">
      <div class="text-center text-red-600 dark:text-red-400">
        <i class="pi pi-exclamation-triangle text-2xl mb-2"></i>
        <p>{{ error }}</p>
        <button @click="fetchDepartments" class="btn-primary mt-4">إعادة المحاولة</button>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                @click="sortBy('name')"
              >
                اسم القسم
                <i
                  v-if="sortField === 'name'"
                  :class="sortOrder === 'asc' ? 'pi pi-sort-up' : 'pi pi-sort-down'"
                  class="mr-1"
                ></i>
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                الوصف
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                المدير
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                تاريخ الإنشاء
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                إجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="department in filteredDepartments"
              :key="department.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div
                      class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                    >
                      <i class="pi pi-building text-primary-600 dark:text-primary-400"></i>
                    </div>
                  </div>
                  <div class="mr-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ department.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 dark:text-white">
                {{ department.description || "لا يوجد وصف" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ department.manager || "غير محدد" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(department.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2 space-x-reverse">
                  <button
                    @click="editDepartment(department)"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                    title="تعديل"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                  <button
                    @click="deleteDepartment(department)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    title="حذف"
                  >
                    <i class="pi pi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredDepartments.length === 0" class="text-center py-12">
        <i class="pi pi-building text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-500 dark:text-gray-400">لا توجد أقسام</p>
      </div>
    </div>

    <!-- Add/Edit Department Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay">
      <div class="modal-content p-6 max-w-md">
        <h3 class="text-lg font-semibold mb-4">
          {{ showEditModal ? "تعديل القسم" : "إضافة قسم جديد" }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              اسم القسم *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="مثال: قسم السوشيال ميديا"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              الوصف
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="وصف مختصر للقسم"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              المدير
            </label>
            <input
              v-model="formData.manager"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="اسم مدير القسم"
            />
          </div>

          <div class="flex justify-end space-x-3 space-x-reverse">
            <button type="button" @click="closeModal" class="btn-secondary">إلغاء</button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
              {{ showEditModal ? "تحديث" : "إضافة" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal-content p-6 max-w-md">
        <h3 class="text-lg font-semibold mb-4">تأكيد الحذف</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          هل أنت متأكد من حذف القسم "{{ departmentToDelete?.name }}"؟ هذا الإجراء لا يمكن التراجع
          عنه.
        </p>
        <div class="flex justify-end space-x-3 space-x-reverse">
          <button @click="showDeleteModal = false" class="btn-secondary">إلغاء</button>
          <button @click="confirmDelete" class="btn-danger" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="animate-spin mr-2">⏳</span>
            حذف
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useDepartmentsStore } from "@/stores/departments";
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/types/department";
import AdminLayout from "@/components/AdminLayout.vue";

const departmentsStore = useDepartmentsStore();

// Reactive data
const searchQuery = ref("");
const sortField = ref<keyof Department>("name");
const sortOrder = ref<"asc" | "desc">("asc");
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const isSubmitting = ref(false);
const editingDepartment = ref<Department | null>(null);
const departmentToDelete = ref<Department | null>(null);

const formData = ref<CreateDepartmentRequest>({
  name: "",
  description: "",
  manager: "",
});

// Computed
const isLoading = computed(() => departmentsStore.isLoading);
const error = computed(() => departmentsStore.error);
const departments = computed(() => departmentsStore.getDepartments);

const filteredDepartments = computed(() => {
  let filtered = departments.value;

  if (searchQuery.value) {
    filtered = filtered.filter(
      (dept) =>
        dept.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (dept.description &&
          dept.description.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        (dept.manager && dept.manager.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }

  // Sort
  filtered.sort((a, b) => {
    const aValue = a[sortField.value];
    const bValue = b[sortField.value];

    if (sortOrder.value === "asc") {
      return (aValue || "") > (bValue || "") ? 1 : -1;
    } else {
      return (aValue || "") < (bValue || "") ? 1 : -1;
    }
  });

  return filtered;
});

// Methods
const fetchDepartments = async () => {
  await departmentsStore.fetchDepartments();
};

const sortBy = (field: keyof Department) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortOrder.value = "asc";
  }
};

const resetForm = () => {
  formData.value = {
    name: "",
    description: "",
    manager: "",
  };
  editingDepartment.value = null;
};

const closeModal = () => {
  showAddModal.value = false;
  showEditModal.value = false;
  resetForm();
};

const editDepartment = (department: Department) => {
  editingDepartment.value = department;
  formData.value = {
    name: department.name,
    description: department.description || "",
    manager: department.manager || "",
  };
  showEditModal.value = true;
};

const deleteDepartment = (department: Department) => {
  departmentToDelete.value = department;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  if (!departmentToDelete.value) return;

  isSubmitting.value = true;
  try {
    await departmentsStore.deleteDepartment(departmentToDelete.value.id);
    showDeleteModal.value = false;
    departmentToDelete.value = null;
  } catch (err) {
    console.error("Error deleting department:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (showEditModal.value && editingDepartment.value) {
      await departmentsStore.updateDepartment(
        editingDepartment.value.id,
        formData.value as UpdateDepartmentRequest
      );
    } else {
      await departmentsStore.createDepartment(formData.value);
    }
    closeModal();
  } catch (err) {
    console.error("Error submitting form:", err);
  } finally {
    isSubmitting.value = false;
  }
};

const exportData = () => {
  // Implement export functionality
  console.log("Exporting departments data...");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ar-EG");
};

// Lifecycle
onMounted(() => {
  fetchDepartments();
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
}

.dark .modal-content {
  background: #1f2937;
  color: white;
}
</style>
