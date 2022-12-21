import {
  BASIS_TYPES,
  LONG_TEXT_ID,
  MESSAGES,
  SHORT_TEXT_ID,
  DimensionAndWeightAttribute,
  DimensionAndWeightConversion,
  DimensionAndWeightCategory,
} from "@/constants";
import { isDuplicatedString, numberToFixed } from "@/helper/common.helper";
import {
  AttributeProps,
  IBasisAttributes,
  IContentType,
  SortOrder,
  SubAttribute,
} from "@/types";
import { orderBy, isFinite, isString } from "lodash";
import { v4 as uuid } from "uuid";
import { IAttributeRequest, IUpdateAttributeRequest } from "./attribute.type";
import { DimensionAndWeight, DimensionAndWeightInterface } from "@/types";

export const getBasisType = (type: number) => {
  switch (type) {
    case BASIS_TYPES.CONVERSION:
      return "Conversions";
    case BASIS_TYPES.PRESET:
      return "Presets";
    case BASIS_TYPES.OPTION:
      return "Options";
    default:
      return "Text";
  }
};

export const countAttribute = (attributes: AttributeProps[]) => {
  return attributes.reduce((pre, cur) => {
    return pre + cur.subs.length;
  }, 0);
};

export const getFlatListBasis = (
  conversionGroups: IBasisAttributes[],
  presetGroups: IBasisAttributes[],
  optionGroups: IBasisAttributes[]
) => {
  let data = [];
  conversionGroups.forEach((conversionGroup: IBasisAttributes) => {
    conversionGroup.subs.forEach((conversion: any) => {
      data.push({
        id: conversion.id,
        name_1: conversion.name_1,
        name_2: conversion.name_2,
        type: "Conversions",
      });
    });
  });
  presetGroups.forEach((presetGroup: IBasisAttributes) => {
    presetGroup.subs.forEach((preset: any) => {
      data.push({
        id: preset.id,
        name: preset.name,
        type: "Presets",
      });
    });
  });
  optionGroups.forEach((optionGroup: IBasisAttributes) => {
    optionGroup.subs.forEach((option: any) => {
      data.push({
        id: option.id,
        name: option.name,
        type: "Options",
      });
    });
  });
  data.push({
    id: LONG_TEXT_ID,
    name: "Long Format",
    type: "Text",
  });
  data.push({
    id: SHORT_TEXT_ID,
    name: "Short Format",
    type: "Text",
  });
  return data;
};

export const checkAttributeDuplicateByName = (
  attributeGroups: IAttributeRequest | IUpdateAttributeRequest
) => {
  if (
    isDuplicatedString(
      attributeGroups.subs.map((item) => {
        return item.name;
      })
    )
  ) {
    return MESSAGES.ATTRIBUTE_DUPLICATED;
  }
  return false;
};

export const mappingSubAttribute = (
  attribute: AttributeProps,
  contentTypes: IContentType[]
) => {
  return attribute.subs.map((item) => {
    const foundContentType = contentTypes.find(
      (contentType) => contentType.id === item.basis_id
    );
    if (foundContentType) {
      if (foundContentType.type === "Conversions") {
        return {
          ...item,
          content_type: foundContentType.type,
          description: "",
          description_1: foundContentType.name_1,
          description_2: foundContentType.name_2,
        };
      }
      return {
        ...item,
        content_type: foundContentType.type,
        description: foundContentType.name,
      };
    }
    return {
      ...item,
      content_type: "",
      description: "",
    };
  });
};

export const getListAttributeWithSort = (
  attributes: AttributeProps[],
  contentTypes: IContentType[],
  attribute_order?: SortOrder,
  content_type_order?: SortOrder
) => {
  return attributes.map((attribute: AttributeProps) => {
    const newSubs = mappingSubAttribute(attribute, contentTypes);

    const { type, ...rest } = {
      ...attribute,
      count: newSubs.length,
      subs: orderBy(
        newSubs,
        content_type_order ? "content_type" : "name", // Default sort by name
        (content_type_order
          ? content_type_order.toLowerCase()
          : attribute_order?.toLowerCase()) as "asc" | "desc"
      ),
    };
    return rest;
  });
};

export const mappingSubAttributeUpdate = (
  attribute: AttributeProps,
  payload: IUpdateAttributeRequest
) => {
  return payload.subs.map((item) => {
    let found = false;
    if (item.id) {
      const foundItem = attribute.subs.find((sub) => sub.id === item.id);
      if (foundItem) {
        found = true;
      }
    }
    if (found) {
      return item;
    }
    return {
      ...item,
      id: uuid(),
    };
  });
};

