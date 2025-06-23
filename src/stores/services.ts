import { defineStore } from "pinia";
import type { Service } from "@/types/service";

export const useServicesStore = defineStore("services", {
  state: () => ({
    services: [
      { id: "1", name: "خدمة 1" },
      { id: "2", name: "خدمة 2" },
      { id: "3", name: "خدمة 3" },
    ] as Service[],
  }),
});
