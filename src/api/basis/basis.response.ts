import {
  paginationResponse,
  summaryTableResponse,
} from "@/helpers/response.helper";
import HapiJoi from "joi";
const Joi = HapiJoi.defaults((schema) =>
  schema.options({
    abortEarly: false,
  })
);

export const basisConversionResponse = {
  id: Joi.string(),
  name_1: Joi.string(),
  name_2: Joi.string(),
  formula_1: Joi.any(),
  formula_2: Joi.any(),
  unit_1: Joi.string(),
  unit_2: Joi.string(),
  conversion_between: Joi.string(),
  first_formula: Joi.string(),
  second_formula: Joi.string(),
};

export const basisConversionGroupResponse = {
  id: Joi.string(),
  name: Joi.string(),
  count: Joi.number().allow(null),
  master: Joi.boolean().allow(null),
  subs: Joi.array().items(Joi.object(basisConversionResponse)),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
  brand_id: Joi.any(),
};

export const subsBasisOptionOrPresetResponse = {
  main_id: Joi.any(),
  sub_group_id: Joi.any(),
  id: Joi.string(),
  name: Joi.string(),
  master: Joi.boolean().allow(null),
  count: Joi.number(),
  subs: Joi.array().items(
    Joi.object({
      id: Joi.string(),
      image: Joi.any(),
      value_1: Joi.any(),
      value_2: Joi.any(),
      unit_1: Joi.any(),
      unit_2: Joi.any(),
      product_id: Joi.any(),
      paired: Joi.any(),
    }).allow(null)
  ),
};
export const basisOptionMainResponse = {
  id: Joi.string(),
  name: Joi.string(),
  count: Joi.number(),
  subs: Joi.array().items(subsBasisOptionOrPresetResponse),
};
export const basisPresetSubGroupResponse = {
  id: Joi.string(),
  name: Joi.string(),
  count: Joi.number(),
  subs: Joi.array().items(subsBasisOptionOrPresetResponse),
};

export const basisOptionGroupResponse = {
  id: Joi.string(),
  brand_id: Joi.any(),
  name: Joi.string(),
  master: Joi.boolean().allow(null),
  count: Joi.number(),
  subs: Joi.array().items(basisOptionMainResponse),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
};

export const basisPresetGroupResponse = {
  id: Joi.string(),
  name: Joi.string(),
  count: Joi.number(),
  master: Joi.boolean().allow(null),
  additional_type: Joi.any(),
  subs: Joi.array().items(basisPresetSubGroupResponse),
  created_at: Joi.string(),
  updated_at: Joi.string().allow(null),
  type: Joi.any(),
  brand_id: Joi.any(),
  copyVer: Joi.any(),
};

export default {
  basisConversion: Joi.object({
    data: Joi.object(basisConversionGroupResponse),
    statusCode: Joi.number(),
  }) as any,

  basisConversions: Joi.object({
    data: {
      basis_conversions: Joi.array().items(
        Joi.object(basisConversionGroupResponse)
      ),
      summary: Joi.array().items(Joi.object(summaryTableResponse)),
      pagination: Joi.object(paginationResponse),
    },
    statusCode: Joi.number(),
  }) as any,

  basisOption: Joi.object({
    data: basisOptionGroupResponse,
    statusCode: Joi.number(),
  }) as any,
  basesOption: Joi.object({
    data: {
      basis_options: Joi.array().items(Joi.object(basisOptionGroupResponse)),
      summary: Joi.array().items(Joi.object(summaryTableResponse)),
      pagination: Joi.object(paginationResponse),
    },
    statusCode: Joi.number(),
  }) as any,

  basisPreset: Joi.object({
    data: basisPresetGroupResponse,
    statusCode: Joi.number(),
  }) as any,
  basisPresets: Joi.object({
    data: {
      basis_presets: Joi.array().items(basisPresetGroupResponse),
      count: {
        group_count: Joi.number(),
        preset_count: Joi.number(),
        value_count: Joi.number(),
      },
      summary: Joi.array().items(Joi.object(summaryTableResponse)),
      pagination: Joi.object(paginationResponse),
    },
    statusCode: Joi.number(),
  }) as any,
};
