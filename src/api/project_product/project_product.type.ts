export interface AssignProductToProjectRequest {
  entire_allocation: boolean;
  product_id: string;
  project_id: string;
  allocation: string[];
}

export enum ProjectProductStatus {
  consider,
  specify,
}

export enum ProductConsiderStatus {
  "Considered",
  "Re-Considered",
  "Unlisted",
}

export enum ProductSpecifyStatus {
  "Specified",
  "Re-specified",
  "Cancelled",
}

export enum OrderMethod {
  "Direct Purchase",
  "Custom Order",
}
