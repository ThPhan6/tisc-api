export type BasisType = 1 | 2 | 3;

export const BASIS_TYPES: {
  CONVERSION: BasisType;
  PRESET: BasisType;
  OPTION: BasisType;
} = {
  CONVERSION: 1,
  PRESET: 2,
  OPTION: 3,
};

export const BASIS_OPTION_STORE = "basis-option";

export enum DimensionAndWeightConversionId {
  group = "e661a64f-887e-42ae-b56c-0390e133a635",
  mmToInch = "04a9316c-b769-448c-9805-187d3ce7dc51",
  kgToLb = "c8596cb8-7f72-4c00-a3a4-eb18b8e98c82"
}
export const DimensionAndWeightConversion = {
  id: DimensionAndWeightConversionId.group,
  type: BASIS_TYPES.CONVERSION,
  name: "Dimension & Weight",
  subs: [
    {
      id: DimensionAndWeightConversionId.mmToInch,
      name_1: "Millimeter",
      name_2: "Inch",
      formula_1: 0.0393701,
      formula_2: 1,
      unit_1: "mm",
      unit_2: "in"
    },
    {
      id: DimensionAndWeightConversionId.kgToLb,
      name_1: "Kilogram",
      name_2: "Pound",
      formula_1: 2.20462,
      formula_2: 1,
      unit_1: "kg",
      unit_2: "lb"
    },
  ],
}
