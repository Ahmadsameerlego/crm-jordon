import { defineStore } from "pinia";
import type { Requirement } from "@/types/requirement";

export const useEmployeeRequirementsStore = defineStore("employeeRequirements", {
  state: () => ({
    requirements: [] as Requirement[],
  }),
  actions: {
    addRequirement(req: Omit<Requirement, "id">) {
      const newReq = { ...req, id: Date.now().toString() };
      this.requirements.push(newReq);
    },
    getRequirementsByClient(clientId: string) {
      return this.requirements.filter((r) => r.clientId === clientId);
    },
  },
});
