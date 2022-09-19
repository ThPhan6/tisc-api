import { IMaterialCodeRequest } from "./material_code.type";
import { v4 as uuid } from "uuid";

export const mappingDataCreate = (payload: IMaterialCodeRequest) => {
  return {
    ...payload,
    subs: payload.subs.map((sub) => ({
      ...sub,
      id: uuid(),
      codes: sub.codes.map((code) => ({
        ...code,
        id: uuid(),
      })),
    })),
  };
};
