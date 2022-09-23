import {
  BASIS_TYPES,
  LONG_TEXT_ID,
  MESSAGES,
  SHORT_TEXT_ID,
} from "@/constants";
import { isDuplicatedString, sortObjectArray } from "@/helper/common.helper";
import {
  IAttributeAttributes,
  IBasisAttributes,
  IContentType,
  SubAttribute,
} from "@/types";
import { v4 as uuid } from "uuid";
import { IAttributeRequest, IUpdateAttributeRequest } from "./attribute.type";

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

export const countAttribute = (attributes: IAttributeAttributes[]) => {
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
  attribute: IAttributeAttributes,
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
  attributes: IAttributeAttributes[],
  contentTypes: IContentType[],
  attribute_order: "ASC" | "DESC",
  content_type_order: "ASC" | "DESC"
) => {
  return attributes.map((attribute: IAttributeAttributes) => {
    const newSubs = mappingSubAttribute(attribute, contentTypes);
    let sortedSubs = newSubs;
    if (attribute_order) {
      sortedSubs = sortObjectArray(newSubs, "name", attribute_order);
    }
    if (content_type_order) {
      sortedSubs = sortObjectArray(newSubs, "content_type", content_type_order);
    }
    const { type, ...rest } = {
      ...attribute,
      count: sortedSubs.length,
      subs: sortedSubs,
    };
    return rest;
  });
};

export const mappingSubAttributeUpdate = (
  attribute: IAttributeAttributes,
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
  attributes: IAttributeAttributes[],
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
