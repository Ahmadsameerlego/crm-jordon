import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  Department,
  CreateDepartmentRequest,
  UpdateDepartmentRequest,
} from "@/types/department";

export const useDepartmentsStore = defineStore("departments", () => {
  const departments = ref<Department[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Computed
  const getDepartments = computed(() => departments.value);

  // Actions
  const fetchDepartments = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // Mock data for now - replace with actual API call
      const mockDepartments: Department[] = [
        {
          id: "1",
          name: "قسم السوشيال ميديا",
          description: "إدارة حسابات التواصل الاجتماعي",
          manager: "أحمد محمد",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "2",
          name: "قسم البرمجة",
          description: "تطوير البرمجيات والتطبيقات",
          manager: "سارة أحمد",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
        {
          id: "3",
          name: "قسم التسويق",
          description: "استراتيجيات التسويق والإعلان",
          manager: "محمد علي",
          createdAt: "2024-01-01",
          updatedAt: "2024-01-01",
        },
      ];

      departments.value = mockDepartments;
    } catch (err) {
      error.value = "فشل في تحميل الأقسام";
      console.error("Error fetching departments:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const createDepartment = async (departmentData: CreateDepartmentRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Mock API call - replace with actual API
      const newDepartment: Department = {
        id: Date.now().toString(),
        ...departmentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      departments.value.push(newDepartment);
      return newDepartment;
    } catch (err) {
      error.value = "فشل في إنشاء القسم";
      console.error("Error creating department:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updateDepartment = async (id: string, departmentData: UpdateDepartmentRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const index = departments.value.findIndex((dept) => dept.id === id);
      if (index === -1) {
        throw new Error("القسم غير موجود");
      }

      departments.value[index] = {
        ...departments.value[index],
        ...departmentData,
        updatedAt: new Date().toISOString(),
      };

      return departments.value[index];
    } catch (err) {
      error.value = "فشل في تحديث القسم";
      console.error("Error updating department:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deleteDepartment = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const index = departments.value.findIndex((dept) => dept.id === id);
      if (index === -1) {
        throw new Error("القسم غير موجود");
      }

      departments.value.splice(index, 1);
    } catch (err) {
      error.value = "فشل في حذف القسم";
      console.error("Error deleting department:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getDepartmentById = (id: string) => {
    return departments.value.find((dept) => dept.id === id);
  };

  return {
    departments,
    isLoading,
    error,
    getDepartments,
    fetchDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentById,
  };
});
