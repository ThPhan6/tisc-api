export interface IConsideredProductsResponse {
  data: {
    summary: { name: string; value: number }[];
    considered_products: any[];
  };
  statusCode: number;
}
