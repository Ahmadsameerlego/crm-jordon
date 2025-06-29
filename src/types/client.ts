export interface Client {
  id: string;
  employeeId: string;
  companyName?: string;
  companyAddress?: string;
  contactName?: string;
  mobile?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  notes?: string;
  status: "potential" | "regular" | "real"; // عميل محتمل، عميل عادي، عميل حقيقي
}

export interface PriceOffer {
  id: string;
  clientId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  date: string; // ISO string
  status: "pending" | "accepted" | "rejected" | "completed"; // معلق، مقبول، مرفوض، مكتمل
  agreementDate?: string; // تاريخ الاتفاق
}
