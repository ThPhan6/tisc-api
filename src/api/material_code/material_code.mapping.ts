import { MESSAGES } from "@/constants";
import {
  isDuplicatedString,
  sortObjectArray,
  toSingleSpace,
} from "@/helper/common.helper";
import { IMaterialCodeAttributes, SortOrder } from "@/types";
import { v4 as uuid } from "uuid";
import { IMaterialCodeRequest } from "./material_code.type";

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

export const mappingSortMaterialCode = (
  materialCodes: IMaterialCodeAttributes[],
  subMaterialCodeOrder: SortOrder,
  materialCodeOrder: SortOrder
) => {
  return materialCodes.map((item) => {
    const sortedSubMaterialCode = sortObjectArray(
      item.subs,
      "name",
      subMaterialCodeOrder
    );
    const returnedSubCategories = sortedSubMaterialCode.map((code) => {
      return {
        ...code,
        count: code.codes.length,
        codes: sortObjectArray(code.codes, "code", materialCodeOrder),
      };
    });
    return {
      ...item,
      count: item.subs.length,
      subs: returnedSubCategories,
    };
  });
};

export const mappingSummaryMaterialCode = (
  materialCodes: IMaterialCodeAttributes[]
) => {
  const countMainMaterialCode = materialCodes.length;
  let countSubMaterialCode = 0;
  let countMaterialCode = 0;

  materialCodes.forEach((mainMaterialCode) => {
    if (mainMaterialCode.subs) {
      countSubMaterialCode += mainMaterialCode.subs.length;
      mainMaterialCode.subs.forEach((materialCode) => {
        if (materialCode.codes) countMaterialCode += materialCode.codes.length;
      });
    }
  });
  return {
    countMainMaterialCode,
    countSubMaterialCode,
    countMaterialCode,
  };
};

export const mappingCheckDuplicatePayload = (payload: IMaterialCodeRequest) => {
  payload.name = toSingleSpace(payload.name);
  if (
    isDuplicatedString(
      payload.subs.map((item) => {
        return item.name;
      })
    )
  ) {
    return MESSAGES.MATERIAL_CODE.SUB_MATERIAL_CODE_DUPLICATED;
  }

  const codes = payload.subs.map((item) => {
    return item.codes.map((element) => {
      return element.code;
    });
  });
  let isDuplicatedCategory = false;
  codes.forEach((item) => {
    if (isDuplicatedString(item)) {
      isDuplicatedCategory = true;
    }
  });

  if (isDuplicatedCategory) {
    return MESSAGES.MATERIAL_CODE.MATERIAL_CODE_DUPLICATE;
  }
};

export const mappingMaterialCodeUpdate = (payload: IMaterialCodeRequest) => {
  return payload.subs.map((subMaterialCode) => {
    const materialCodes = subMaterialCode.codes.map((materialCode) => {
      if (materialCode.id) {
        return {
          ...materialCode,
          code: materialCode.code,
          description: materialCode.description,
        };
      }
      return {
        ...materialCode,
        id: uuid(),
        code: materialCode.code,
        description: materialCode.description,
      };
    });
    if (subMaterialCode.id) {
      return {
        ...subMaterialCode,
        name: subMaterialCode.name,
        codes: materialCodes,
      };
    }
    return {
      ...subMaterialCode,
      id: uuid(),
      name: subMaterialCode.name,
      codes: materialCodes,
    };
  });
};
