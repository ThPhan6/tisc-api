export type SpecificationStepAttribute = {
  id: string;
  specification_id: string;
  product_id: string;
  name: string;
  order: number;
  options: {
    id: string;
    replicate: number;
    pre_option: string;
  }[];
  created_by: string;
  created_at: string;
  updated_at: string;
};
