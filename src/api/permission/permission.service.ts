import PermissionModel, {
  PERMISSION_NULL_ATTRIBUTES,
} from "../../model/permission.model";
import UserModel from "../../model/user.model";
import { ROLES } from "../../constant/user.constant";
import {
  LOGO_PATH,
  MESSAGES,
  SYSTEM_TYPE,
} from "../../constant/common.constant";
import {
  BRAND_PERMISSION_TITLE,
  DESIGN_PERMISSION_TITLE,
} from "../../constant/permission.constant";
import { IPermissionsResponse } from "./permission.type";
import { IMessageResponse } from "../../type/common.type";
import { getAccessLevel } from "../../helper/common.helper";
import { ROUTE_IDS } from "../../constant/api.constant";

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
          message: MESSAGES.PERMISSION_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (permission.accessable) {
        const newRoutes = permission.routes.map((route) => ({
          ...route,
          accessable: !route.accessable,
        }));
        await this.permissionModel.update(id, {
          accessable: !permission.accessable,
          routes: newRoutes,
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
      const permissions = adminPermissions.map((item) => {
        const teamPermission = teamPermissions.find(
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
          logo: LOGO_PATH.MY_WORKSPACE,
          name: BRAND_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          number: 1,
          routes: [
            {
              id: ROUTE_IDS.GET_LIST_PROJECT_CARD,
              accessable: true,
            },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.PRODUCT,
          name: BRAND_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          number: 2,
          routes: [
            { id: ROUTE_IDS.GET_LIST_PRODUCT, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PRODUCT, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.GENERAL_INQUIRY,
          name: BRAND_PERMISSION_TITLE.GENERAL_INQUIRES,
          accessable: true,
          number: 3,
          routes: [
            { id: ROUTE_IDS.GET_LIST_INQUIRY, accessable: true },
            { id: ROUTE_IDS.GET_ONE_INQUIRY, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.PROJECT_TRACKING,
          name: BRAND_PERMISSION_TITLE.PROJECT_TRACKING,
          accessable: true,
          number: 4,
          routes: [
            { id: ROUTE_IDS.GET_LIST_PROJECT, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PROJECT, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.ADMINISTRATION,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION,
          number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.BRAND,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_BRAND_PROFILE,
          accessable: true,
          number: 6,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.UPDATE_BRAND_PROFILE, accessable: true },
            { id: ROUTE_IDS.UPDATE_BRAND_LOGO, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.LOCATION,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: true,
          number: 7,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.GET_LIST_LOCATION, accessable: true },
            { id: ROUTE_IDS.GET_LIST_LOCATION_WITH_GROUP, accessable: true },
            { id: ROUTE_IDS.GET_ONE_LOCATION, accessable: true },
            { id: ROUTE_IDS.EDIT_LOCATION, accessable: true },
            { id: ROUTE_IDS.DELETE_LOCATION, accessable: true },
            { id: ROUTE_IDS.CREATE_LOCATION, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.TEAM_PROFILE,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: true,
          number: 8,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.GET_LIST_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.GET_ONE_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.EDIT_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.DELETE_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.CREATE_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.SEND_INVITE_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.GET_LIST_PERMISSION, accessable: true },
            { id: ROUTE_IDS.OPEN_CLOSE_PERMISSION, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.DISTRIBUTOR,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_DISTRIBUTOR,
          accessable: true,
          number: 9,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.CREATE_DISTRIBUTOR, accessable: true },
            { id: ROUTE_IDS.UPDATE_DISTRIBUTOR, accessable: true },
            { id: ROUTE_IDS.DELETE_DISTRIBUTOR, accessable: true },
            { id: ROUTE_IDS.GET_LIST_DISTRIBUTOR, accessable: true },
            { id: ROUTE_IDS.GET_ONE_DISTRIBUTOR, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.MARKET,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_MARKET_AVAILABILITY,
          accessable: true,
          number: 10,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.UPDATE_MARKET_AVAILABILITY, accessable: true },
            { id: ROUTE_IDS.GET_LIST_MARKET_AVAILABILITY, accessable: true },
            { id: ROUTE_IDS.GET_ONE_MARKET_AVAILABILITY, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_ADMIN,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.SUBSCRIPTION,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_SUBSCRIPTION,
          accessable: true,
          number: 11,
          parent_number: 5,
          routes: [{ id: ROUTE_IDS.GET_ONE_SUBSCRIPTION, accessable: true }],
        },
        //brand team
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.MY_WORKSPACE,
          name: BRAND_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          number: 1,
          routes: [
            {
              id: ROUTE_IDS.GET_LIST_PROJECT_CARD,
              accessable: true,
            },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.PRODUCT,
          name: BRAND_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          number: 2,
          routes: [
            { id: ROUTE_IDS.GET_LIST_PRODUCT, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PRODUCT, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.GENERAL_INQUIRY,
          name: BRAND_PERMISSION_TITLE.GENERAL_INQUIRES,
          accessable: true,
          number: 3,
          routes: [
            { id: ROUTE_IDS.GET_LIST_INQUIRY, accessable: true },
            { id: ROUTE_IDS.GET_ONE_INQUIRY, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.PROJECT_TRACKING,
          name: BRAND_PERMISSION_TITLE.PROJECT_TRACKING,
          accessable: true,
          number: 4,
          routes: [
            { id: ROUTE_IDS.GET_LIST_PROJECT, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PROJECT, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.ADMINISTRATION,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION,
          number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.BRAND,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_BRAND_PROFILE,
          accessable: false,
          number: 6,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.UPDATE_BRAND_PROFILE, accessable: false },
            { id: ROUTE_IDS.UPDATE_BRAND_LOGO, accessable: false },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.LOCATION,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: false,
          number: 7,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.GET_LIST_LOCATION, accessable: false },
            { id: ROUTE_IDS.GET_LIST_LOCATION_WITH_GROUP, accessable: false },
            { id: ROUTE_IDS.GET_ONE_LOCATION, accessable: false },
            { id: ROUTE_IDS.EDIT_LOCATION, accessable: false },
            { id: ROUTE_IDS.DELETE_LOCATION, accessable: false },
            { id: ROUTE_IDS.CREATE_LOCATION, accessable: false },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.TEAM_PROFILE,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: false,
          number: 8,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.GET_LIST_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.GET_ONE_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.EDIT_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.DELETE_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.CREATE_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.SEND_INVITE_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.GET_LIST_PERMISSION, accessable: false },
            { id: ROUTE_IDS.OPEN_CLOSE_PERMISSION, accessable: false },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.DISTRIBUTOR,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_DISTRIBUTOR,
          accessable: false,
          number: 9,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.CREATE_DISTRIBUTOR, accessable: false },
            { id: ROUTE_IDS.UPDATE_DISTRIBUTOR, accessable: false },
            { id: ROUTE_IDS.DELETE_DISTRIBUTOR, accessable: false },
            { id: ROUTE_IDS.GET_LIST_DISTRIBUTOR, accessable: false },
            { id: ROUTE_IDS.GET_ONE_DISTRIBUTOR, accessable: false },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.MARKET,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_MARKET_AVAILABILITY,
          accessable: false,
          number: 10,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.UPDATE_MARKET_AVAILABILITY, accessable: false },
            { id: ROUTE_IDS.GET_LIST_MARKET_AVAILABILITY, accessable: false },
            { id: ROUTE_IDS.GET_ONE_MARKET_AVAILABILITY, accessable: false },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.BRAND_TEAM,
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand_id,
          logo: LOGO_PATH.SUBSCRIPTION,
          name: BRAND_PERMISSION_TITLE.ADMINISTRATION_SUBSCRIPTION,
          accessable: false,
          number: 11,
          parent_number: 5,
          routes: [{ id: ROUTE_IDS.GET_ONE_SUBSCRIPTION, accessable: false }],
        },
      ];
      await Promise.all(
        records.map(async (record) => {
          await this.permissionModel.create(record);
        })
      );
      return resolve(true);
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
          logo: LOGO_PATH.MY_WORKSPACE,
          name: DESIGN_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          number: 1,
          routes: [{ id: ROUTE_IDS.GET_LIST_PROJECT_CARD, accessable: true }],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.FAVORITE,
          name: DESIGN_PERMISSION_TITLE.MY_FAVOURITE,
          accessable: true,
          number: 2,
          routes: [
            { id: ROUTE_IDS.GET_LIST_PRODUCT, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PRODUCT, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.PRODUCT,
          name: DESIGN_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          number: 3,
          routes: [
            { id: ROUTE_IDS.GET_LIST_PRODUCT, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PRODUCT, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.PROJECT,
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
          routes: [
            { id: ROUTE_IDS.GET_LIST_PROJECT, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PROJECT, accessable: true },
            { id: ROUTE_IDS.CREATE_PROJECT, accessable: true },
            { id: ROUTE_IDS.UPDATE_PROJECT, accessable: true },
            { id: ROUTE_IDS.DELETE_PROJECT, accessable: true },
          ],
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
          routes: [{ id: ROUTE_IDS.CREATE_PROJECT, accessable: true }],
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
          routes: [
            { id: ROUTE_IDS.CREATE_PROJECT_SPACE, accessable: true },
            { id: ROUTE_IDS.UPDATE_PROJECT_SPACE, accessable: true },
            { id: ROUTE_IDS.DELETE_PROJECT_SPACE, accessable: true },
            { id: ROUTE_IDS.GET_LIST_PROJECT_SPACE, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PROJECT_SPACE, accessable: true },
          ],
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
          logo: LOGO_PATH.ADMINISTRATION,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION,
          accessable: true,
          number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.OFFICE,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_OFFICE_PROFILE,
          accessable: true,
          number: 11,
          parent_number: 10,
          routes: [{ id: ROUTE_IDS.UPDATE_DESIGN_PROFILE, accessable: true }],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.LOCATION,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: true,
          number: 12,
          parent_number: 10,
          routes: [
            { id: ROUTE_IDS.GET_LIST_LOCATION, accessable: true },
            { id: ROUTE_IDS.GET_LIST_LOCATION_WITH_GROUP, accessable: true },
            { id: ROUTE_IDS.GET_ONE_LOCATION, accessable: true },
            { id: ROUTE_IDS.EDIT_LOCATION, accessable: true },
            { id: ROUTE_IDS.DELETE_LOCATION, accessable: true },
            { id: ROUTE_IDS.CREATE_LOCATION, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.TEAM_PROFILE,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: true,
          number: 13,
          parent_number: 10,
          routes: [
            { id: ROUTE_IDS.GET_LIST_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.GET_ONE_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.EDIT_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.DELETE_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.CREATE_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.SEND_INVITE_TEAM_PROFILE, accessable: true },
            { id: ROUTE_IDS.GET_LIST_PERMISSION, accessable: true },
            { id: ROUTE_IDS.OPEN_CLOSE_PERMISSION, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_ADMIN,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.MATERIAL,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_MATERIAL,
          accessable: true,
          number: 14,
          parent_number: 10,
          routes: [
            { id: ROUTE_IDS.CREATE_MATERIAL_CODE, accessable: true },
            { id: ROUTE_IDS.UPDATE_MATERIAL_CODE, accessable: true },
            { id: ROUTE_IDS.DELETE_MATERIAL_CODE, accessable: true },
            { id: ROUTE_IDS.GET_LIST_MATERIAL_CODE, accessable: true },
            { id: ROUTE_IDS.GET_ONE_MATERIAL_CODE, accessable: true },
          ],
        },
        // design team
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.MY_WORKSPACE,
          name: DESIGN_PERMISSION_TITLE.MY_WORKSPACE,
          accessable: true,
          number: 1,
          routes: [{ id: ROUTE_IDS.GET_LIST_PROJECT_CARD, accessable: true }],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.FAVORITE,
          name: DESIGN_PERMISSION_TITLE.MY_FAVOURITE,
          accessable: true,
          number: 2,
          routes: [
            { id: ROUTE_IDS.GET_LIST_PRODUCT, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PRODUCT, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.PRODUCT,
          name: DESIGN_PERMISSION_TITLE.PRODUCT,
          accessable: true,
          number: 3,
          routes: [
            { id: ROUTE_IDS.GET_LIST_PRODUCT, accessable: true },
            { id: ROUTE_IDS.GET_ONE_PRODUCT, accessable: true },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.PROJECT,
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
          accessable: false,
          number: 5,
          parent_number: 4,
          routes: [
            { id: ROUTE_IDS.GET_LIST_PROJECT, accessable: false },
            { id: ROUTE_IDS.GET_ONE_PROJECT, accessable: false },
            { id: ROUTE_IDS.CREATE_PROJECT, accessable: false },
            { id: ROUTE_IDS.UPDATE_PROJECT, accessable: false },
            { id: ROUTE_IDS.DELETE_PROJECT, accessable: false },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_BASIC,
          accessable: false,
          number: 6,
          parent_number: 5,
          routes: [{ id: ROUTE_IDS.CREATE_PROJECT, accessable: false }],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_ZONE,
          accessable: false,
          number: 7,
          parent_number: 5,
          routes: [
            { id: ROUTE_IDS.CREATE_PROJECT_SPACE, accessable: false },
            { id: ROUTE_IDS.UPDATE_PROJECT_SPACE, accessable: false },
            { id: ROUTE_IDS.DELETE_PROJECT_SPACE, accessable: false },
            { id: ROUTE_IDS.GET_LIST_PROJECT_SPACE, accessable: false },
            { id: ROUTE_IDS.GET_ONE_PROJECT_SPACE, accessable: false },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: null,
          name: DESIGN_PERMISSION_TITLE.PROJECT_CONSIDERED_PRODUCT,
          accessable: false,
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
          accessable: false,
          number: 9,
          parent_number: 5,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.ADMINISTRATION,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION,
          accessable: false,
          number: 10,
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.OFFICE,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_OFFICE_PROFILE,
          accessable: false,
          number: 11,
          parent_number: 10,
          routes: [{ id: ROUTE_IDS.UPDATE_DESIGN_PROFILE, accessable: false }],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.LOCATION,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_LOCATION,
          accessable: false,
          number: 12,
          parent_number: 10,
          routes: [
            { id: ROUTE_IDS.GET_LIST_LOCATION, accessable: false },
            { id: ROUTE_IDS.GET_LIST_LOCATION_WITH_GROUP, accessable: false },
            { id: ROUTE_IDS.GET_ONE_LOCATION, accessable: false },
            { id: ROUTE_IDS.EDIT_LOCATION, accessable: false },
            { id: ROUTE_IDS.DELETE_LOCATION, accessable: false },
            { id: ROUTE_IDS.CREATE_LOCATION, accessable: false },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.TEAM_PROFILE,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_TEAM_PROFILE,
          accessable: false,
          number: 13,
          parent_number: 10,
          routes: [
            { id: ROUTE_IDS.GET_LIST_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.GET_ONE_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.EDIT_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.DELETE_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.CREATE_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.SEND_INVITE_TEAM_PROFILE, accessable: false },
            { id: ROUTE_IDS.GET_LIST_PERMISSION, accessable: false },
            { id: ROUTE_IDS.OPEN_CLOSE_PERMISSION, accessable: false },
          ],
        },
        {
          ...PERMISSION_NULL_ATTRIBUTES,
          role_id: ROLES.DESIGN_TEAM,
          type: SYSTEM_TYPE.DESIGN,
          relation_id: design_id,
          logo: LOGO_PATH.MATERIAL,
          name: DESIGN_PERMISSION_TITLE.ADMINISTRATION_MATERIAL,
          accessable: false,
          number: 14,
          parent_number: 10,
          routes: [
            { id: ROUTE_IDS.CREATE_MATERIAL_CODE, accessable: false },
            { id: ROUTE_IDS.UPDATE_MATERIAL_CODE, accessable: false },
            { id: ROUTE_IDS.DELETE_MATERIAL_CODE, accessable: false },
            { id: ROUTE_IDS.GET_LIST_MATERIAL_CODE, accessable: false },
            { id: ROUTE_IDS.GET_ONE_MATERIAL_CODE, accessable: false },
          ],
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
