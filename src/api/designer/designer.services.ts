import { MESSAGES } from "@/constants";
import { getDistinctArray, pagination } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import ProjectModel from "@/model/project.model";
import { designerRepository } from "@/repositories/designer.repository";
import { locationRepository } from "@/repositories/location.repository";
import MarketAvailabilityServices from "../market_availability/market_availability.services";
import {
  mappingCountDesigner,
  mappingDesignSummary,
  mappingGetListDesigner,
} from "./designer.mapping";
import { IUpdateDesignStatusRequest } from "./designer.type";
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
    const result = mappingGetListDesigner(dataDesigners);
    return successResponse({
      data: {
        designers: result,
        pagination: pagination(limit, offset, result.length),
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

    const countries = await MarketAvailabilityServices.getRegionCountries(
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

  public async updateDesignStatus(
    designId: string,
    payload: IUpdateDesignStatusRequest
  ) {
    const designer = await designerRepository.find(designId);

    if (!designer) {
      return errorMessageResponse(MESSAGES.DESIGNER.DESIGN_NOT_FOUND);
    }

    const updatedDesignStatus = await designerRepository.update(designId, {
      status: payload.status,
    });

    if (!updatedDesignStatus) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export const designerService = new DesignerService();
export default DesignerService;
