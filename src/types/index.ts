export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "employee";
  avatar?: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  profilePicture?: string;
  position: string;
  departmentId: string;
  departmentName?: string;
  hireDate: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  status: "active" | "inactive" | "prospect";
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceOffer {
  id: string;
  clientId: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: "pending" | "accepted" | "rejected" | "expired";
  date: string;
  adminFile?: string;
  employeeFile?: string;
  adminFileName?: string;
  employeeFileName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  amount: number;
  currency: string;
  status: "open" | "closed" | "lost";
  closeDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalClients: number;
  totalEmployees: number;
  totalQuotations: number;
  totalDeals: number;
  closedDeals: number;
  monthlyRevenue: number;
  conversionRate: number;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
}

export interface TableFilters {
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  perPage: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// Export all types from individual files
export * from "./employee";
export * from "./department";
export * from "./priceOffer";
export * from "./client";
export * from "./visit";
export * from "./service";
export * from "./requirement";
