import { InventoryListResponse } from "@/api/inventory/inventory.type";
import { InventoryVolumePrice } from "@/api/inventory_prices/inventory_prices.type";
import { WarehouseResponse } from "@/api/warehouses/warehouse.type";
import { INTEREST_RATE } from "@/constants";
import { InventoryActionDescription, SortOrder } from "@/types";
import { randomBytes } from "crypto";
import * as FileType from "file-type";
import {
  forEach,
  get,
  isEqual,
  omit,
  omitBy,
  pick,
  round,
  template,
} from "lodash";

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
    let item1 =
      typeof a[field] === "string" ? a[field].toLowerCase() : a[field];
    let item2 =
      typeof b[field] === "string" ? b[field].toLowerCase() : b[field];
    if (order === "ASC") {
      if (typeof item1 === "string") {
        return item1.localeCompare(item2, undefined, {
          numeric: true,
          sensitivity: "base",
        });
      } else {
        if (item1 < item2) {
          return -1;
        }
        if (item1 > item2) {
          return 1;
        }

        return 0;
      }
    }
    if (typeof item1 === "string") {
      return item2.localeCompare(item1, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    } else {
      if (item1 < item2) {
        return 1;
      }
      if (item1 > item2) {
        return -1;
      }
      return 0;
    }
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
    str.trim().toLowerCase().replace(/ /g, "-")
  ).replace(/\-+/g, "-");
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
  let countValue = 0;

  dataSummary.forEach((group: any) => {
    if (group.subs) {
      countSub += group.subs.length;
      group.subs.forEach((item: any) => {
        if (item.subs) {
          countItem += item.subs.length;
          item.subs.forEach((value: any) => {
            if (value.subs) countValue += value.subs.length;
          });
        }
      });
    }
  });
  return {
    countGroup,
    countSub,
    countItem,
    countValue,
  };
};
export const getBasisOptionSummaryTable = (dataSummary: any) => {
  const countGroup = dataSummary.length;
  let countMain = 0;
  let countSub = 0;
  let countItem = 0;

  dataSummary.forEach((group: any) => {
    if (group.subs) {
      countMain += group.subs.length;
      group.subs.forEach((main: any) => {
        if (main.subs) {
          countSub += main.subs.length;
          main.subs.forEach((sub: any) => {
            if (sub.subs) countItem += sub.subs.length;
          });
        }
      });
    }
  });
  return {
    countGroup,
    countMain,
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

export const convertMsToTime = (milliseconds: number) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let arr = [];
  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  if (hours > 0) arr.push(hours + "h");
  if (minutes > 0) arr.push(minutes + "m");
  if (seconds > 0) arr.push(seconds + "s");

  return arr.join(" ");
};

export const objectDiff = (oldObj: any, newObj: any) => {
  const changedData = omitBy(newObj, (i, j) => {
    if (typeof oldObj[j] === "object") return isEqual(oldObj[j], i);
    return oldObj[j] === i;
  });
  const changedDataKeys = Object.keys(changedData);
  const preData = pick(oldObj, changedDataKeys);
  return {
    pre_data: preData,
    changed_data: changedData,
  };
};
export const getLodashOrder = (order: SortOrder) =>
  order.toLowerCase() as "asc" | "desc";

export const toFixedNumber = (amount: number, n: number) => {
  return parseFloat(amount.toFixed(n));
};

export const getInventoryActionDescription = (
  type: InventoryActionDescription,
  description?: string
) => {
  switch (type) {
    case InventoryActionDescription.TRANSFER_TO:
      return `Transfer to ${description}`;
    case InventoryActionDescription.TRANSFER_FROM:
      return `Transfer from ${description}`;
    default:
      return "Adjust";
  }
};

export const convertInventoryArrayToCsv = (
  headers: string[],
  content: InventoryListResponse[]
) => {
  const rows: any[] = [];

  const contentFlat = content.map((item) => {
    const newContent: any = {
      ...omit(item, ["price", "warehouses"]),
      unit_price: item.price.unit_price,
      unit_type: item.price.unit_type,
    };

    forEach(
      item.price.volume_prices,
      (volume_price: InventoryVolumePrice, idx: number) => {
        forEach(volume_price, (price, key: string) => {
          newContent[`#${idx + 1}_volume_${key}`] = price;
        });
      }
    );

    forEach(item.warehouses, (warehouse: WarehouseResponse, idx: number) => {
      forEach(warehouse, (value, key: string) => {
        newContent[`#${idx + 1}_warehouse_${key}`] = value;
      });
    });

    return newContent;
  });

  forEach(contentFlat, (obj) => {
    forEach(obj, (value, key) => {
      switch (key) {
        case "price":

        default:
          rows.push(value);
      }
    });
  });

  return contentFlat;
};
