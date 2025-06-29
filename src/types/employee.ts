export type EmployeeStatus = "active" | "inactive";

export interface Employee {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  profilePicture?: string;
  position: string;
  departmentId: string;
  departmentName?: string;
  hireDate: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  position: string;
  departmentId: string;
  hireDate?: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  position?: string;
  departmentId?: string;
  status?: EmployeeStatus;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
