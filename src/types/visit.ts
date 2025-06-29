export interface Visit {
  id: string;
  clientId: string;
  dateTime: string; // ISO string
  report?: string; // تقرير الزيارة
}

export interface FollowUp {
  id: string;
  clientId: string;
  type: "external" | "internal" | "phone"; // زياره خارجيه، زياره داخليه، مكالمه هاتف
  dateTime: string; // ISO string
  description: string; // تفاصيل المتابعه
}
