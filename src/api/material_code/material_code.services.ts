import {
  errorMessageResponse,
  successResponse,
} from "./../../helper/response.helper";
import MaterialCodeModel, {
  MATERIAL_CODE_NULL_ATTRIBUTES,
} from "@/model/material_code.model";
import { IMessageResponse } from "@/type/common.type";
import {
  IGetListCodeMaterialCode,
  IMaterialCodeGroupResponse,
  IMaterialCodeRequest,
  IMaterialCodeResponse,
} from "./material_code.type";
import { v4 as uuid } from "uuid";
import { MESSAGES } from "@/constant/common.constant";
import MaterialCodeRepository from "@/repositories/material_code.repository";
import { mappingDataCreate } from "./material_code.mapping";

export default class MaterialCodeService {
  private materialCodeModel: MaterialCodeModel;
  private materialCodeRepository: MaterialCodeRepository;
  constructor() {
    this.materialCodeModel = new MaterialCodeModel();
    this.materialCodeRepository = new MaterialCodeRepository();
  }

  public async create(user_id: string, payload: IMaterialCodeRequest) {
    const newPayload = mappingDataCreate(payload);
    const createdMaterialCode = await this.materialCodeRepository.create({
      ...newPayload,
      design_id: user_id,
    });
    if (!createdMaterialCode) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return successResponse({ data: createdMaterialCode });
  }

  public async get(id: string) {
    const materialCode = await this.materialCodeRepository.find(id);
    if (!materialCode) {
      return errorMessageResponse(MESSAGES.MATERIAL_CODE_NOT_FOUND, 404);
    }
    return successResponse({
      data: materialCode,
    });
  }

  public getMaterialCodeGroup = (
    design_id: string
  ): Promise<IMaterialCodeGroupResponse | IMessageResponse> =>
    new Promise(async (resolve) => {
      const materialCodes =
        await this.materialCodeModel.getAllMaterialCodeByDesignId(design_id);

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
      const materialCodes =
        await this.materialCodeModel.getAllMaterialCodeByDesignId(design_id);
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
