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
  department: string;
  hireDate: string;
  status: EmployeeStatus;
  createdAt: string;
  updatedAt: string;
}
