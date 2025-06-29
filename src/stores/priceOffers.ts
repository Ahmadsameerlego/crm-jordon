import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  PriceOffer,
  CreatePriceOfferRequest,
  UpdatePriceOfferRequest,
} from "@/types/priceOffer";

export const usePriceOffersStore = defineStore("priceOffers", () => {
  const priceOffers = ref<PriceOffer[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Mock data
  const mockPriceOffers: PriceOffer[] = [
    {
      id: "1",
      clientId: "1",
      title: "عرض سعر لتصميم موقع إلكتروني",
      description: "تصميم وتطوير موقع إلكتروني احترافي",
      amount: 5000,
      currency: "SAR",
      status: "pending",
      date: "2024-01-15",
      adminFile: "/files/offer1.pdf",
      adminFileName: "عرض_السعر_1.pdf",
      createdAt: "2024-01-15T00:00:00Z",
      updatedAt: "2024-01-15T00:00:00Z",
    },
    {
      id: "2",
      clientId: "1",
      title: "عرض سعر لحملة تسويقية",
      description: "حملة تسويقية شاملة على وسائل التواصل الاجتماعي",
      amount: 3000,
      currency: "SAR",
      status: "accepted",
      date: "2024-01-20",
      adminFile: "/files/offer2.pdf",
      adminFileName: "عرض_السعر_2.pdf",
      employeeFile: "/files/signed_offer2.pdf",
      employeeFileName: "عرض_السعر_ممضي.pdf",
      createdAt: "2024-01-20T00:00:00Z",
      updatedAt: "2024-01-20T00:00:00Z",
    },
  ];

  // Computed
  const getPriceOffers = computed(() => priceOffers.value);

  // Actions
  const fetchPriceOffers = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // Mock API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 500));
      priceOffers.value = mockPriceOffers;
    } catch (err) {
      error.value = "فشل في تحميل عروض الأسعار";
      console.error("Error fetching price offers:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const getPriceOffersByClient = (clientId: string) => {
    return priceOffers.value.filter((offer) => offer.clientId === clientId);
  };

  const createPriceOffer = async (offerData: CreatePriceOfferRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      // Mock file upload - replace with actual file upload API
      let adminFileUrl = "";
      let adminFileName = "";

      if (offerData.adminFile) {
        // Simulate file upload
        adminFileUrl = `/files/offer_${Date.now()}.pdf`;
        adminFileName = offerData.adminFile.name;
      }

      const newOffer: PriceOffer = {
        id: Date.now().toString(),
        ...offerData,
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        adminFile: adminFileUrl,
        adminFileName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      priceOffers.value.push(newOffer);
      return { success: true, data: newOffer };
    } catch (err) {
      error.value = "فشل في إنشاء عرض السعر";
      console.error("Error creating price offer:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const updatePriceOffer = async (id: string, offerData: UpdatePriceOfferRequest) => {
    isLoading.value = true;
    error.value = null;
    try {
      const index = priceOffers.value.findIndex((offer) => offer.id === id);
      if (index === -1) {
        throw new Error("عرض السعر غير موجود");
      }

      // Handle file uploads
      let adminFileUrl = priceOffers.value[index].adminFile;
      let adminFileName = priceOffers.value[index].adminFileName;
      let employeeFileUrl = priceOffers.value[index].employeeFile;
      let employeeFileName = priceOffers.value[index].employeeFileName;

      if (offerData.adminFile) {
        adminFileUrl = `/files/offer_${Date.now()}.pdf`;
        adminFileName = offerData.adminFile.name;
      }

      if (offerData.employeeFile) {
        employeeFileUrl = `/files/signed_offer_${Date.now()}.pdf`;
        employeeFileName = offerData.employeeFile.name;
      }

      priceOffers.value[index] = {
        ...priceOffers.value[index],
        ...offerData,
        adminFile: adminFileUrl,
        adminFileName,
        employeeFile: employeeFileUrl,
        employeeFileName,
        updatedAt: new Date().toISOString(),
      };

      return { success: true, data: priceOffers.value[index] };
    } catch (err) {
      error.value = "فشل في تحديث عرض السعر";
      console.error("Error updating price offer:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const deletePriceOffer = async (id: string) => {
    isLoading.value = true;
    error.value = null;
    try {
      const index = priceOffers.value.findIndex((offer) => offer.id === id);
      if (index === -1) {
        throw new Error("عرض السعر غير موجود");
      }

      priceOffers.value.splice(index, 1);
      return { success: true };
    } catch (err) {
      error.value = "فشل في حذف عرض السعر";
      console.error("Error deleting price offer:", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const getPriceOfferById = (id: string) => {
    return priceOffers.value.find((offer) => offer.id === id);
  };

  return {
    priceOffers,
    isLoading,
    error,
    getPriceOffers,
    fetchPriceOffers,
    getPriceOffersByClient,
    createPriceOffer,
    updatePriceOffer,
    deletePriceOffer,
    getPriceOfferById,
  };
});