export const mappingContentTypeList = (
  conversionGroups: IBasisAttributes[],
  presetGroups: IBasisAttributes[],
  optionGroups: IBasisAttributes[]
) => {
  const returnedConversionGroups = conversionGroups.map(
    (conversionGroup: IBasisAttributes) => {
      const conversions = conversionGroup.subs.map((conversion: any) => {
        return {
          id: conversion.id,
          name_1: conversion.name_1,
          name_2: conversion.name_2,
        };
      });
      return {
        id: conversionGroup.id,
        name: conversionGroup.name,
        count: conversionGroup.subs.length,
        subs: conversions,
      };
    }
  );
  const returnedPresetGroups = presetGroups.map(
    (presetGroup: IBasisAttributes) => {
      const presets = presetGroup.subs.map((preset: any) => {
        return {
          id: preset.id,
          name: preset.name,
          count: preset.subs.length,
        };
      });
      return {
        id: presetGroup.id,
        name: presetGroup.name,
        count: presets.length,
        subs: presets,
      };
    }
  );
  const returnedOptionGroups = optionGroups.map(
    (optionGroup: IBasisAttributes) => {
      const options = optionGroup.subs.map((option: any) => {
        return {
          id: option.id,
          name: option.name,
          count: option.subs.length,
        };
      });
      return {
        id: optionGroup.id,
        name: optionGroup.name,
        count: options.length,
        subs: options,
      };
    }
  );

  return {
    texts: [
      {
        id: LONG_TEXT_ID,
        name: "Long Format",
      },
      {
        id: SHORT_TEXT_ID,
        name: "Short Format",
      },
    ],
    conversions: returnedConversionGroups,
    presets: returnedPresetGroups,
    options: returnedOptionGroups,
  };
};

export const mappingAttributeData = (
  attributes: AttributeProps[],
  subsBasis: any
) => {
  return attributes.map((attribute) => {
    const subsAttribute = attribute.subs.map((item: SubAttribute) => {
      if (item.basis_id === SHORT_TEXT_ID) {
        return {
          ...item,
          basis: {
            id: SHORT_TEXT_ID,
            name: "Short Format",
            type: "Text",
          },
        };
      }
      if (item.basis_id === LONG_TEXT_ID) {
        return {
          ...item,
          basis: {
            id: LONG_TEXT_ID,
            name: "Long Format",
            type: "Text",
          },
        };
      }
      const foundBasis = subsBasis.find(
        (basis: any) => basis.id == item.basis_id
      );

      if (foundBasis) {
        return {
          ...item,
          basis: {
            ...foundBasis,
          },
        };
      }
      return {
        ...item,
        basis: {},
      };
    });
    return {
      ...attribute,
      subs: subsAttribute,
    };
  });
};

export const getSubBasisAttribute = (basisGroups: IBasisAttributes[]) => {
  return basisGroups.reduce((pre, cur) => {
    const temp = cur.subs.map((item: any) => ({
      ...item,
      type: getBasisType(cur.type),
    }));
    return pre.concat(temp);
  }, []);
};

export const getDefaultDimensionAndWeightAttribute =
  (): DimensionAndWeightInterface => {
    return {
      id: DimensionAndWeightAttribute.id,
      name: DimensionAndWeightAttribute.name,
      with_diameter: false,
      attributes: DimensionAndWeightAttribute.subs.map((sub) => {
        return {
          ...sub,
          type: "Conversions",
          conversion_value_1: "",
          conversion_value_2: "",
          text: "",
          basis_value_id: "",
          conversion: DimensionAndWeightConversion.subs.find(
            (conversion) => conversion.id === sub.basis_id
          ),
          with_diameter: DimensionAndWeightCategory[sub.id],
        };
      }),
    };
  };

export const mappingDimensionAndWeight = (
  dimensionAndWeight?: DimensionAndWeight
): DimensionAndWeightInterface => {
  const defaultDimensionAndWeight = getDefaultDimensionAndWeightAttribute();
  if (!dimensionAndWeight) {
    return defaultDimensionAndWeight;
  }
  return {
    ...defaultDimensionAndWeight,
    with_diameter: dimensionAndWeight.with_diameter,
    attributes: defaultDimensionAndWeight.attributes.map((defaultAttr) => {
      const attribute = dimensionAndWeight.attributes.find(
        (attr) => attr.id === defaultAttr.id
      );
      if (!attribute || isString(attribute.conversion_value_1)) {
        return defaultAttr;
      }
      const value1 = attribute.conversion_value_1 || 0;
      const value2 = value1 / (defaultAttr.conversion?.formula_1 || 0) || 0;
      return {
        ...defaultAttr,
        conversion_value_1: isFinite(value1) ? numberToFixed(value1) : "",
        conversion_value_2: isFinite(value2) ? numberToFixed(value2) : "",
      };
    }),
  };
};
