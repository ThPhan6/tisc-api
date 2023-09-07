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
  }[];
};

export type MultiConfigurationStepRequest = {
  data: ConfigurationStepRequest[];
};
