import PermissionModel, {
  PERMISSION_NULL_ATTRIBUTES,
} from "../../model/permission.model";
import UserModel from "../../model/user.model";
import { ROLES } from "../../constant/user.constant";
import { MESSAGES, SYSTEM_TYPE } from "../../constant/common.constant";
import {
  BRAND_PERMISSION_TITLE,
  DESIGN_PERMISSION_TITLE,
  PERMISSION_TITLE,
} from "../../constant/permission.constant";
import { IPermissionsResponse } from "./permission.type";
import { IMessageResponse } from "../../type/common.type";
import { getAccessLevel } from "../../helper/common.helper";

export default class PermissionService {
  private permissionModel: PermissionModel;
  private userModel: UserModel;
  constructor() {
    this.permissionModel = new PermissionModel();
    this.userModel = new UserModel();
  }
  private makeSubItem = (sub: any, permissions: any[]) => {
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
  };
  private makeList = (permissions: any[]) => {
    const parents = permissions.filter(
      (permission) => permission.parent_number === null
    );
    if (!parents) {
      return [];
    }
    return parents.map((parent) => {
      const subs = permissions.filter(
        (permission) => permission.parent_number === parent.number
      );
      const newSubs = subs.map((sub) => this.makeSubItem(sub, permissions));
      if (newSubs && newSubs[0]) {
        return {
          ...parent,
          subs: newSubs,
        };
      }
      return parent;
    });
  };
  public openClose = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const permission = await this.permissionModel.find(id);
      if (!permission) {
        return resolve({
          message: MESSAGES.NOTFOUND_PERMISSION,
          statusCode: 404,
        });
      }
      if (permission.accessable) {
        //create new route list too
        let routes: any[] = [];
        if (permission.type === SYSTEM_TYPE.TISC) {
          switch (permission.name) {
            case PERMISSION_TITLE.MY_WORKSPACE:
              routes = [{ id: "2" }];
              break;
            case PERMISSION_TITLE.USER_GROUP_BRAND:
              routes = [
                { id: "1" },
                { id: "4" },
                { id: "3" },
                { id: "5" },
                { id: "9" },
              ];
              break;
            case PERMISSION_TITLE.USER_GROUP_DESIGN:
              routes = [{ id: "12" }, { id: "13" }, { id: "14" }];
              break;
            case PERMISSION_TITLE.PROJECT_LIST:
              routes = [{ id: "16" }, { id: "17" }];
              break;
            case PERMISSION_TITLE.PRODUCT_CATEGORY:
              routes = [
                { id: "18" },
                { id: "19" },
                { id: "20" },
                { id: "21" },
                { id: "22" },
              ];
              break;
            case PERMISSION_TITLE.PRODUCT_BASIS:
              routes = [
                { id: "23" },
                { id: "24" },
                { id: "25" },
                { id: "26" },
                { id: "27" },
                { id: "28" },
                { id: "29" },
                { id: "30" },
                { id: "31" },
                { id: "32" },
                { id: "33" },
                { id: "34" },
                { id: "35" },
                { id: "36" },
                { id: "37" },
              ];
              break;
            case PERMISSION_TITLE.PRODUCT_ATTRIBUTE:
              routes = [
                { id: "38" },
                { id: "39" },
                { id: "40" },
                { id: "41" },
                { id: "42" },
                { id: "43" },
              ];
              break;
            case PERMISSION_TITLE.PRODUCT_CONFIGURATION:
              routes = [
                { id: "44" },
                { id: "45" },
                { id: "46" },
                { id: "47" },
                { id: "48" },
                { id: "49" },
                { id: "50" },
              ];
              break;
            case PERMISSION_TITLE.PRODUCT_CONFIGURATION:
              routes = [
                { id: "44" },
                { id: "45" },
                { id: "46" },
                { id: "47" },
                { id: "48" },
                { id: "49" },
                { id: "50" },
              ];
              break;
            case PERMISSION_TITLE.ADMINISTRATION_DOCUMENTATION:
              routes = [
                { id: "51" },
                { id: "52" },
                { id: "53" },
                { id: "54" },
                { id: "55" },
              ];
              break;
            case PERMISSION_TITLE.ADMINISTRATION_LOCATION:
              routes = [
                { id: "56" },
                { id: "57" },
                { id: "58" },
                { id: "59" },
                { id: "60" },
                { id: "61" },
              ];
              break;
            case PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE:
              routes = [
                { id: "67" },
                { id: "68" },
                { id: "72" },
                { id: "73" },
                { id: "74" },
                { id: "75" },
                { id: "76" },
                { id: "77" },
              ];
              break;
            case PERMISSION_TITLE.ADMINISTRATION_MESSAGE:
              routes = [
                { id: "78" },
                { id: "79" },
                { id: "80" },
                { id: "81" },
                { id: "82" },
                { id: "83" },
                { id: "84" },
                { id: "85" },
                { id: "86" },
                { id: "87" },
              ];
              break;
            case PERMISSION_TITLE.ADMINISTRATION_REVENUE:
            default:
              routes = [{ id: "88" }, { id: "89" }, { id: "90" }, { id: "91" }];
              break;
          }
        }
        await this.permissionModel.update(id, {
          accessable: !permission.accessable,
          routes: routes,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
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
      const adminPermissions = await this.permissionModel.getBy({
        role_id:
          user.type === SYSTEM_TYPE.TISC
            ? ROLES.TISC_ADMIN
            : user.type === SYSTEM_TYPE.BRAND
            ? ROLES.BRAND_ADMIN
            : ROLES.DESIGN_ADMIN,
        type: user.type,
        relation_id: user.relation_id,
      });
      const teamPermissions = await this.permissionModel.getBy({
        role_id:
          user.type === SYSTEM_TYPE.TISC
            ? ROLES.TISC_CONSULTANT_TEAM
            : user.type === SYSTEM_TYPE.BRAND
            ? ROLES.BRAND_TEAM
            : ROLES.DESIGN_TEAM,
        type: user.type,
        relation_id: user.relation_id,
      });
      const permissions = adminPermissions?.map((item) => {
        const teamPermission = teamPermissions?.find(
          (teamItem) => teamItem.name === item.name
        );
        return {
          logo: item.logo,
          name: item.name,
          items: [
            {
              id: item.id,
              name: getAccessLevel(ROLES.TISC_ADMIN),
              accessable: item.accessable,
            },
            {
              id: teamPermission?.id,
              name: getAccessLevel(ROLES.TISC_CONSULTANT_TEAM),
              accessable: teamPermission?.accessable,
            },
          ],
          number: item.number,
          parent_number: item.parent_number,
        };
      });

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
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/my_workspace.svg",
          name: BRAND_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          number: 1,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/product.svg",
          name: BRAND_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          number: 2,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/general_inquires.svg",
          name: BRAND_PERMISSION_TITLE.GENERAL_INQUIRES,
          accessable: true,
          number: 3,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/project_tracking.svg",
          name: BRAND_PERMISSION_TITLE.PROJECT_TRACKING,
          accessable: true,
          number: 4,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/administration.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION,
          number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/brand.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_BRAND_PROFILE,
          accessable: true,
          number: 6,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/location.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: true,
          number: 7,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/team_profile.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: true,
          number: 8,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/distributor.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_DISTRIBUTOR,
          accessable: true,
          number: 9,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/market_availability.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_MARKET_AVAILABILITY,
          accessable: true,
          number: 10,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/subscription.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_SUBSCRIPTION,
          accessable: true,
          number: 11,
          parent_number: 5,
        },
        //brand team
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/my_workspace.svg",
          name: BRAND_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          number: 1,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/product.svg",
          name: BRAND_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          number: 2,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/general_inquires.svg",
          name: BRAND_PERMISSION_TITLE.GENERAL_INQUIRES,
          accessable: true,
          number: 3,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/project_tracking.svg",
          name: BRAND_PERMISSION_TITLE.PROJECT_TRACKING,
          accessable: true,
          number: 4,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/administration.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION,
          number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/brand.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_BRAND_PROFILE,
          accessable: false,
          number: 6,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/location.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: false,
          number: 7,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/team_profile.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: false,
          number: 8,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/distributor.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_DISTRIBUTOR,
          accessable: false,
          number: 9,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/market_availability.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_MARKET_AVAILABILITY,
          accessable: false,
          number: 10,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: "/logo/subscription.svg",
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_SUBSCRIPTION,
          accessable: false,
          number: 11,
          parent_number: 5,
        },
      ];
      await Promise.all(
        records.map(async (record) => {
          await this.permissionModel.create(record);
        })
      );
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
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/my_workspace.svg",
          name: DESIGN_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          number: 1,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/favourite.svg",
          name: DESIGN_PERMISSION_TITLE.MY_FAVOURITE,
          accessable: true,
          number: 2,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/product.svg",
          name: DESIGN_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          number: 3,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/project.svg",
          name: DESIGN_PERMISSION_TITLE.PROJECT,
          accessable: true,
          number: 4,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_LIST,
          accessable: true,
          number: 5,
          parent_number: 4,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_BASIC,
          accessable: true,
          number: 6,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_ZONE,
          accessable: true,
          number: 7,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_CONSIDERED_PRODUCT,
          accessable: true,
          number: 8,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_SPECIFIED_PRODUCT,
          accessable: true,
          number: 9,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/administration.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION,
          accessable: true,
          number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/office.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_OFFICE_PROFILE,
          accessable: true,
          number: 11,
          parent_number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/location.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: true,
          number: 12,
          parent_number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/team_profile.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: true,
          number: 13,
          parent_number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/material.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_MATERIAL,
          accessable: true,
          number: 14,
          parent_number: 10,
        },
        // design team
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/my_workspace.svg",
          name: DESIGN_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          number: 1,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/favourite.svg",
          name: DESIGN_PERMISSION_TITLE.MY_FAVOURITE,
          accessable: true,
          number: 2,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/product.svg",
          name: DESIGN_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          number: 3,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/project.svg",
          name: DESIGN_PERMISSION_TITLE.PROJECT,
          accessable: true,
          number: 4,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_LIST,
          accessable: true,
          number: 5,
          parent_number: 4,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_BASIC,
          accessable: true,
          number: 6,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_ZONE,
          accessable: true,
          number: 7,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_CONSIDERED_PRODUCT,
          accessable: true,
          number: 8,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_SPECIFIED_PRODUCT,
          accessable: true,
          number: 9,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/administration.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION,
          accessable: true,
          number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/office.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_OFFICE_PROFILE,
          accessable: true,
          number: 11,
          parent_number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/location.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: true,
          number: 12,
          parent_number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/team_profile.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: true,
          number: 13,
          parent_number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: "/logo/material.svg",
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_MATERIAL,
          accessable: true,
          number: 14,
          parent_number: 10,
        },
      ];
      await Promise.all(
        records.map(async (record) => {
          await this.permissionModel.create(record);
        })
      );
    });
  };
}
