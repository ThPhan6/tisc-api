import PermissionModel from "../../model/permission.model";
import PermissionDetailModel from "../../model/permission_detail.model";
import { ROLES } from "../../constant/user.constant";
import { SYSTEM_TYPE } from "../../constant/common.constant";
import {
  BRAND_PERMISSION_TITLE,
  DESIGN_PERMISSION_TITLE,
} from "../../constant/permission.constant";

export default class PermissionService {
  private permissionModel: PermissionModel;
  private permissionDetailModel: PermissionDetailModel;
  constructor() {
    this.permissionModel = new PermissionModel();
    this.permissionDetailModel = new PermissionDetailModel();
  }

  public createBrandPermission = (brand_id: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const permission = await this.permissionModel.findBy({
        type: SYSTEM_TYPE.BRAND,
        relation_id: brand_id,
      });
      if (permission) {
        return resolve(false);
      }
      const records = [
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/my_workspace.png",
          name: BRAND_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          url: "",
          number: 1,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/product.png",
          name: BRAND_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          url: "",
          number: 2,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/general_inquires.png",
          name: BRAND_PERMISSION_TITLE.GENERAL_INQUIRES,
          accessable: true,
          url: "",
          number: 3,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/project_tracking.png",
          name: BRAND_PERMISSION_TITLE.PROJECT_TRACKING,
          accessable: true,
          url: "",
          number: 4,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/administration.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION,
          accessable: null,
          url: "",
          number: 5,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/brand.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_BRAND_PROFILE,
          accessable: true,
          url: "",
          number: 6,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/location.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: true,
          url: "",
          number: 7,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/team_profile.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: true,
          url: "",
          number: 8,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/distributor.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_DISTRIBUTOR,
          accessable: true,
          url: "",
          number: 9,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/market_availability.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_MARKET_AVAILABILITY,
          accessable: true,
          url: "",
          number: 10,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/subscription.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_SUBSCRIPTION,
          accessable: true,
          url: "",
          number: 11,
          parent_number: 5,
        },
        //brand team
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/my_workspace.png",
          name: BRAND_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          url: "",
          number: 1,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/product.png",
          name: BRAND_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          url: "",
          number: 2,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/general_inquires.png",
          name: BRAND_PERMISSION_TITLE.GENERAL_INQUIRES,
          accessable: true,
          url: "",
          number: 3,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/project_tracking.png",
          name: BRAND_PERMISSION_TITLE.PROJECT_TRACKING,
          accessable: true,
          url: "",
          number: 4,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/administration.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION,
          accessable: null,
          url: "",
          number: 5,
          parent_number: null,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/brand.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_BRAND_PROFILE,
          accessable: false,
          url: "",
          number: 6,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/location.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: false,
          url: "",
          number: 7,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/team_profile.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: false,
          url: "",
          number: 8,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/distributor.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_DISTRIBUTOR,
          accessable: false,
          url: "",
          number: 9,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/market_availability.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_MARKET_AVAILABILITY,
          accessable: false,
          url: "",
          number: 10,
          parent_number: 5,
        },
        {
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/public/logo/subscription.png",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_SUBSCRIPTION,
          accessable: false,
          url: "",
          number: 11,
          parent_number: 5,
        },
      ];
      await Promise.all(
        records.map(async (record) => {
          await this.permissionModel.create(record);
        })
      );
      // create permission details
      let details = [];
      const adminPermissions = await this.permissionModel.getBy({
        role_id: ROLES.BRAND_ADMIN,
        type: SYSTEM_TYPE.BRAND,
        relation_id: brand_id,
      });
      adminPermissions?.forEach((permission) => {
        switch (permission.name.toLowerCase()) {
          case BRAND_PERMISSION_TITLE.MY_WORKSPACE:
            break;
          case BRAND_PERMISSION_TITLE.PRODUCT:
            break;
          case BRAND_PERMISSION_TITLE.GENERAL_INQUIRES:
            break;
          case BRAND_PERMISSION_TITLE.PROJECT_TRACKING:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_BRAND_PROFILE:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_LOCATION:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_DISTRIBUTOR:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_MARKET_AVAILABILITY:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_SUBSCRIPTION:
            break;

          default:
            break;
        }
      });
      const teamPermissions = await this.permissionModel.getBy({
        role_id: ROLES.BRAND_TEAM,
        type: SYSTEM_TYPE.BRAND,
        relation_id: brand_id,
      });
      teamPermissions?.forEach((permission) => {
        switch (permission.name.toLowerCase()) {
          case BRAND_PERMISSION_TITLE.MY_WORKSPACE:
            break;
          case BRAND_PERMISSION_TITLE.PRODUCT:
            break;
          case BRAND_PERMISSION_TITLE.GENERAL_INQUIRES:
            break;
          case BRAND_PERMISSION_TITLE.PROJECT_TRACKING:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_BRAND_PROFILE:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_LOCATION:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_DISTRIBUTOR:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_MARKET_AVAILABILITY:
            break;
          case BRAND_PERMISSION_TITLE.ADMINISTRATION_SUBSCRIPTION:
            break;

          default:
            break;
        }
      });
    });
  };
  public createDesignPermission = (design_id: string): Promise<boolean> => {
    return new Promise(async (resolve) => {
      const permission = await this.permissionModel.findBy({
        type: SYSTEM_TYPE.DESIGN,
        relation_id: design_id,
      });
      if (permission) {
        return resolve(false);
      }
      const records = [
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/my_workspace.png",
          name: DESIGN_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          url: "",
          number: 1,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/favourite.png",
          name: DESIGN_PERMISSION_TITLE.MY_FAVOURITE,
          accessable: true,
          url: "",
          number: 2,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/product.png",
          name: DESIGN_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          url: "",
          number: 3,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/project.png",
          name: DESIGN_PERMISSION_TITLE.PROJECT,
          accessable: true,
          url: "",
          number: 4,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_LIST,
          accessable: true,
          url: "",
          number: 5,
          parent_number: 4,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_BASIC,
          accessable: true,
          url: "",
          number: 6,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_ZONE,
          accessable: true,
          url: "",
          number: 7,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_CONSIDERED_PRODUCT,
          accessable: true,
          url: "",
          number: 8,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_SPECIFIED_PRODUCT,
          accessable: true,
          url: "",
          number: 9,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/administration.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION,
          accessable: true,
          url: "",
          number: 10,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/office.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_OFFICE_PROFILE,
          accessable: true,
          url: "",
          number: 11,
          parent_number: 10,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/location.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: true,
          url: "",
          number: 12,
          parent_number: 10,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/team_profile.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: true,
          url: "",
          number: 13,
          parent_number: 10,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/material.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_MATERIAL,
          accessable: true,
          url: "",
          number: 14,
          parent_number: 10,
        },
        // design team
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/my_workspace.png",
          name: DESIGN_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          url: "",
          number: 1,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/favourite.png",
          name: DESIGN_PERMISSION_TITLE.MY_FAVOURITE,
          accessable: true,
          url: "",
          number: 2,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/product.png",
          name: DESIGN_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          url: "",
          number: 3,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/project.png",
          name: DESIGN_PERMISSION_TITLE.PROJECT,
          accessable: true,
          url: "",
          number: 4,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_LIST,
          accessable: true,
          url: "",
          number: 5,
          parent_number: 4,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_BASIC,
          accessable: true,
          url: "",
          number: 6,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_ZONE,
          accessable: true,
          url: "",
          number: 7,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_CONSIDERED_PRODUCT,
          accessable: true,
          url: "",
          number: 8,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          name: DESIGN_PERMISSION_TITLE.PROJECT_SPECIFIED_PRODUCT,
          accessable: true,
          url: "",
          number: 9,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/administration.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION,
          accessable: true,
          url: "",
          number: 10,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/office.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_OFFICE_PROFILE,
          accessable: true,
          url: "",
          number: 11,
          parent_number: 10,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/location.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: true,
          url: "",
          number: 12,
          parent_number: 10,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/team_profile.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: true,
          url: "",
          number: 13,
          parent_number: 10,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/public/logo/material.png",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_MATERIAL,
          accessable: true,
          url: "",
          number: 14,
          parent_number: 10,
        },
      ];
      await Promise.all(
        records.map(async (record) => {
          await this.permissionModel.create(record);
        })
      );
      // create permission details
      let details = [];
      const adminPermissions = await this.permissionModel.getBy({
        role_id: ROLES.DESIGN_ADMIN,
        type: SYSTEM_TYPE.DESIGN,
        relation_id: design_id,
      });
      adminPermissions?.forEach((permission) => {
        switch (permission.name.toLowerCase()) {
          case DESIGN_PERMISSION_TITLE.MY_WORKSPACE:
            break;
          case DESIGN_PERMISSION_TITLE.MY_FAVOURITE:
            break;
          case DESIGN_PERMISSION_TITLE.PRODUCT:
            break;
          case DESIGN_PERMISSION_TITLE.PROJECT:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION_OFFICE_PROFILE:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION_LOCATION:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION_MATERIAL:
            break;

          default:
            break;
        }
      });
      const teamPermissions = await this.permissionModel.getBy({
        role_id: ROLES.DESIGN_TEAM,
        type: SYSTEM_TYPE.DESIGN,
        relation_id: design_id,
      });
      teamPermissions?.forEach((permission) => {
        switch (permission.name.toLowerCase()) {
          case DESIGN_PERMISSION_TITLE.MY_WORKSPACE:
            break;
          case DESIGN_PERMISSION_TITLE.MY_FAVOURITE:
            break;
          case DESIGN_PERMISSION_TITLE.PRODUCT:
            break;
          case DESIGN_PERMISSION_TITLE.PROJECT:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION_OFFICE_PROFILE:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION_LOCATION:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE:
            break;
          case DESIGN_PERMISSION_TITLE.ADMINISTRATION_MATERIAL:
            break;

          default:
            break;
        }
      });
    });
  };
}
