import { userRepository } from "@/repositories/user.repository";
import { MESSAGES } from "@/constant/common.constant";
import MaterialCodeRepository from "@/repositories/material_code.repository";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { mappingDataCreate } from "./material_code.mapping";
import { IMaterialCodeRequest } from "./material_code.type";

export default class MaterialCodeService {
  private materialCodeRepository: MaterialCodeRepository;
  constructor() {
    this.materialCodeRepository = new MaterialCodeRepository();
  }

  public async create(userId: string, payload: IMaterialCodeRequest) {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }
    const newPayload = mappingDataCreate(payload);
    const createdMaterialCode = await this.materialCodeRepository.create({
      ...newPayload,
      design_id: user.relation_id || "",
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

  public async getMaterialCodeGroup(design_id: string) {
    const materialCodes =
      await this.materialCodeRepository.getMaterialCodeWithCountByDesignId(
        design_id
      );
    return successResponse({ data: materialCodes });
  }

  public async getListCodeMaterialCode(design_id: string) {
    const materialCodes = await this.materialCodeRepository.getCodesByDesignId(
      design_id
    );
    return successResponse({
      data: materialCodes,
    });
  }
}
