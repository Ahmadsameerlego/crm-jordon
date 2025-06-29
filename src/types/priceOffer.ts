export interface PriceOffer {
  id: string;
  clientId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  date: string;
  adminFile?: string; // ملف PDF من الادمن
  employeeFile?: string; // ملف PDF من الموظف (ممضي)
  adminFileName?: string;
  employeeFileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePriceOfferRequest {
  clientId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  adminFile?: File;
}

export interface UpdatePriceOfferRequest {
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  status?: "pending" | "accepted" | "rejected" | "expired";
  adminFile?: File;
  employeeFile?: File;
}
