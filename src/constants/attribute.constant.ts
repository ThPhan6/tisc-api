export const LONG_TEXT_ID = "aa4d21fe-c19b-40e3-aeaa-27423d794e27";
export const SHORT_TEXT_ID = "66d7e3c1-1c8f-4743-99bf-f607d5379504";
import {AttributeType} from '@/types';
import {DimensionAndWeightConversionId} from './basis.constant';

export enum DimensionAndWeightAttributeId {
  overallLength = "e14cfe5b-eeab-4826-b165-91c0c8f1341c",
  overallWidth = "91a1546d-d4f8-4456-bcab-b930cccdb250",
  overallHeight = "62f50511-474b-4b0b-9718-13c00d25234a",
  overallDiameter = "ca9279f9-cfe8-42d5-9ca9-2cf4f6a4992c",
  totalWeight = "c422b8c0-9e33-4437-869c-17a1122df2da",
}

export const DimensionAndWeightCategory: {[key: string]: boolean | null} = {
  [DimensionAndWeightAttributeId.overallLength]: false,
  [DimensionAndWeightAttributeId.overallWidth]: false,

  [DimensionAndWeightAttributeId.totalWeight]: null,
  [DimensionAndWeightAttributeId.overallHeight]: null,

  [DimensionAndWeightAttributeId.overallDiameter]: true,
}

export const DimensionAndWeightAttribute = {
  id: "8d716a82-5514-4bdb-987e-9e3b5807d995",
  type: AttributeType.Specification,
  name: "Dimension & Weight",
  subs: [
    {
      id: DimensionAndWeightAttributeId.overallLength,
      name: "Overall Length",
      basis_id: DimensionAndWeightConversionId.mmToInch
    },
    {
      id: DimensionAndWeightAttributeId.overallWidth,
      name: "Overall Width",
      basis_id: DimensionAndWeightConversionId.mmToInch
    },
    {
      id: DimensionAndWeightAttributeId.overallDiameter,
      name: "Overall Diameter",
      basis_id: DimensionAndWeightConversionId.mmToInch
    },
    {
      id: DimensionAndWeightAttributeId.overallHeight,
      name: "Overall Height",
      basis_id: DimensionAndWeightConversionId.mmToInch
    },
    {
      id: DimensionAndWeightAttributeId.totalWeight,
      name: "Total Weight",
      basis_id: DimensionAndWeightConversionId.kgToLb
    },
  ],
}
