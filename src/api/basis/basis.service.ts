import { MESSAGES } from "../../constant/common.constant";
import BasisModel, { BASIS_NULL_ATTRIBUTES } from "../../model/basis.model";
import { BASIS_TYPES } from "./../../constant/common.constant";
import { IBasisAttributes } from "./../../model/basis.model";
import { IMessageResponse } from "./../../type/common.type";
import {
  IBasisConversionsResponse,
  IBasisConversionRequest,
  IBasisConversionResponse,
  IBasisOptionRequest,
  IBasisOptionResponse,
  IBasisOptionsResponse,
  IUpdateBasisOptionRequest,
} from "./basis.type";
import { v4 as uuid } from "uuid";
import {
  isDuplicatedString,
  sortObjectArray,
} from "../../helper/common.helper";

export default class BasisService {
  private basisModel: BasisModel;
  constructor() {
    this.basisModel = new BasisModel();
  }
  private addCount = (data: any) => {
    const totalCount = data.length;
    let subCount = 0;
    let childSubCount = 0;
    const result = data.map((item: any) => {
      if (item.subs) {
        item.subs.map((el: any) => {
          if (el.subs) {
            childSubCount += el.subs.length;
            return {
              ...el,
              count: el.subs.length,
            };
          }
        });
        subCount += item.subs.length;
        return {
          ...item,
          count: item.subs.length,
        };
      }
      return {
        ...item,
        count: 0,
      };
    });
    return {
      totalCount,
      subCount,
      childSubCount,
      data: result,
    };
  };

