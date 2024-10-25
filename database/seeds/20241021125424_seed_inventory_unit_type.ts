import { COMMON_TYPES, CommonTypeGroup } from "@/constants";
import { ConnectionInterface } from "@/Database/Connections/ArangoConnection";
import moment from "moment";
import { v4 as uuid } from "uuid";

export const records = [
  /// Area units
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_AREA,
    name: "Square Meter",
    code: "m²",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_AREA,
    name: "Square Centimetre",
    code: "cm²",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_AREA,
    name: "Square Feet",
    code: "ft²",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_AREA,
    name: "Square Inch",
    code: "in²",
  },

  // Length units
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_LENGTH,
    name: "Meter",
    code: "m",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_LENGTH,
    name: "Centimetre",
    code: "cm",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_LENGTH,
    name: "Feet",
    code: "ft",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_LENGTH,
    name: "Inch",
    code: "in",
  },

  // Linear Distance units
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_LINEAR_DISTANCE,
    name: "Linear Meter",
    code: "lin.m",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_LINEAR_DISTANCE,
    name: "Linear Centimetre",
    code: "lin.cm",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_LINEAR_DISTANCE,
    name: "Linear Feet",
    code: "lin.ft",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_LINEAR_DISTANCE,
    name: "Linear Inch",
    code: "lin.in",
  },

  // Volume units
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_VOLUME,
    name: "Liter",
    code: "l",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_VOLUME,
    name: "Millilitre",
    code: "ml",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_VOLUME,
    name: "Gallon",
    code: "gal",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_VOLUME,
    name: "Cubic Meter",
    code: "m³",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_VOLUME,
    name: "Cubic Centimetre",
    code: "cm³",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_VOLUME,
    name: "Cubic Feet",
    code: "ft³",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_VOLUME,
    name: "Cubic Inch",
    code: "in³",
  },

  // Weight units
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_WEIGHT,
    name: "Kilogram",
    code: "kg",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_WEIGHT,
    name: "Gram",
    code: "g",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_WEIGHT,
    name: "Pound",
    code: "lb",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_WEIGHT,
    name: "Ounce",
    code: "oz",
  },

  // Count units
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Bag",
    code: "bag",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Block",
    code: "blk",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Box",
    code: "bx",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Bundle",
    code: "bun",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Can",
    code: "cn",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Carton",
    code: "ctn",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Case",
    code: "case",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Dozen",
    code: "doz",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Each",
    code: "ea",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Lot",
    code: "lot",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Order",
    code: "ord",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Pair",
    code: "pr",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Piece",
    code: "pc",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Pallet",
    code: "plts",
  },
  {
    type: COMMON_TYPES.INVENTORY_UNIT,
    group: CommonTypeGroup.INVENTORY_COUNT,
    name: "Rack",
    code: "rack",
  },
];

export const up = (connection: ConnectionInterface) => {
  const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
  return connection.insert(
    "common_types",
    records.map((item) => ({
      id: uuid(),
      type: item.type,
      name: item.name,
      group: item.group,
      code: item.code,
      created_at: currentTime,
      updated_at: currentTime,
      deleted_at: null,
      relation_id: null,
    }))
  );
};
