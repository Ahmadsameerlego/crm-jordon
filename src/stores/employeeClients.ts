import { defineStore } from "pinia";
import type { Client } from "@/types/client";

export const useEmployeeClientsStore = defineStore("employeeClients", {
  state: () => ({
    clients: [] as Client[],
  }),
  actions: {
    addClient(client: Omit<Client, "id">) {
      const newClient = { ...client, id: Date.now().toString() };
      this.clients.push(newClient);
    },
    getClientsByEmployee(employeeId: string) {
      return this.clients.filter((c) => c.employeeId === employeeId);
    },
  },
});
