import { v4 as uuidv4 } from "uuid";
import {
  DESIGN_STATUS_OPTIONS,
  PROJECT_STATUS,
  REGION_KEY,
} from "../../constant/common.constant";
import { getDistinctArray } from "../../helper/common.helper";
import DesignerModel, { IDesignerAttributes } from "../../model/designer.model";
import LocationModel from "../../model/location.model";
import ProjectModel from "../../model/project.model";
import UserModel from "../../model/user.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import MarketAvailabilityService from "../market_availability/market_availability.service";
import { MESSAGES, SYSTEM_TYPE } from "./../../constant/common.constant";
import { ILocationAttributes } from "./../../model/location.model";
import { IProjectAttributes } from "./../../model/project.model";
import { IUserAttributes } from "./../../model/user.model";
import {
  IDesignerResponse,
  IDesignersResponse,
  IDesignSummary,
  IUpdateDesignStatusRequest,
} from "./designer.type";

export default class DesignerService {
  private designerModel: DesignerModel;
  private userModel: UserModel;
  private marketAvailabilityService: MarketAvailabilityService;
  private locationModel: LocationModel;
  private projectModel: ProjectModel;
  constructor() {
    this.designerModel = new DesignerModel();
    this.userModel = new UserModel();
    this.marketAvailabilityService = new MarketAvailabilityService();
    this.locationModel = new LocationModel();
    this.projectModel = new ProjectModel();
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
          const users = await this.userModel.getMany(
            designer.team_profile_ids,
            ["id", "firstname", "lastname", "role_id", "email", "avatar"]
          );
          let originLocation: ILocationAttributes | undefined;
          if (designer.location_ids && designer.location_ids.length > 0) {
            originLocation = await this.locationModel.find(
              designer.location_ids[0] || ""
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
            designers: designer.team_profile_ids.length,
            capacities: 1,
            projects: projects.length,
            live: countLive,
            on_hold: countOnHold,
            archived: countArchived,
            status: designer.status,
            status_key: foundStatus?.key,
            assign_team: users,
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
  public getOne = (
    id: string
  ): Promise<IDesignerResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const designer = await this.designerModel.find(id);
      if (!designer) {
        return resolve({
          message: "Not found designer.",
          statusCode: 404,
        });
      }
      return resolve({
        data: designer,
        statusCode: 200,
      });
    });
  };

  public getAllDesignSummary = (): Promise<IDesignSummary | any> => {
    return new Promise(async (resolve) => {
      const allDesignFirm = await this.designerModel.getAll();

      const countDesigner = allDesignFirm.reduce((pre: number, cur) => {
        return cur.team_profile_ids ? pre + cur.team_profile_ids.length : pre;
      }, 0);

      const locations = await this.locationModel.getLocationDesign();

      const originLocationIds = await this.locationModel.getOriginCountry();

      const countries = await this.marketAvailabilityService.getRegionCountries(
        getDistinctArray(originLocationIds)
      );

      const projects = await this.projectModel.getAll();

      return resolve({
        data: [
          {
            id: uuidv4(),
            quantity: allDesignFirm.length,
            label: "DESIGN FIRMS",
            subs: [
              {
                id: uuidv4(),
                quantity: locations.length,
                label: "Locations",
              },
              {
                id: uuidv4(),
                quantity: countDesigner,
                label: "Designers",
              },
            ],
          },
          {
            id: uuidv4(),
            quantity: countries.length,
            label: "COUNTRIES",
            subs: [
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.AFRICA
                ).length,
                label: "Africa",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.ASIA
                ).length,
                label: "Asia",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.EUROPE
                ).length,
                label: "Europe",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.NORTH_AMERICA
                ).length,
                label: "N.America",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.OCEANIA
                ).length,
                label: "Oceania",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.SOUTH_AMERICA
                ).length,
                label: "S.America",
              },
            ],
          },
          {
            id: uuidv4(),
            quantity: projects.length,
            label: "PROJECTS",
            subs: [
              {
                id: uuidv4(),
                quantity: projects.filter(
                  (project) => project.status === PROJECT_STATUS.LIVE
                ).length,
                label: "Live",
              },
              {
                id: uuidv4(),
                quantity: projects.filter(
                  (project) => project.status === PROJECT_STATUS.ON_HOLD
                ).length,
                label: "On Hold",
              },
              {
                id: uuidv4(),
                quantity: projects.filter(
                  (project) => project.status === PROJECT_STATUS.ARCHIVE
                ).length,
                label: "Archived",
              },
            ],
          },
        ],
        statusCode: 200,
      });
    });
  };

  public updateDesignStatus = async (
    design_id: string,
    payload: IUpdateDesignStatusRequest
  ): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const designer = await this.designerModel.find(design_id);
      if (!designer) {
        return resolve({
          message: "Not found designer.",
          statusCode: 404,
        });
      }
      if (payload.status !== designer.status) {
        const updatedDesignStatus = await this.designerModel.update(design_id, {
          status: payload.status,
        });
        if (!updatedDesignStatus) {
          return resolve({
            message: MESSAGES.SOMETHING_WRONG_UPDATE,
            statusCode: 400,
          });
        }

        return resolve({
          message: MESSAGES.SUCCESS,
          statusCode: 200,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
}
