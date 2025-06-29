export interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  manager?: string;
}

export interface UpdateDepartmentRequest {
  name?: string;
  description?: string;
  manager?: string;
}
