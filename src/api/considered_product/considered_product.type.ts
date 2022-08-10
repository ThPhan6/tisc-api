export interface IConsideredProductsResponse {
  data: {
    summary: { name: string; value: number }[];
    considered_products: any[];
  };
  statusCode: number;
}

export enum AssigningStatus {
  "Considered" = 1,
  "Re-considered" = 2,
  "Unlisted" = 3,
}

export type AssigningStatusName = keyof typeof AssigningStatus;

export interface FindProductConsiderRequest {
  project_id: string;
  project_zone_id?: string;
  is_entire?: boolean;
}
