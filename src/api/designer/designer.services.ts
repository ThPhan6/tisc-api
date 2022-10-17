import {
  COMMON_TYPES,
  DESIGN_STORE,
  MESSAGES,
  VALID_IMAGE_TYPES,
} from "@/constants";
import {
  getDistinctArray,
  getFileTypeFromBase64,
  pagination,
  randomName,
} from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import ProjectModel from "@/model/project.model";
import { designerRepository } from "@/repositories/designer.repository";
import { locationRepository } from "@/repositories/location.repository";
import { deleteFile, isExists } from "@/service/aws.service";
import {
  uploadImage,
  uploadLogoOfficeProfile,
  validateImageType,
} from "@/service/image.service";
import { DesignerAttributes } from "@/types";
import { object } from "joi";
import { marketAvailabilityService } from "../market_availability/market_availability.services";
import { settingService } from "../setting/setting.service";
import {
  mappingCountDesigner,
  mappingDesignSummary,
  mappingGetListDesigner,
} from "./designer.mapping";
class DesignerService {
  private projectModel: ProjectModel;
  constructor() {
    this.projectModel = new ProjectModel();
  }

  public async getList(
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: "ASC" | "DESC"
  ) {
    const dataDesigners = await designerRepository.getListDesignerCustom(
      limit,
      offset,
      sort,
      order
    );

    const totalDesigner = await designerRepository.getModel().count();

    const result = mappingGetListDesigner(dataDesigners);
    return successResponse({
      data: {
        designers: result,
        pagination: pagination(limit, offset, totalDesigner),
      },
    });
  }

  public async getOne(id: string) {
    const designer = await designerRepository.find(id);

    if (!designer) {
      return errorMessageResponse(MESSAGES.DESIGNER.DESIGN_NOT_FOUND);
    }

    return successResponse({
      data: designer,
    });
  }

  public async getAllDesignSummary() {
    const allDesignFirm = await designerRepository.getAll();

    const countDesigner = mappingCountDesigner(allDesignFirm);

    const locations = await locationRepository.getLocationDesign();

    const originLocationIds = await locationRepository.getOriginCountry();

    const countries = await marketAvailabilityService.getRegionCountries(
      getDistinctArray(originLocationIds)
    );

    const projects = await this.projectModel.getAll();

    const result = mappingDesignSummary(
      allDesignFirm,
      locations,
      countDesigner,
      countries,
      projects
    );

    return successResponse({
      data: result,
    });
  }

  public async updateDesign(
    designId: string,
    payload: Partial<DesignerAttributes>
  ) {
    const designer = await designerRepository.find(designId);

    if (!designer) {
      return errorMessageResponse(MESSAGES.DESIGNER.DESIGN_NOT_FOUND);
    }

    if (payload.status) {
      await designerRepository.update(designId, {
        status: payload.status,
      });

      return successMessageResponse(MESSAGES.SUCCESS);
    } else {
      let logoPath = await uploadLogoOfficeProfile(
        payload.logo || `/${DESIGN_STORE}`,
        designer.logo || `/${DESIGN_STORE}`
      );

      if (typeof logoPath == "object") {
        return errorMessageResponse(logoPath.message);
      }

      payload.capabilities = await settingService.findOrCreateList(
        payload.capabilities || [],
        designer.id,
        COMMON_TYPES.CAPABILITIES
      );

      return successResponse({
        data: await designerRepository.update(designId, {
          ...payload,
          logo: `/${logoPath}`,
        }),
      });
    }
  }
}

export const designerService = new DesignerService();
export default DesignerService;
