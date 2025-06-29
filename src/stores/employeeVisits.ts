import { defineStore } from "pinia";
import type { Visit, FollowUp } from "@/types/visit";

export const useEmployeeVisitsStore = defineStore("employeeVisits", {
  state: () => ({
    visits: [] as Visit[],
    followUps: [] as FollowUp[],
  }),
  actions: {
    addVisit(visit: Omit<Visit, "id">) {
      const newVisit = { ...visit, id: Date.now().toString() };
      this.visits.push(newVisit);
    },
    updateVisitReport(visitId: string, report: string) {
      const visit = this.visits.find((v) => v.id === visitId);
      if (visit) {
        visit.report = report;
      }
    },
    getVisitsByClient(clientId: string) {
      return this.visits.filter((v) => v.clientId === clientId);
    },
    addFollowUp(followUp: Omit<FollowUp, "id">) {
      const newFollowUp = { ...followUp, id: Date.now().toString() };
      this.followUps.push(newFollowUp);
    },
    getFollowUpsByClient(clientId: string) {
      return this.followUps.filter((f) => f.clientId === clientId);
    },
  },
});
