import PermissionModel, {
  IPermissionAttributes,
} from "../../model/permission.model";
import PermissionDetailModel from "../../model/permission_detail.model";
import UserModel from "../../model/user.model";
import { ROLES } from "../../constant/user.constant";
import { MESSAGES, SYSTEM_TYPE } from "../../constant/common.constant";
import {
  BRAND_PERMISSION_TITLE,
  DESIGN_PERMISSION_TITLE,
} from "../../constant/permission.constant";
import { IMenusResponse, IPermissionsResponse } from "./permission.type";
import { IMessageResponse } from "../../type/common.type";

export default class PermissionService {
  private permissionModel: PermissionModel;
  private permissionDetailModel: PermissionDetailModel;
  private userModel: UserModel;
  constructor() {
    this.permissionModel = new PermissionModel();
    this.permissionDetailModel = new PermissionDetailModel();
    this.userModel = new UserModel();
  }
  private makeList = (permissions: any[]) => {
    const parents = permissions.filter(
      (permission) => permission.parent_number === null
    );
    if (!parents) {
      return [];
    }
    const menu = parents.map((parent) => {
      const subs = permissions.filter(
        (permission) => permission.parent_number === parent.number
      );
      const newSubs = subs.map((sub) => {
        const subs2 = permissions.filter(
          (item) => item.parent_number === sub.number
        );
        if (subs2 && subs2[0]) {
          return {
            ...sub,
            subs: subs2,
          };
        }
        return sub;
      });
      if (newSubs && newSubs[0]) {
        return {
          ...parent,
          subs: newSubs,
        };
      }
      return parent;
    });
    return menu;
  };
  public getList = (
    user_id: string
  ): Promise<IPermissionsResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      let permissions;
      if (user.role_id === ROLES.TISC_ADMIN) {
        const adminPermissions = await this.permissionModel.getBy({
          role_id: user.role_id,
          type: user.type,
          relation_id: null,
        });
        const consultantTeamPermissions = await this.permissionModel.getBy({
          role_id: ROLES.TISC_CONSULTANT_TEAM,
          type: user.type,
          relation_id: null,
        });
        permissions = adminPermissions?.map((item) => {
          const consultantTeamPermission = consultantTeamPermissions?.find(
            (consultantItem) => consultantItem.name === item.name
          );
          return {
            logo: item.logo,
            name: item.name,
            items: [
              {
                id: item.id,
                name: "TISC Admin",
                accessable: item.accessable,
              },
              {
                id: consultantTeamPermission?.id,
                name: "Consultant Team",
                accessable: consultantTeamPermission?.accessable,
              },
            ],
            number: item.number,
            parent_number: item.parent_number,
          };
        });
      }
      if (user.role_id === ROLES.BRAND_ADMIN) {
        const adminPermissions = await this.permissionModel.getBy({
          role_id: user.role_id,
          type: user.type,
          relation_id: user.relation_id,
        });
        const brandTeamPermissions = await this.permissionModel.getBy({
          role_id: ROLES.BRAND_TEAM,
          type: user.type,
          relation_id: user.relation_id,
        });
        permissions = adminPermissions?.map((item) => {
          const brandTeamPermission = brandTeamPermissions?.find(
            (consultantItem) => consultantItem.name === item.name
          );
          return {
            logo: item.logo,
            name: item.name,
            items: [
              {
                id: item.id,
                name: "Brand Admin",
                accessable: item.accessable,
              },
              {
                id: brandTeamPermission?.id,
                name: "Brand Team",
                accessable: brandTeamPermission?.accessable,
              },
            ],
            number: item.number,
            parent_number: item.parent_number,
          };
        });
      }
      if (user.role_id === ROLES.DESIGN_ADMIN) {
        const adminPermissions = await this.permissionModel.getBy({
          role_id: user.role_id,
          type: user.type,
          relation_id: user.relation_id,
        });
        const designTeamPermissions = await this.permissionModel.getBy({
          role_id: ROLES.DESIGN_TEAM,
          type: user.type,
          relation_id: user.relation_id,
        });
        permissions = adminPermissions?.map((item) => {
          const designTeamPermission = designTeamPermissions?.find(
            (consultantItem) => consultantItem.name === item.name
          );
          return {
            logo: item.logo,
            name: item.name,
            items: [
              {
                id: item.id,
                name: "Design Admin",
                accessable: item.accessable,
              },
              {
                id: designTeamPermission?.id,
                name: "Design Team",
                accessable: designTeamPermission?.accessable,
              },
            ],
            number: item.number,
            parent_number: item.parent_number,
          };
        });
      }

      if (!permissions) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const result = this.makeList(permissions);

      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public getMenu = (
    user_id: string
  ): Promise<IMenusResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }

      const rawPermissions = await this.permissionModel.getBy({
        role_id: user.role_id,
        type: user.type,
        relation_id: user.relation_id,
      });
      if (!rawPermissions) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const permissions = rawPermissions
        .filter((item) => item.accessable !== false)
        .map((item) => {
          return {
            logo: item.logo,
            name: item.name,
            url: item.url,
            number: item.number,
            parent_number: item.parent_number,
          };
        });
      const parents = permissions.filter(
        (permission) => permission.parent_number === null
      );
      if (!parents) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const menu = parents.map((parent) => {
        if (parent.name.toLowerCase() === "projects") {
          return parent;
        }
        const subs = permissions.filter(
          (permission) => permission.parent_number === parent.number
        );
        const newSubs = subs.map((sub) => {
          const subs2 = permissions.filter(
            (item) => item.parent_number === sub.number
          );
          if (subs2 && subs2[0]) {
            return {
              ...sub,
              subs: subs2,
            };
          }
          return sub;
        });
        if (newSubs && newSubs[0]) {
          return {
            ...parent,
            subs: newSubs,
          };
        }
        return parent;
      });
      return resolve({
        data: menu,
        statusCode: 200,
      });
    });
  };

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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
          number: 4,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_LIST,
          accessable: true,
          url: null,
          number: 5,
          parent_number: 4,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_BASIC,
          accessable: true,
          url: null,
          number: 6,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_ZONE,
          accessable: true,
          url: null,
          number: 7,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_CONSIDERED_PRODUCT,
          accessable: true,
          url: null,
          number: 8,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_SPECIFIED_PRODUCT,
          accessable: true,
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
          number: 4,
          parent_number: null,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_LIST,
          accessable: true,
          url: null,
          number: 5,
          parent_number: 4,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_BASIC,
          accessable: true,
          url: null,
          number: 6,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_ZONE,
          accessable: true,
          url: null,
          number: 7,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_CONSIDERED_PRODUCT,
          accessable: true,
          url: null,
          number: 8,
          parent_number: 5,
        },
        {
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_SPECIFIED_PRODUCT,
          accessable: true,
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
          url: null,
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
