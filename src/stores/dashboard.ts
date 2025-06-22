import { defineStore } from "pinia";
import { ref } from "vue";
import type { DashboardStats, Client, Quotation } from "@/types";

export const useDashboardStore = defineStore("dashboard", () => {
  const stats = ref<DashboardStats>({
    totalClients: 0,
    totalEmployees: 0,
    totalQuotations: 0,
    totalDeals: 0,
    closedDeals: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
  });
  const recentClients = ref<Client[]>([]);
  const recentQuotations = ref<Quotation[]>([]);
  const isLoading = ref(false);

  const fetchDashboardData = async () => {
    isLoading.value = true;
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock dashboard data
      stats.value = {
        totalClients: 156,
        totalEmployees: 24,
        totalQuotations: 89,
        totalDeals: 67,
        closedDeals: 45,
        monthlyRevenue: 1250000,
        conversionRate: 67.2,
      };

      recentClients.value = [
        {
          id: "1",
          name: "شركة التقنية المتقدمة",
          email: "info@tech-adv.com",
          phone: "+966501234567",
          company: "شركة التقنية المتقدمة",
          city: "الرياض",
          status: "active",
          assignedTo: "أحمد محمد",
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z",
        },
        {
          id: "2",
          name: "مؤسسة الخدمات الرقمية",
          email: "contact@digital-services.com",
          phone: "+966507654321",
          company: "مؤسسة الخدمات الرقمية",
          city: "جدة",
          status: "prospect",
          assignedTo: "فاطمة علي",
          createdAt: "2024-01-14T00:00:00Z",
          updatedAt: "2024-01-14T00:00:00Z",
        },
        {
          id: "3",
          name: "مجموعة الحلول الذكية",
          email: "hello@smart-solutions.com",
          phone: "+966509876543",
          company: "مجموعة الحلول الذكية",
          city: "الدمام",
          status: "active",
          assignedTo: "محمد عبدالله",
          createdAt: "2024-01-13T00:00:00Z",
          updatedAt: "2024-01-13T00:00:00Z",
        },
        {
          id: "4",
          name: "شركة النظم المتكاملة",
          email: "info@integrated-systems.com",
          phone: "+966501112223",
          company: "شركة النظم المتكاملة",
          city: "مكة",
          status: "inactive",
          assignedTo: "سارة أحمد",
          createdAt: "2024-01-12T00:00:00Z",
          updatedAt: "2024-01-12T00:00:00Z",
        },
        {
          id: "5",
          name: "مؤسسة التطوير الإبداعي",
          email: "hello@creative-dev.com",
          phone: "+966504445556",
          company: "مؤسسة التطوير الإبداعي",
          city: "المدينة",
          status: "active",
          assignedTo: "علي حسن",
          createdAt: "2024-01-11T00:00:00Z",
          updatedAt: "2024-01-11T00:00:00Z",
        },
      ];

      recentQuotations.value = [
        {
          id: "1",
          clientId: "1",
          clientName: "شركة التقنية المتقدمة",
          title: "عرض سعر نظام إدارة الموارد",
          amount: 250000,
          currency: "SAR",
          status: "sent",
          validUntil: "2024-02-15",
          createdAt: "2024-01-15T00:00:00Z",
          updatedAt: "2024-01-15T00:00:00Z",
        },
        {
          id: "2",
          clientId: "2",
          clientName: "مؤسسة الخدمات الرقمية",
          title: "عرض سعر تطوير تطبيق ويب",
          amount: 180000,
          currency: "SAR",
          status: "draft",
          validUntil: "2024-02-20",
          createdAt: "2024-01-14T00:00:00Z",
          updatedAt: "2024-01-14T00:00:00Z",
        },
        {
          id: "3",
          clientId: "3",
          clientName: "مجموعة الحلول الذكية",
          title: "عرض سعر نظام أتمتة المبيعات",
          amount: 320000,
          currency: "SAR",
          status: "accepted",
          validUntil: "2024-02-10",
          createdAt: "2024-01-13T00:00:00Z",
          updatedAt: "2024-01-13T00:00:00Z",
        },
        {
          id: "4",
          clientId: "4",
          clientName: "شركة النظم المتكاملة",
          title: "عرض سعر نظام إدارة المخزون",
          amount: 150000,
          currency: "SAR",
          status: "rejected",
          validUntil: "2024-02-25",
          createdAt: "2024-01-12T00:00:00Z",
          updatedAt: "2024-01-12T00:00:00Z",
        },
        {
          id: "5",
          clientId: "5",
          clientName: "مؤسسة التطوير الإبداعي",
          title: "عرض سعر تطوير موقع إلكتروني",
          amount: 95000,
          currency: "SAR",
          status: "sent",
          validUntil: "2024-02-28",
          createdAt: "2024-01-11T00:00:00Z",
          updatedAt: "2024-01-11T00:00:00Z",
        },
      ];
    } finally {
      isLoading.value = false;
    }
  };

  return {
    stats,
    recentClients,
    recentQuotations,
    isLoading,
    fetchDashboardData,
  };
});
