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
    updateRequirement(req: Requirement) {
      const index = this.requirements.findIndex((r) => r.id === req.id);
      if (index !== -1) {
        this.requirements[index] = req;
      }
    },
    deleteRequirement(reqId: string) {
      const index = this.requirements.findIndex((r) => r.id === reqId);
      if (index !== -1) {
        this.requirements.splice(index, 1);
      }
    },
  },
});
