import { defineStore } from "pinia";
import type { Visit } from "@/types/visit";

export const useEmployeeVisitsStore = defineStore("employeeVisits", {
  state: () => ({
    visits: [] as Visit[],
  }),
  actions: {
    addVisit(visit: Omit<Visit, "id">) {
      const newVisit = { ...visit, id: Date.now().toString() };
      this.visits.push(newVisit);
    },
    getVisitsByClient(clientId: string) {
      return this.visits.filter((v) => v.clientId === clientId);
    },
  },
});
