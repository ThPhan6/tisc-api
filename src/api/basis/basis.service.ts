import { MESSAGES } from "../../constant/common.constant";
import BasisModel, { BASIS_NULL_ATTRIBUTES } from "../../model/basis.model";
import { BASIS_TYPES } from "./../../constant/common.constant";
import { IBasisAttributes } from "./../../model/basis.model";
import { IMessageResponse } from "./../../type/common.type";
import {
  IBasisConversionsResponse,
  IBasisConversionRequest,
  IBasisConversionResponse,
} from "./basis.type";
import { v4 as uuid } from "uuid";

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

  private makeSub = (subs: any) => {
    return subs.map((item: any) => {
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
  };

  public createBasisConversion = async (
    payload: IBasisConversionRequest
  ): Promise<IMessageResponse | IBasisConversionResponse> => {
    return new Promise(async (resolve) => {
      const existedBasisConversion = await this.basisModel.findBy({
        name: payload.name.toLowerCase(),
      });

      if (existedBasisConversion) {
        return resolve({
          message: MESSAGES.BASIS_CONVERSION_EXISTS,
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
          message: MESSAGES.BASIS_CONVERSION_EXISTS,
          statusCode: 400,
        });
      }
      const subData = this.makeSub(payload.subs);
      const result = await this.basisModel.create({
        ...BASIS_NULL_ATTRIBUTES,
        name: payload.name,
        type: BASIS_TYPES.CONVERSION,
        subs: subData,
      });
      if (!result) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = result;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getBasisConversions = async (
    limit: number,
    offset: number,
    filter?: any,
    sort?: any
  ): Promise<IMessageResponse | IBasisConversionsResponse> => {
    return new Promise(async (resolve) => {
      let basisConversions = await this.basisModel.list(
        limit,
        offset,
        filter,
        sort
      );
      if (!basisConversions) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }
      basisConversions = basisConversions.map((item: IBasisAttributes) => {
        const { type, is_deleted, ...rest } = item;
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
          ...rest,
          subs: subsBasisConversion,
        };
      });
      const result = this.addCount(basisConversions);
      return resolve({
        data: {
          bases_conversion: result.data,
          conversion_group_count: result.totalCount,
          conversion_count: result.subCount,
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
      const duplicatedBasis = await this.basisModel.getDuplicatedBasis(
        id,
        payload.name
      );
      if (duplicatedBasis) {
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
          message: MESSAGES.DUPLICATED_BASES,
          statusCode: 400,
        });
      }
      const subData = this.makeSub(payload.subs);
      const result = await this.basisModel.update(id, {
        ...BASIS_NULL_ATTRIBUTES,
        name: payload.name,
        type: BASIS_TYPES.CONVERSION,
        subs: subData,
      });

      if (!result) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const { type, is_deleted, ...rest } = result;
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
}
