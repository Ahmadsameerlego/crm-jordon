import { defineStore } from "pinia";
import type { Employee } from "@/types/employee";

export const useEmployeeAuthStore = defineStore("employeeAuth", {
  state: () => ({
    employee: null as Employee | null,
    employees: [
      { id: "1", name: "موظف", email: "employee@crm.com", password: "123456" },
    ] as Employee[],
  }),
  actions: {
    login(email: string, password: string) {
      const found = this.employees.find((e) => e.email === email && e.password === password);
      if (found) {
        this.employee = found;
        localStorage.setItem("employee", JSON.stringify(found));
        return true;
      }
      return false;
    },
    logout() {
      this.employee = null;
      localStorage.removeItem("employee");
    },
    checkAuth() {
      if (!this.employee) {
        const stored = localStorage.getItem("employee");
        if (stored) this.employee = JSON.parse(stored);
      }
      return !!this.employee;
    },
  },
});
