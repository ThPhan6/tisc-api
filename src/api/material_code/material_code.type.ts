export interface IMaterialCodeRequest {
  name: string;
  subs: {
    name: string;
    codes: {
      code: string;
      description: string;
    }[];
  }[];
}

export interface IMaterialCodeResponse {
  data: {
    id: string;
    name: string;
    subs: {
      id: string;
      name: string;
      codes: {
        id: string;
        code: string;
        description: string;
      }[];
    }[];
  };
  statusCode: number;
}
