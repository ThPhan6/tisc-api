import { AUTH_NAMES } from "../constant/auth.constant";
import { Server } from "@hapi/hapi";
import jwt_decode from "jwt-decode";
import * as Boom from "@hapi/boom";
import UserModel from "../model/user.model";
import PermissionModel from "../model/permission.model";
import PermissionDetailModel from "../model/permission_detail.model";
import {
  verifyAdminToken,
  verifyBrandAdminToken,
  verifyBrandTeamToken,
  verifyConsultantTeamToken,
  verifyDesignAdminToken,
  verifyDesignTeamToken,
} from "../helper/jwt.helper";
const userModel = new UserModel();
const permissionModel = new PermissionModel();
const permissionDetailModel = new PermissionDetailModel();
export default class AuthMiddleware {
  public static registration = (server: Server) => {
    server.auth.scheme(AUTH_NAMES.GENERAL, (_server: Server) => {
      return {
        authenticate: async (request, h) => {
          const authorization = request.headers.authorization;
          if (!authorization) {
            throw Boom.unauthorized("Invalid token signature");
          }
          const token = authorization.substring(7);
          const consultantTeamToken = verifyConsultantTeamToken(token);
          const adminToken = verifyAdminToken(token);
          const brandAdminToken = verifyBrandAdminToken(token);
          const brandTeamToken = verifyBrandTeamToken(token);
          const designAdminToken = verifyDesignAdminToken(token);
          const designTeamToken = verifyDesignTeamToken(token);
          if (
            !consultantTeamToken.isValid &&
            !adminToken.isValid &&
            !brandAdminToken.isValid &&
            !brandTeamToken.isValid &&
            !designAdminToken.isValid &&
            !designTeamToken.isValid
          ) {
            throw Boom.unauthorized("Invalid token signature");
          }

          const decoded: any = jwt_decode(token);
          return h.authenticated({
            credentials: { user_id: decoded.user_id },
          });
        },
      };
    });

    server.auth.strategy(AUTH_NAMES.GENERAL, AUTH_NAMES.GENERAL);

    server.auth.scheme(AUTH_NAMES.ADMIN, (_server: Server) => {
      return {
        authenticate: async (request, h) => {
          const authorization = request.headers.authorization;
          if (!authorization) {
            throw Boom.unauthorized("Invalid token signature");
          }
          const token = authorization.substring(7);
          const adminToken = verifyAdminToken(token);
          const brandAdminToken = verifyBrandAdminToken(token);
          const designAdminToken = verifyDesignAdminToken(token);
          if (
            !adminToken.isValid &&
            !brandAdminToken.isValid &&
            !designAdminToken.isValid
          ) {
            throw Boom.unauthorized("Invalid token signature");
          }

          const decoded: any = jwt_decode(token);
          return h.authenticated({
            credentials: { user_id: decoded.user_id },
          });
        },
      };
    });

    server.auth.strategy(AUTH_NAMES.ADMIN, AUTH_NAMES.ADMIN);
    server.auth.scheme(AUTH_NAMES.PERMISSION, (_server: Server) => {
      return {
        authenticate: async (request, h) => {
          const authorization = request.headers.authorization;
          if (!authorization) {
            throw Boom.unauthorized("Invalid token signature");
          }
          const token = authorization.substring(7);
          const consultantTeamToken = verifyConsultantTeamToken(token);
          const adminToken = verifyAdminToken(token);
          const brandAdminToken = verifyBrandAdminToken(token);
          const brandTeamToken = verifyBrandTeamToken(token);
          const designAdminToken = verifyDesignAdminToken(token);
          const designTeamToken = verifyDesignTeamToken(token);
          if (
            !consultantTeamToken.isValid &&
            !adminToken.isValid &&
            !brandAdminToken.isValid &&
            !brandTeamToken.isValid &&
            !designAdminToken.isValid &&
            !designTeamToken.isValid
          ) {
            throw Boom.unauthorized("Invalid token signature");
          }
          //check permission
          const decoded: any = jwt_decode(token);
          const user: any = await userModel.find(decoded.user_id);
          if (!user) {
            throw Boom.unauthorized("Not found user");
          }
          const permissions: any = await permissionModel.getBy({
            role_id: user.role_id,
          });
          if (!permissions) {
            throw Boom.unauthorized("Not found permissions");
          }
          const permissionIds = permissions.map((permission: any) => {
            return permission.id;
          });
          const permissionDetail =
            await permissionDetailModel.getPermissionDetailByRoute(
              permissionIds,
              request.route.path
            );

          if (!permissionDetail) {
            throw Boom.unauthorized("Not found permission detail");
          }
          const permission = permissions.find(
            (item: any) => item.id === permissionDetail.permission_id
          );
          if (
            permission &&
            permission.accessable === true &&
            permissionDetail
          ) {
            return h.authenticated({
              credentials: { user_id: decoded.user_id },
            });
          }
          throw Boom.unauthorized("Cannot access!");
        },
      };
    });

    server.auth.strategy(AUTH_NAMES.PERMISSION, AUTH_NAMES.PERMISSION);
  };
  public static registerAll = (server: Server) => {
    AuthMiddleware.registration(server);
  };
}
