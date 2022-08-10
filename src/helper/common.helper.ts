import { randomBytes } from "crypto";
import * as FileType from "file-type";
import { CONSIDERED_PRODUCT_STATUS } from "../constant/common.constant";
import { ROLES } from "../constant/user.constant";

export const isDuplicatedString = (values: string[]) => {
  return values.some(function (item, idx) {
    return values.indexOf(item) != idx;
  });
};

export const sortObjectArray = (
  values: any[],
  field: string,
  order: "ASC" | "DESC"
) => {
  const compare = (a: any, b: any) => {
    if (order === "ASC") {
      if (a[field] < b[field]) {
        return -1;
      }
      if (a[field] > b[field]) {
        return 1;
      }

      return 0;
    }
    if (a[field] < b[field]) {
      return 1;
    }
    if (a[field] > b[field]) {
      return -1;
    }
    return 0;
  };
  return values.sort(compare);
};

export const getFileTypeFromBase64 = async (
  base64: string
): Promise<{ mime: string; ext: string } | any> => {
  const decoded = Buffer.from(base64, "base64");
  const decodedAsString = decoded.toString();
  if (decodedAsString.indexOf("</svg>") > -1) {
    /// svg file
    return {
      mime: "image/svg+xml",
      ext: "svg",
    };
  }
  const fileType = await FileType.fromBuffer(decoded);
  if (!fileType) {
    return false;
  }
  return fileType;
};

export const randomName = (n: number) => {
  return randomBytes(n).toString("hex");
};

export const countWord = (str: string) => {
  const arrStr = str.split(" ");
  return arrStr.filter((word: any) => word !== "").length;
};

export const tosingleSpace = (str: string) => {
  return str.trim().replace(/ +/g, " ");
};

export const getDistinctArray = (arr: Array<string>) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

type AccessLevelType =
  | "TISC Admin"
  | "Consultant Team"
  | "Brand Admin"
  | "Brand Team"
  | "Design Admin"
  | "Design Team";
export const getAccessLevel = (role_id: string) => {
  let result: AccessLevelType;
  switch (role_id) {
    case ROLES.TISC_ADMIN:
      result = "TISC Admin";
      break;
    case ROLES.TISC_CONSULTANT_TEAM:
      result = "Consultant Team";
      break;
    case ROLES.BRAND_ADMIN:
      result = "Brand Admin";
      break;
    case ROLES.BRAND_TEAM:
      result = "Brand Team";
      break;
    case ROLES.DESIGN_ADMIN:
      result = "Design Admin";
      break;
    default:
      result = "Design Team";
      break;
  }
  return result;
};

export const removeSpecialChars = (str: string, replaceStr: string = "") => {
  return str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, replaceStr);
};

type ConsideredProductStatus = "Considered" | "Re-considered" | "Unlisted";
export const getConsideredProductStatusName = (
  status: number
): ConsideredProductStatus => {
  let result: ConsideredProductStatus;
  switch (status) {
    case CONSIDERED_PRODUCT_STATUS.CONSIDERED:
      result = "Considered";
      break;

    case CONSIDERED_PRODUCT_STATUS.RE_CONSIDERED:
      result = "Re-considered";
      break;

    default:
      result = "Unlisted";
      break;
  }
  return result;
};

export const formatNumberDisplay = (
  num: number | string,
  locale: string = "en-us"
) => {
  let value = num;
  if (typeof value !== "number") {
    value = Number(value);
  }
  if (isNaN(value)) {
    return "N/A";
  }
  return value.toLocaleString(locale);
};
