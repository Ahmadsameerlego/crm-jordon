import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Employee, PaginatedResponse } from "@/types";

export const useEmployeesStore = defineStore("employees", () => {
  const employees = ref<Employee[]>([]);
  const isLoading = ref(false);
  const total = ref(0);
  const currentPage = ref(1);
  const perPage = ref(10);

  // Mock data
  const mockEmployees: Employee[] = [
    {
      id: "1",
      name: "أحمد محمد",
      email: "ahmed@example.com",
      phone: "+966501234567",
      city: "الرياض",
      position: "مدير مبيعات",
      department: "المبيعات",
      hireDate: "2023-01-15",
      status: "active",
      createdAt: "2023-01-15T00:00:00Z",
      updatedAt: "2023-01-15T00:00:00Z",
    },
    {
      id: "2",
      name: "فاطمة علي",
      email: "fatima@example.com",
      phone: "+966507654321",
      city: "جدة",
      position: "مستشار مبيعات",
      department: "المبيعات",
      hireDate: "2023-02-20",
      status: "active",
      createdAt: "2023-02-20T00:00:00Z",
      updatedAt: "2023-02-20T00:00:00Z",
    },
    {
      id: "3",
      name: "محمد عبدالله",
      email: "mohammed@example.com",
      phone: "+966509876543",
      city: "الدمام",
      position: "محلل بيانات",
      department: "تقنية المعلومات",
      hireDate: "2023-03-10",
      status: "active",
      createdAt: "2023-03-10T00:00:00Z",
      updatedAt: "2023-03-10T00:00:00Z",
    },
  ];

  const getEmployees = async (page = 1, search = "", sortBy = "name", sortOrder = "asc") => {
    isLoading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filteredEmployees = [...mockEmployees];

      // Apply search filter
      if (search) {
        filteredEmployees = filteredEmployees.filter(
          (emp) =>
            emp.name.toLowerCase().includes(search.toLowerCase()) ||
            emp.email.toLowerCase().includes(search.toLowerCase()) ||
            emp.city.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply sorting
      filteredEmployees.sort((a, b) => {
        const aValue = a[sortBy as keyof Employee];
        const bValue = b[sortBy as keyof Employee];

        if (typeof aValue === "string" && typeof bValue === "string") {
          return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return 0;
      });

      // Apply pagination
      const start = (page - 1) * perPage.value;
      const end = start + perPage.value;
      const paginatedEmployees = filteredEmployees.slice(start, end);

      employees.value = paginatedEmployees;
      total.value = filteredEmployees.length;
      currentPage.value = page;

      return {
        data: paginatedEmployees,
        total: filteredEmployees.length,
        page,
        perPage: perPage.value,
        totalPages: Math.ceil(filteredEmployees.length / perPage.value),
      } as PaginatedResponse<Employee>;
    } finally {
      isLoading.value = false;
    }
  };

  const addEmployee = async (employeeData: Omit<Employee, "id" | "createdAt" | "updatedAt">) => {
    isLoading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockEmployees.push(newEmployee);
      await getEmployees(currentPage.value);

      return { success: true, data: newEmployee };
    } catch (error) {
      return { success: false, error: "Failed to add employee" };
    } finally {
      isLoading.value = false;
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    isLoading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const index = mockEmployees.findIndex((emp) => emp.id === id);
      if (index === -1) {
        throw new Error("Employee not found");
      }

      mockEmployees[index] = {
        ...mockEmployees[index],
        ...employeeData,
        updatedAt: new Date().toISOString(),
      };

      await getEmployees(currentPage.value);

      return { success: true, data: mockEmployees[index] };
    } catch (error) {
      return { success: false, error: "Failed to update employee" };
    } finally {
      isLoading.value = false;
    }
  };

  const deleteEmployee = async (id: string) => {
    isLoading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const index = mockEmployees.findIndex((emp) => emp.id === id);
      if (index === -1) {
        throw new Error("Employee not found");
      }

      mockEmployees.splice(index, 1);
      await getEmployees(currentPage.value);

      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to delete employee" };
    } finally {
      isLoading.value = false;
    }
  };

  const getEmployeeById = (id: string) => {
    return mockEmployees.find((emp) => emp.id === id);
  };

  return {
    employees,
    isLoading,
    total,
    currentPage,
    perPage,
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
  };
});
