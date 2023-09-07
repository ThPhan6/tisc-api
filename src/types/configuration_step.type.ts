export type ConfigurationStepAttribute = {
  id: string;
  step_id: string;
  options: {
    id: string;
    quantity: number;
  }[];
  created_by: string;
  created_at: string;
  updated_at: string;
};
