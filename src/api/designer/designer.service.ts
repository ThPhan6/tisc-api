import {
  DESIGN_STATUS_OPTIONS,
  PROJECT_STATUS,
  REGION_KEY,
} from "../../constant/common.constant";
import DesignerModel, { IDesignerAttributes } from "../../model/designer.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IDesignerResponse,
  IDesignersResponse,
  IDesignSummary,
} from "./designer.type";
import UserModel from "../../model/user.model";
import { v4 as uuidv4 } from "uuid";
import { getDistinctArray } from "../../helper/common.helper";
import MarketAvailabilityModel from "../../model/market_availability.model";
import LocationModel from "../../model/location.model";
import MarketAvailabilityService from "../market_availability/market_availability.service";
import ProjectModel from "../../model/project.model";

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
    sort_name: string,
    sort_order: "ASC" | "DESC"
  ): Promise<IDesignersResponse | any> => {
    return new Promise(async (resolve) => {
      const designers: IDesignerAttributes[] = await this.designerModel.list(
        limit,
        offset,
        filter,
        [sort_name, sort_order]
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
          return {
            id: designer.id,
            name: designer.name,
            logo: designer.logo,
            origin: "",
            main_office: "",
            satellites: 1,
            designers: 1,
            capacities: 1,
            projects: 1,
            live: 1,
            on_hold: 1,
            archived: 1,
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
          message: "Not found desinger.",
          statusCode: 404,
        });
      }
      return resolve({
        data: designer,
        statusCode: 200,
      });
    });
  };

  public getAllDesignSummary = (): Promise<IDesignSummary> => {
    return new Promise(async (resolve) => {
      const allDesignFirm = await this.designerModel.getAll();
      const locationIds = getDistinctArray(
        allDesignFirm.reduce((pre: string[], cur) => {
          return pre.concat(cur.location_ids);
        }, [])
      );
      const teamProfileIds = getDistinctArray(
        allDesignFirm.reduce((pre: string[], cur) => {
          return pre.concat(cur.team_profile_ids);
        }, [])
      );
      const countryIds = await Promise.all(
        locationIds.map(async (locationId) => {
          const location = await this.locationModel.find(locationId);
          return location?.country_id || "";
        })
      );
      const distinctCountryIds = getDistinctArray(countryIds);
      const countries = await this.marketAvailabilityService.getRegionCountries(
        distinctCountryIds
      );
      const projects = await Promise.all(
        allDesignFirm.map(async (designFirm) => {
          return await this.projectModel.getBy({ design_id: designFirm.id });
        })
      );
      return resolve({
        data: [
          {
            id: uuidv4(),
            quantity: allDesignFirm.length,
            label: "DESIGN FIRMS",
            subs: [
              {
                id: uuidv4(),
                quantity: locationIds.length,
                label: "Locations",
              },
              {
                id: uuidv4(),
                quantity: teamProfileIds.length,
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
            quantity: projects.flat(Infinity).length,
            label: "PROJECTS",
            subs: [
              {
                id: uuidv4(),
                quantity: projects
                  .flat()
                  .filter((project) => project.status === PROJECT_STATUS.LIVE)
                  .length,
                label: "Live",
              },
              {
                id: uuidv4(),
                quantity: projects
                  .flat()
                  .filter(
                    (project) => project.status === PROJECT_STATUS.ON_HOLD
                  ).length,
                label: "On Hold",
              },
              {
                id: uuidv4(),
                quantity: projects
                  .flat()
                  .filter(
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
}
