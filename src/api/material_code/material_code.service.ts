import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import { materialCodeRepository } from "@/repositories/material_code.repository";
import { projectProductRepository } from "./../project_product/project_product.repository";
import {
  mappingCheckDuplicatePayload,
  mappingDataCreate,
  mappingMaterialCodeUpdate,
  mappingSortMaterialCode,
  mappingSummaryMaterialCode,
} from "./material_code.mapping";
import { IMaterialCodeRequest } from "./material_code.type";
import { UserAttributes, SortOrder } from "@/types";

class MaterialCodeService {
  public async create(user: UserAttributes, payload: IMaterialCodeRequest) {
    const newPayload = mappingDataCreate(payload);
    const createdMaterialCode = await materialCodeRepository.create({
      ...newPayload,
      design_id: user.relation_id || "",
    });
    if (!createdMaterialCode) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }
    return successResponse({ data: createdMaterialCode });
  }

  public async get(id: string) {
    const materialCode = await materialCodeRepository.find(id);
    if (!materialCode) {
      return errorMessageResponse(
        MESSAGES.MATERIAL_CODE.MATERIAL_CODE_NOT_FOUND,
        404
      );
    }
    return successResponse({
      data: materialCode,
    });
  }

  public async getMaterialCodes(
    mainMaterialCodeOrder: SortOrder | undefined,
    subMaterialCodeOrder: SortOrder,
    materialCodeOrder: SortOrder,
    designId?: string
  ) {
    const materialCodes = await materialCodeRepository.getListMaterialCode(
      mainMaterialCodeOrder,
      designId
    );

    const sortedMaterialCodes = mappingSortMaterialCode(
      materialCodes,
      subMaterialCodeOrder,
      materialCodeOrder
    );

    const summaryTable = mappingSummaryMaterialCode(materialCodes);

    const summary = [
      {
        name: "Main List",
        value: summaryTable.countMainMaterialCode,
      },
      {
        name: "Sub-List",
        value: summaryTable.countSubMaterialCode,
      },
      {
        name: "Product Code",
        value: summaryTable.countMaterialCode,
      },
    ];

    return successResponse({
      data: {
        material_codes: sortedMaterialCodes,
        summary,
      },
    });
  }

  public async getListCodeMaterialCode(user: UserAttributes) {
    const materialCodes = await materialCodeRepository.getCodesByUser(user.id);
    return successResponse({
      data: materialCodes,
    });
  }

  public async update(
    id: string,
    user: UserAttributes,
    payload: IMaterialCodeRequest
  ) {
    const materialCode = await materialCodeRepository.find(id);

    if (!materialCode) {
      return errorMessageResponse(
        MESSAGES.MATERIAL_CODE.MATERIAL_CODE_NOT_FOUND,
        404
      );
    }

    const mainMaterialCodeDuplicated =
      await materialCodeRepository.getExistedMaterialCode(
        id,
        user.relation_id,
        payload.name
      );

    if (mainMaterialCodeDuplicated) {
      return errorMessageResponse(MESSAGES.MATERIAL_CODE.MATERIAL_CODE_EXISTED);
    }

    const payloadDuplicated = mappingCheckDuplicatePayload(payload);

    if (payloadDuplicated) return errorMessageResponse(payloadDuplicated);

    const subMaterialCodes = mappingMaterialCodeUpdate(payload);

    const updatedMaterialCode = await materialCodeRepository.update(id, {
      name: payload.name,
      subs: subMaterialCodes,
    });

    if (!updatedMaterialCode) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }

    return successResponse({ data: updatedMaterialCode });
  }

  public async delete(id: string) {
    const materialCode = await materialCodeRepository.find(id);

    if (!materialCode) {
      return errorMessageResponse(
        MESSAGES.MATERIAL_CODE.MATERIAL_CODE_NOT_FOUND,
        404
      );
    }

    const usedMaterialCode = await projectProductRepository.findBy({
      material_code_id: id,
    });

    if (usedMaterialCode) {
      return errorMessageResponse(MESSAGES.MATERIAL_CODE.CAN_NOT_DELETE);
    }

    const deletedMaterialCode = await materialCodeRepository.delete(id);

    if (!deletedMaterialCode) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_DELETE);
    }

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }
}

export const materialCodeService = new MaterialCodeService();
export default MaterialCodeService;
