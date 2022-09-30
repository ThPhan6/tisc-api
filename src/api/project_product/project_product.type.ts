export interface AssignProductToProjectRequest {
  entire_allocation: boolean;
  product_id: string;
  project_id: string;
  allocation: string[];
}

export enum ProductConsiderStatus {
  "Considered",
  "Re-Considered",
  "Unlisted",
}
