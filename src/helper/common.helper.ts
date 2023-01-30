import { randomBytes } from "crypto";
import * as FileType from "file-type";
import { template, round } from "lodash";
import { INTEREST_RATE } from "@/constants";
import { SortOrder } from "@/types";

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

export const toSingleSpace = (str: string) => {
  return str.trim().replace(/ +/g, " ");
};
export const toSingleSpaceAndToLowerCase = (str: string) => {
  return toSingleSpace(str).toLowerCase();
};

export const getDistinctArray = (arr: Array<string>) => {
  return arr.filter((value, index, self) => self.indexOf(value) === index);
};

export const generateUniqueString = (length: number = 64) => {
  return randomBytes(length).toString("hex");
};

export const removeSpecialChars = (str: string, replaceStr: string = "") => {
  return str.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, replaceStr);
};

export const simplizeString = (str: string) => {
  return removeSpecialChars(
    str.trim().toLowerCase().split(" ").join("-").replace(/ /g, "-")
  );
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

export const replaceTemplate = (
  templateReplace: string,
  key: string,
  value: string
) => {
  const compiled = template(templateReplace);
  return compiled({ [key]: value });
};

export const getSummaryTable = (dataSummary: any) => {
  const countGroup = dataSummary.length;
  let countSub = 0;
  let countItem = 0;

  dataSummary.forEach((item: any) => {
    if (item.subs) {
      countSub += item.subs.length;
      item.subs.forEach((subCategory: any) => {
        if (subCategory.subs) countItem += subCategory.subs.length;
      });
    }
  });
  return {
    countGroup,
    countSub,
    countItem,
  };
};

export const pagination = (limit: number, offset: number, total: number) => ({
  page: offset / limit + 1,
  page_size: limit,
  total: total,
  page_count: Math.ceil(total / limit),
});

export const fillObject = (data: any, fillData: any) => {
  const mutableObject1 = Object.assign({}, data);
  const mutableObject2 = Object.assign({}, fillData);
  Object.keys(mutableObject2).forEach(function (key) {
    if (key in mutableObject1) {
      if (typeof mutableObject1[key] === "object") {
        mutableObject1[key] = fillObject(
          mutableObject1[key],
          mutableObject2[key]
        );
      } else {
        mutableObject1[key] = mutableObject2[key];
      }
    }
  });
  return mutableObject1;
};

export function getEnumValues<T extends string | number>(e: any): T[] {
  return typeof e === "object" ? Object.values(e) : [];
}

export function getEnumKeys(e: any): string[] {
  return typeof e === "object" ? Object.keys(e) : [];
}

export const toNonAccentUnicode = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const calculateInterestInvoice = (
  amount: number,
  overDueDay: number
) => {
  const ratePerYear = INTEREST_RATE / 100; // Rate of Interest per year as a percent
  const overduePerYear = overDueDay / 365;
  return round(amount * ratePerYear * overduePerYear, 2);
};

export const getKeyByValue = (object: any, value: any) => {
  return Object.keys(object).find((key: string) => object[key] === value) || "";
};

export const getUnsetAttributes = (model: string, addition: string = "") =>
  `UNSET(${model}, ['_id', '_key', '_rev', 'deleted_at', ${addition}])`;

export const toUSMoney = (amount: number) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
};

export const numberToFixed = (n: number, fixed: number = 2) =>
  n.toFixed(fixed).replace(/.00$|[.*0]$/, "");

export const getLodashOrder = (order: SortOrder) =>
  order.toLowerCase() as "asc" | "desc";
