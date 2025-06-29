import { defineStore } from "pinia";
import type { Client, PriceOffer } from "@/types/client";

export const useEmployeeClientsStore = defineStore("employeeClients", {
  state: () => ({
    clients: [] as Client[],
    priceOffers: [] as PriceOffer[],
  }),
  actions: {
    addClient(client: Omit<Client, "id">) {
      const newClient = { ...client, id: Date.now().toString() };
      this.clients.push(newClient);
    },
    getClientsByEmployee(employeeId: string) {
      return this.clients.filter((c) => c.employeeId === employeeId);
    },
    getClientsByStatus(employeeId: string, status: Client["status"]) {
      return this.clients.filter((c) => c.employeeId === employeeId && c.status === status);
    },
    getClientById(clientId: string) {
      return this.clients.find((c) => c.id === clientId);
    },
    updateClientStatus(clientId: string, status: Client["status"]) {
      const client = this.clients.find((c) => c.id === clientId);
      if (client) {
        client.status = status;
      }
    },
    addPriceOffer(offer: Omit<PriceOffer, "id">) {
      const newOffer = { ...offer, id: Date.now().toString() };
      this.priceOffers.push(newOffer);
    },
    getPriceOffersByClient(clientId: string) {
      return this.priceOffers.filter((o) => o.clientId === clientId);
    },
    updatePriceOfferStatus(offerId: string, status: PriceOffer["status"], agreementDate?: string) {
      const offer = this.priceOffers.find((o) => o.id === offerId);
      if (offer) {
        offer.status = status;
        if (agreementDate) {
          offer.agreementDate = agreementDate;
        }
      }
    },
  },
});
