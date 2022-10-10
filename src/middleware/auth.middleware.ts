import { AUTH_NAMES } from "../constant/auth.constant";
import { Server } from "@hapi/hapi";
import jwt_decode from "jwt-decode";
import * as Boom from "@hapi/boom";
import {userRepository} from '@/repositories/user.repository';
// import UserModel from "../model/user.model";
// import PermissionModel from "../model/permission.model";
// import PermissionRouteModel from "../model/permission_route.model";
// const userModel = new UserModel();
// const permissionModel = new PermissionModel();
// const permissionRouteModel = new PermissionRouteModel();

import {
  verifyJwtToken,
} from "../helper/jwt.helper";


export const throwError = async () => {
  throw Boom.unauthorized("Invalid token signature");
}




const parseJwtToken = async (authorization?: string) => {
  if (!authorization) {
    return throwError();
  }
  const token = authorization.substring(7);
  const tokenArtifact = verifyJwtToken(token);
  if (!tokenArtifact.isValid) {
    return throwError();
  }
  const jwtData = jwt_decode(token) as {user_id: string};
  const user = await userRepository.find(jwtData.user_id);
  if (!user) {
    return throwError();
  }
  return user;
}

export default class AuthMiddleware {
  public static registration = (server: Server) => {
    server.auth.scheme(AUTH_NAMES.GENERAL, (_server: Server) => {
      return {
        authenticate: async (request, h) => {
          const user = await parseJwtToken(request.headers.authorization);
          return h.authenticated({
            credentials: {
              user,
              user_id: user.id,
            },
          });
        },
      };
    });

    server.auth.scheme(AUTH_NAMES.PERMISSION, (_server: Server) => {
      return {
        authenticate: async (request, h) => {
          const user = await parseJwtToken(request.headers.authorization);
          return h.authenticated({
            credentials: {
              user,
              user_id: user.id,
            },
          });
          //check permission
          // const decoded: any = jwt_decode(token);
          // const user: any = await userModel.find(decoded.user_id);
          // if (!user) {
          //   throw Boom.unauthorized("Not found user");
          // }
          // const permissionRoute = await permissionRouteModel.findBy({
          //   route: request.route.path,
          // });
          // if (!permissionRoute) {
          //   throw Boom.unauthorized("Not found permissions route");
          // }
          // const permissions = await permissionModel.getBy({
          //   role_id: user.role_id,
          //   type: user.type,
          //   relation_id: user.relation_id,
          // });
          // if (!permissions) {
          //   throw Boom.unauthorized("Not found permissions");
          // }

          // const permission = permissions.find((item: any) => {
          //   const foundRoute = item.routes.find(
          //     (route: any) => route.id === permissionRoute.id
          //   );
          //   return foundRoute;
          // });

          // if (permission && permission.accessable === true) {
          //   return h.authenticated({
          //     credentials: { user_id: decoded.user_id },
          //   });
          // }

          // throw Boom.unauthorized("Cannot access!");
        },
      };
    });

    ///
    server.auth.strategy(AUTH_NAMES.PERMISSION, AUTH_NAMES.PERMISSION);
    server.auth.strategy(AUTH_NAMES.GENERAL, AUTH_NAMES.GENERAL);
  };
  public static registerAll = (server: Server) => {
    AuthMiddleware.registration(server);
  };
}
