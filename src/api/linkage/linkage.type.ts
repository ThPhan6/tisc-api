export type Linkage = {
  pair: string;
  is_pair: boolean;
};
export type LinkageRequest = {
  data: Linkage[];
};

export type StepRequest = {
  product_id: string;
  specification_id: string;
  name: string;
  order: number;
  options: {
    id: string;
    replicate: number;
    pre_option: string;
  }[];
};

export type MultiStepRequest = {
  data: StepRequest[];
};

export type ConfigurationStepRequest = {
  step_id: string;
  options: {
    id: string;
    quantity: number;
    pre_option: any;
  }[];
};
export type StepSelectionRequest = {
  project_id?: string;
  product_id?: string;
  specification_id?: string;
  user_id?: string;
  quantities: any;
};

export type MultiConfigurationStepRequest = {
  project_id?: string;
  product_id?: string;
  specification_id?: string;
  user_id?: string;
  data: ConfigurationStepRequest[];
};
