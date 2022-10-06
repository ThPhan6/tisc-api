import { ICodeAttribute } from "@/types/material_code.type";

export interface IMaterialCodeRequest {
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
}

export interface IMaterialCodeResponse {
  data: {
    id: string;
    name: string;
    subs: {
      id: string;
      name: string;
      codes: ICodeAttribute[];
    }[];
  };
  statusCode: number;
}

export interface IMaterialCodeGroupResponse {
  data: {
    id: string;
    name: string;
    count: number;
    subs: {
      id: string;
      name: string;
      count: number;
      codes: ICodeAttribute[];
    }[];
  }[];
  statusCode: number;
}

export interface IGetListCodeMaterialCode {
  data: ICodeAttribute[];
  statusCode: number;
}
