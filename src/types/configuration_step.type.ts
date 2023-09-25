export type ConfigurationStepAttribute = {
  id: string;
  step_id: string;
  options: {
    id: string;
    quantity: number;
  }[];
  type?: ConfigurationStepType;
  user_id?: string;
  project_id?: string;
  product_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export enum ConfigurationStepType {
  PreSelect,
  Select,
}