  public createBasisConversion = async (
    payload: IBasisConversionRequest
  ): Promise<IMessageResponse | IBasisConversionResponse> => {
    return new Promise(async (resolve) => {
      const basisConversion = await this.basisModel.findBy({
        name: payload.name.toLowerCase(),
        type: BASIS_TYPES.CONVERSION,
      });

      if (basisConversion) {
        return resolve({
          message: MESSAGES.DUPLICATED_GROUP_BASIS,
          statusCode: 400,
        });
      }

      let isCheckedSubsDuplicate = false;
      payload.subs.forEach((item) => {
        if (item.name_1 === item.name_2 || item.unit_1 === item.unit_2) {
          isCheckedSubsDuplicate = true;
        }
      });

      if (isCheckedSubsDuplicate) {
        return resolve({
          message: MESSAGES.DUPLICATED_CONVERSION,
          statusCode: 400,
        });
      }

      const conversions = payload.subs.map((item) => {
        return {
          id: uuid(),
          name_1: item.name_1,
          name_2: item.name_2,
          forumla_1: item.forumla_1,
          forumla_2: item.forumla_2,
          unit_1: item.unit_1,
          unit_2: item.unit_2,
        };
      });

      const createdBasisConverion = await this.basisModel.create({
        ...BASIS_NULL_ATTRIBUTES,
        name: payload.name,
        type: BASIS_TYPES.CONVERSION,
        subs: conversions,
      });
      if (!createdBasisConverion) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = createdBasisConverion;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getBasisConversions = async (
    limit: number,
    offset: number,
    filter: any,
    conversion_group_order: "ASC" | "DESC",
    conversion_between_order: "ASC" | "DESC"
  ): Promise<IMessageResponse | IBasisConversionsResponse> => {
    return new Promise(async (resolve) => {
      const conversionGroups = await this.basisModel.list(
        limit,
        offset,
        {
          ...filter,
          type: BASIS_TYPES.CONVERSION,
        },
        ["name", conversion_group_order]
      );
      let returnedConverionGroups = conversionGroups.map(
        (item: IBasisAttributes) => {
          const { type, is_deleted, ...rest } = {
            ...item,
            subs: sortObjectArray(item.subs, "name", conversion_between_order),
          };
          return { ...rest, count: item.subs.length };
        }
      );
      returnedConverionGroups = returnedConverionGroups.map(
        (item: IBasisAttributes) => {
          const subsBasisConversion = item.subs.map((element: any) => {
            return {
              ...element,
              conversion_between: element.name_1 + " - " + element.name_2,
              first_forumla:
                element.forumla_1 +
                " " +
                element.unit_1 +
                " = " +
                1 +
                " " +
                element.unit_2,
              second_forumla:
                element.forumla_2 +
                " " +
                element.unit_2 +
                " = " +
                1 +
                " " +
                element.unit_2,
            };
          });
          return {
            ...item,
            subs: subsBasisConversion,
          };
        }
      );
      const addedCount = this.addCount(returnedConverionGroups);
      return resolve({
        data: {
          basis_conversions: returnedConverionGroups,
          conversion_group_count: addedCount.totalCount,
          conversion_count: addedCount.subCount,
        },
        statusCode: 200,
      });
    });
  };

  public getBasisConversionById = async (
    id: string
  ): Promise<IMessageResponse | IBasisConversionResponse> => {
    return new Promise(async (resolve) => {
      let basisConversion = await this.basisModel.find(id);
      if (!basisConversion) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const result = basisConversion.subs.map((item: any) => {
        return {
          ...item,
          conversion_between: item.name_1 + " - " + item.name_2,
          first_forumla:
            item.forumla_1 + " " + item.unit_1 + " = " + 1 + " " + item.unit_2,
          second_forumla:
            item.forumla_2 + " " + item.unit_2 + " = " + 1 + " " + item.unit_2,
        };
      });
      const { type, is_deleted, ...rest } = basisConversion;
      return resolve({
        data: {
          ...rest,
          subs: result,
        },
        statusCode: 200,
      });
    });
  };

  public updateBasisConversion = async (
    id: string,
    payload: IBasisConversionRequest
  ): Promise<IMessageResponse | IBasisConversionResponse> => {
    return new Promise(async (resolve) => {
      const basisConversion = await this.basisModel.find(id);
      if (!basisConversion) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_NOT_FOUND,
          statusCode: 404,
        });
      }
      const duplicatedConversionGroup =
        await this.basisModel.getDuplicatedBasis(id, payload.name);
      if (duplicatedConversionGroup) {
        return resolve({
          message: MESSAGES.DUPLICATED_GROUP_BASIS,
          statusCode: 400,
        });
      }

      let duplicatedConversion = false;
      payload.subs.forEach((item) => {
        if (item.name_1 === item.name_2 || item.unit_1 === item.unit_2) {
          duplicatedConversion = true;
        }
      });

      if (duplicatedConversion) {
        return resolve({
          message: MESSAGES.DUPLICATED_CONVERSION,
          statusCode: 400,
        });
      }

      const conversions = payload.subs.map((item) => {
        if (item.id) {
          return item;
        }
        return {
          ...item,
          id: uuid(),
        };
      });

      const updatedBasisConverison = await this.basisModel.update(id, {
        ...BASIS_NULL_ATTRIBUTES,
        name: payload.name,
        type: BASIS_TYPES.CONVERSION,
        subs: conversions,
      });

      if (!updatedBasisConverison) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = updatedBasisConverison;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public deleteBasisConversion = async (
    id: string
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const basisConversion = await this.basisModel.find(id);
      if (!basisConversion) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_NOT_FOUND,
          statusCode: 404,
        });
      }
      await this.basisModel.update(id, { is_deleted: true });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
  public createBasisOption = (
    payload: IBasisOptionRequest
  ): Promise<IMessageResponse | IBasisOptionResponse> => {
    return new Promise(async (resolve) => {
      const group = await this.basisModel.findBy({
        type: BASIS_TYPES.OPTION,
        name: payload.name.toLowerCase(),
      });
      if (group) {
        return resolve({
          message: MESSAGES.BASIS_OPTION_EXISTS,
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
          message: MESSAGES.DUPLICATED_BASIS_OPTION,
          statusCode: 400,
        });
      }
      const options = payload.subs.map((item) => {
        const values = item.subs.map((value) => {
          return {
            id: uuid(),
            value_1: value.value_1,
            value_2: value.value_2,
            unit_1: value.unit_1,
            unit_2: value.unit_2,
          };
        });
        return {
          id: uuid(),
          name: item.name,
          subs: values,
        };
      });
      const createdBasisOption = await this.basisModel.create({
        ...BASIS_NULL_ATTRIBUTES,
        name: payload.name,
        type: BASIS_TYPES.OPTION,
        subs: options,
      });
      if (!createdBasisOption) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = createdBasisOption;
      const returnedOptions = createdBasisOption.subs.map((option: any) => {
        return {
          ...option,
          count: option.subs.length,
        };
      });
      return resolve({
        data: {
          ...rest,
          count: payload.subs.length,
          subs: returnedOptions,
        },
        statusCode: 200,
      });
    });
  };
  public getBasisOption = (
    id: string
  ): Promise<IMessageResponse | IBasisOptionResponse> => {
    return new Promise(async (resolve) => {
      const group = await this.basisModel.find(id);
      if (!group) {
        return resolve({
          message: MESSAGES.NOT_FOUND_ATTRIBUTE,
          statusCode: 404,
        });
      }
      const option = group.subs.map((item: any) => {
        return {
          ...item,
          count: item.subs.length,
        };
      });
      const { type, is_deleted, ...rest } = group;
      return resolve({
        data: {
          ...rest,
          count: group.subs.length,
          subs: option,
        },
        statusCode: 200,
      });
    });
  };
  private countOptions = (groups: any[]) => {
    return groups.reduce((pre, cur) => {
      return pre + cur.subs.length;
    }, 0);
  };
  private countValues = (groups: any[]) => {
    let result = 0;
    groups.forEach((group) => {
      result += group.subs.reduce((pre: any, cur: any) => {
        return pre + cur.subs.length;
      }, 0);
    });
    return result;
  };
  public getListBasisOption = (
    limit: number,
    offset: number,
    filter: any,
    group_order: "ASC" | "DESC",
    option_order: "ASC" | "DESC"
  ): Promise<IMessageResponse | IBasisOptionsResponse> => {
    return new Promise(async (resolve) => {
      const groups = await this.basisModel.list(
        limit,
        offset,
        { ...filter, type: BASIS_TYPES.OPTION },
        ["name", group_order]
      );

      const returnedGroups = groups.map((item: IBasisAttributes) => {
        const returnedOptions = item.subs.map((option: any) => {
          return {
            ...option,
            count: option.subs.length,
          };
        });
        const { type, is_deleted, ...rest } = {
          ...item,
          subs: sortObjectArray(returnedOptions, "name", option_order),
        };
        return rest;
      });
      return resolve({
        data: {
          basis_options: returnedGroups,
          group_count: groups.length,
          option_count: this.countOptions(groups),
          value_count: this.countValues(groups),
        },
        statusCode: 200,
      });
    });
  };
  private getAllValueInOneGroup = (group: any) => {
    let result: any[] = [];
    group.subs.map((option: any) => {
      result = result.concat(option.subs);
    });
    return result;
  };
  public updateBasisOption = (
    id: string,
    payload: IUpdateBasisOptionRequest
  ): Promise<IMessageResponse | IBasisOptionResponse | any> => {
    return new Promise(async (resolve) => {
      const group = await this.basisModel.find(id);
      if (!group) {
        return resolve({
          message: MESSAGES.NOT_FOUND_ATTRIBUTE,
          statusCode: 404,
        });
      }
      const existedGroup = await this.basisModel.getExistedBasisOption(
        id,
        payload.name
      );
      if (existedGroup) {
        return resolve({
          message: MESSAGES.BASIS_OPTION_EXISTS,
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
          message: MESSAGES.DUPLICATED_BASIS_OPTION,
          statusCode: 400,
        });
      }
      const options = payload.subs.map((item) => {
        let foundOption = false;
        if (item.id) {
          const foundItem = group.subs.find((sub: any) => sub.id === item.id);
          if (foundItem) {
            foundOption = true;
          }
        }
        const values = item.subs.map((value) => {
          let foundValue = false;
          if (value.id) {
            const foundItem = this.getAllValueInOneGroup(group).find(
              (valueInGroup) => valueInGroup.id === value.id
            );
            if (foundItem) {
              foundValue = true;
            }
          }
          if (foundValue) {
            return value;
          }
          return {
            ...value,
            id: uuid(),
          };
        });
        if (foundOption) {
          return {
            ...item,
            subs: values,
          };
        }
        return {
          ...item,
          subs: values,
          id: uuid(),
        };
      });
      const updatedAttribute = await this.basisModel.update(id, {
        ...payload,
        subs: options,
      });
      if (!updatedAttribute) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve(this.getBasisOption(id));
    });
  };
}
