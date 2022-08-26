import MaterialCodeModel, {
  MATERIAL_CODE_NULL_ATTRIBUTES,
} from "../../model/material_code.model";
import { IMessageResponse } from "../../type/common.type";
import {
  IGetListCodeMaterialCode,
  IMaterialCodeGroupResponse,
  IMaterialCodeRequest,
  IMaterialCodeResponse,
} from "./material_code.type";
import { v4 as uuid } from "uuid";
import { MESSAGES } from "../../constant/common.constant";

export default class MaterialCodeService {
  private materialCodeModel: MaterialCodeModel;

  constructor() {
    this.materialCodeModel = new MaterialCodeModel();
  }
  public create = (
    user_id: string,
    payload: IMaterialCodeRequest
  ): Promise<IMessageResponse | IMaterialCodeResponse> =>
    new Promise(async (resolve) => {
      const newPayload = {
        ...payload,
        subs: payload.subs.map((sub) => ({
          ...sub,
          id: uuid(),
          codes: sub.codes.map((code) => ({
            ...code,
            id: uuid(),
          })),
        })),
      };
      const createdMaterialCode = await this.materialCodeModel.create({
        ...MATERIAL_CODE_NULL_ATTRIBUTES,
        ...newPayload,
        design_id: user_id,
      });
      if (!createdMaterialCode) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(createdMaterialCode.id));
    });
  public get = (
    id: string
  ): Promise<IMaterialCodeResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const materialCode = await this.materialCodeModel.find(id);
      if (!materialCode) {
        return resolve({
          message: MESSAGES.MATERIAL_CODE_NOT_FOUND,
          statusCode: 404,
        });
      }
      return resolve({
        data: materialCode,
        statusCode: 200,
      });
    });

  public getMaterialCodeGroup = (
    design_id: string
  ): Promise<IMaterialCodeGroupResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const materialCodes = await this.materialCodeModel.getAllMaterialCodeByDesignId(design_id);
      const result = materialCodes.map((materialCode) => {
        const mainList = materialCode.subs.map((mainList) => {
          return {
            id: mainList.id,
            name: mainList.name,
            count: mainList.codes.length,
            codes: mainList.codes,
          };
        });
        return {
          id: materialCode.id,
          name: materialCode.name,
          count: mainList.length,
          subs: mainList,
        };
      });
      return resolve({
        data: result,
        statusCode: 200,
      });
    });

  public getListCodeMaterialCode = (
    design_id: string
  ): Promise<IGetListCodeMaterialCode> =>
    new Promise(async (resolve) => {
      const materialCodes = await this.materialCodeModel.getAllMaterialCodeByDesignId(design_id);
      const result = materialCodes
        .map((materialCode) => {
          return materialCode.subs.map((mainList) => {
            return mainList.codes.map((code) => code);
          });
        })
        .flat(Infinity);
      return resolve({
        data: result as IGetListCodeMaterialCode["data"],
        statusCode: 200,
      });
    });
}
