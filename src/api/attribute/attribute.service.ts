import { ATTRIBUTE_TYPES } from "./../../constant/common.constant";
import { IPagination } from "./../../type/common.type";
import {
  BASIS_TYPES,
  LONG_TEXT_ID,
  MESSAGES,
  SHORT_TEXT_ID,
} from "../../constant/common.constant";
import AttributeModel, {
  ATTRIBUTE_NULL_ATTRIBUTES,
  IAttributeAttributes,
} from "../../model/attribute.model";
import { IMessageResponse } from "../../type/common.type";
import {
  IAttributeRequest,
  IAttributeResponse,
  IAttributesResponse,
  IContentTypesResponse,
  IUpdateAttributeRequest,
} from "./attribute.type";
import { v4 as uuid } from "uuid";
import {
  isDuplicatedString,
  sortObjectArray,
} from "../../helper/common.helper";
import BasisModel, { IBasisAttributes } from "../../model/basis.model";

export default class AttributeService {
  private attributeModel: AttributeModel;
  private basisModel: BasisModel;
  constructor() {
    this.attributeModel = new AttributeModel();
    this.basisModel = new BasisModel();
  }
  private countAttribute = (attributes: IAttributeAttributes[]) => {
    return attributes.reduce((pre, cur) => {
      return pre + cur.subs.length;
    }, 0);
  };
  private getFlatListContentType = async (): Promise<any[]> => {
    let data = [];
    const conversionGroups = await this.basisModel.getAllBasisByType(
      BASIS_TYPES.CONVERSION
    );
    conversionGroups.forEach((conversionGroup: IBasisAttributes) => {
      conversionGroup.subs.forEach((conversion: any) => {
        data.push({
          id: conversion.id,
          name_1: conversion.name_1,
          name_2: conversion.name_2,
          type: "Conversion",
        });
      });
    });
    const presetGroups = await this.basisModel.getAllBasisByType(
      BASIS_TYPES.PRESET
    );
    presetGroups.forEach((presetGroup: IBasisAttributes) => {
      presetGroup.subs.forEach((preset: any) => {
        data.push({
          id: preset.id,
          name: preset.name,
          type: "Preset",
        });
      });
    });
    const optionGroups = await this.basisModel.getAllBasisByType(
      BASIS_TYPES.OPTION
    );
    optionGroups.forEach((optionGroup: IBasisAttributes) => {
      optionGroup.subs.forEach((option: any) => {
        data.push({
          id: option.id,
          name: option.name,
          type: "Option",
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
  public create = (
    payload: IAttributeRequest
  ): Promise<IMessageResponse | IAttributeResponse> => {
    return new Promise(async (resolve) => {
      const contentTypes = await this.getFlatListContentType();
      const attribute = await this.attributeModel.findBy({
        name: payload.name.toLowerCase(),
      });
      if (attribute) {
        return resolve({
          message: MESSAGES.ATTRIBUTE_EXISTS,
          statusCode: 400,
        });
      }
      if (
        isDuplicatedString(
          payload.subs.map((item) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.DUPLICATED_ATTRIBUTE,
          statusCode: 400,
        });
      }
      const subData = payload.subs.map((item) => {
        return {
          id: uuid(),
          name: item.name,
          basis_id: item.basis_id,
        };
      });
      const createdAttribute = await this.attributeModel.create({
        ...ATTRIBUTE_NULL_ATTRIBUTES,
        name: payload.name,
        type: payload.type,
        subs: subData,
      });
      if (!createdAttribute) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const subResponses = await Promise.all(
        createdAttribute.subs.map(async (item) => {
          const foundContentype = contentTypes.find(
            (contentType) => contentType.id === item.basis_id
          );
          if (foundContentype) {
            if (foundContentype.type === "Conversion") {
              return {
                ...item,
                content_type: foundContentype.type,
                description: foundContentype.name_1 + foundContentype.name_2,
              };
            }
            return {
              ...item,
              content_type: foundContentype.type,
              description: foundContentype.name,
            };
          }
          return {
            ...item,
            content_type: "",
            description: "",
          };
        })
      );
      const { type, is_deleted, ...rest } = createdAttribute;
      return resolve({
        data: {
          ...rest,
          count: payload.subs.length,
          subs: subResponses,
        },
        statusCode: 200,
      });
    });
  };
  public get = (id: string): Promise<IMessageResponse | IAttributeResponse> => {
    return new Promise(async (resolve) => {
      const contentTypes = await this.getFlatListContentType();
      const attribute = await this.attributeModel.find(id);
      if (!attribute) {
        return resolve({
          message: MESSAGES.NOT_FOUND_ATTRIBUTE,
          statusCode: 404,
        });
      }
      const subResponses = attribute.subs.map((item) => {
        const foundContentype = contentTypes.find(
          (contentType) => contentType.id === item.basis_id
        );
        if (foundContentype) {
          if (foundContentype.type === "Conversion") {
            return {
              ...item,
              content_type: foundContentype.type,
              description: foundContentype.name_1 + foundContentype.name_2,
            };
          }
          return {
            ...item,
            content_type: foundContentype.type,
            description: foundContentype.name,
          };
        }
        return {
          ...item,
          content_type: "",
          description: "",
        };
      });
      const { type, is_deleted, ...rest } = attribute;
      return resolve({
        data: {
          ...rest,
          count: attribute.subs.length,
          subs: subResponses,
        },
        statusCode: 200,
      });
    });
  };

  public getList = (
    type: number,
    limit: number,
    offset: number,
    filter: any,
    group_order: string,
    attribute_order: any,
    content_type_order: any
  ): Promise<IMessageResponse | IAttributesResponse> => {
    return new Promise(async (resolve) => {
      const attributes = await this.attributeModel.list(
        limit,
        offset,
        { ...filter, type },
        ["name", group_order]
      );

      const returnedAttributes = attributes.map(
        (item: IAttributeAttributes) => {
          const newSub = item.subs.map((sub) => {
            return {
              ...sub,
              content_type: "",
            };
          });
          let sortedSubs;
          if (attribute_order) {
            sortedSubs = sortObjectArray(newSub, "name", attribute_order);
          }
          if (content_type_order) {
            sortedSubs = sortObjectArray(
              newSub,
              "content_type",
              content_type_order
            );
          }
          const { type, is_deleted, ...rest } = {
            ...item,
            subs: sortedSubs,
          };
          return rest;
        }
      );
      const pagination: IPagination = await this.attributeModel.getPagination(
        limit,
        offset,
        type
      );
      const summary = [
        {
          name:
            type === ATTRIBUTE_TYPES.SPECIFICATION
              ? "Specification Group"
              : "Attribute Group",
          value: attributes.length,
        },
        {
          name:
            type === ATTRIBUTE_TYPES.SPECIFICATION
              ? "Specification"
              : "Attribute",
          value: this.countAttribute(attributes),
        },
      ];
      return resolve({
        data: {
          attributes: returnedAttributes,
          summary,
          pagination,
        },
        statusCode: 200,
      });
    });
  };
  public update = (
    id: string,
    payload: IUpdateAttributeRequest
  ): Promise<IMessageResponse | IAttributeResponse> => {
    return new Promise(async (resolve) => {
      const attribute = await this.attributeModel.find(id);
      if (!attribute) {
        return resolve({
          message: MESSAGES.NOT_FOUND_ATTRIBUTE,
          statusCode: 404,
        });
      }
      const duplicatedAttribute =
        await this.attributeModel.getDuplicatedAttribute(id, payload.name);
      if (duplicatedAttribute) {
        return resolve({
          message: MESSAGES.DUPLICATED_GROUP_ATTRIBUTE,
          statusCode: 400,
        });
      }
      if (
        isDuplicatedString(
          payload.subs.map((item) => {
            return item.name;
          })
        )
      ) {
        return resolve({
          message: MESSAGES.DUPLICATED_ATTRIBUTE,
          statusCode: 400,
        });
      }
      const subData = payload.subs.map((item) => {
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
      const updatedAttribute = await this.attributeModel.update(id, {
        ...payload,
        subs: subData,
      });
      if (!updatedAttribute) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve(this.get(id));
    });
  };
  public delete = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const attribute = await this.attributeModel.find(id);
      if (!attribute) {
        return resolve({
          message: MESSAGES.NOT_FOUND_ATTRIBUTE,
          statusCode: 404,
        });
      }
      const updatedAttribute = await this.attributeModel.update(id, {
        is_deleted: true,
      });
      if (!updatedAttribute) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };

  public getListContentType = (): Promise<IContentTypesResponse> => {
    return new Promise(async (resolve) => {
      const conversionGroups = await this.basisModel.getAllBasisByType(
        BASIS_TYPES.CONVERSION
      );
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
      const presetGroups = await this.basisModel.getAllBasisByType(
        BASIS_TYPES.PRESET
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
      const optionGroups = await this.basisModel.getAllBasisByType(
        BASIS_TYPES.OPTION
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
      const data = {
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
      return resolve({
        data,
        statusCode: 200,
      });
    });
  };
}
