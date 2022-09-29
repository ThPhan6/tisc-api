import { userRepository } from "@/repositories/user.repository";
import { locationRepository } from "@/repositories/location.repository";
import {
  errorMessageResponse,
  successResponse,
  successMessageResponse,
} from "@/helper/response.helper";
import {
  DESIGN_STATUS_OPTIONS,
  MESSAGES,
  PROJECT_STATUS,
  REGION_KEY,
} from "@/constant/common.constant";
import { getDistinctArray } from "@/helper/common.helper";
import DesignerModel, { IDesignerAttributes } from "@/model/designer.model";
import LocationModel, { ILocationAttributes } from "@/model/location.model";
import ProjectModel from "@/model/project.model";
import UserModel, { IUserAttributes } from "@/model/user.model";
import { designerRepository } from "@/repositories/designer.repository";
import { IMessageResponse, IPagination } from "@/type/common.type";
import { v4 as uuidv4 } from "uuid";
import MarketAvailabilityServices from "../market_availability/market_availability.services";
import {
  IDesignerResponse,
  IDesignersResponse,
  IDesignSummary,
  IUpdateDesignStatusRequest,
} from "./designer.type";
import { mappingCountDesigner, mappingDesignSummary } from "./designer.mapping";
export default class DesignerService {
  private designerModel: DesignerModel;
  private userModel: UserModel;
  private locationModel: LocationModel;
  private projectModel: ProjectModel;
  constructor() {
    this.designerModel = new DesignerModel();
    this.userModel = new UserModel();
    this.locationModel = new LocationModel();
    this.projectModel = new ProjectModel();
  }

  public async getList_(
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: "ASC" | "DESC"
  ) {
    const data = await designerRepository.getListDesignerCustom(
      limit,
      offset,
      sort,
      order
    );
    const result = await Promise.all(
      data.map(async (item: any) => {
        const foundStatus = DESIGN_STATUS_OPTIONS.find(
          (designStatus) => designStatus.value === item.designer.status
        );
        return {
          id: item.designer.id,
          name: item.designer.name,
          logo: item.designer.logo,
          origin: item.origin_location[0]?.country_name || "",
          main_office: "",
          satellites: 1,
          designers: item.users,
          capacities: 1,
          projects: item.projects.length,
          // live: countLive,
          // on_hold: countOnHold,
          // archived: countArchived,
          status: item.designer.status,
          status_key: foundStatus?.key,
          assign_team: item.assign_team,
          created_at: item.designer.created_at,
        };
      })
    );
  }

  public getList = (
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: "ASC" | "DESC"
  ): Promise<IDesignersResponse | any> => {
    return new Promise(async (resolve) => {
      const designers: IDesignerAttributes[] = await this.designerModel.list(
        limit,
        offset,
        filter,
        [sort, order]
      );
      const result = await Promise.all(
        designers.map(async (designer) => {
          const foundStatus = DESIGN_STATUS_OPTIONS.find(
            (item) => item.value === designer.status
          );
          const users = await this.userModel.getAllBy(
            {
              relation_id: designer.id,
            },
            ["id", "firstname", "lastname", "role_id", "email", "avatar"]
          );
          let assign_team: IUserAttributes[] = [];
          if (designer.team_profile_ids) {
            assign_team = await this.userModel.getMany(
              designer.team_profile_ids,
              ["id", "firstname", "lastname", "role_id", "email", "avatar"]
            );
          }

          let originLocation: ILocationAttributes | undefined;
          if (designer.location_ids) {
            originLocation = await this.locationModel.find(
              designer.location_ids[0] ?? ""
            );
          }

          let countLive = 0;
          let countOnHold = 0;
          let countArchived = 0;

          const projects = await this.projectModel.getBy({
            design_id: designer.id,
          });
          projects.forEach((project) => {
            switch (project.status) {
              case PROJECT_STATUS.LIVE:
                countLive += 1;
                break;
              case PROJECT_STATUS.ON_HOLD:
                countOnHold += 1;
                break;
              case PROJECT_STATUS.ARCHIVE:
                countArchived += 1;
                break;
              default:
                break;
            }
          });
          return {
            id: designer.id,
            name: designer.name,
            logo: designer.logo,
            origin: originLocation?.country_name || "",
            main_office: "",
            satellites: 1,
            designers: users.length,
            capacities: 1,
            projects: projects.length,
            live: countLive,
            on_hold: countOnHold,
            archived: countArchived,
            status: designer.status,
            status_key: foundStatus?.key,
            assign_team: assign_team,
            created_at: designer.created_at,
          };
        })
      );
      const pagination: IPagination = await this.designerModel.getPagination(
        limit,
        offset
      );

      return resolve({
        data: {
          designers: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  };

  public async getOne(id: string) {
    const designer = await designerRepository.find(id);

    if (!designer) {
      return errorMessageResponse(MESSAGES.DESIGN_NOT_FOUND);
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
      return errorMessageResponse(MESSAGES.DESIGN_NOT_FOUND);
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
