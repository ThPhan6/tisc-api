import { AUTH_NAMES, ROUTES } from "@/constants";
import { Server, Request } from "@hapi/hapi";
import jwt_decode from "jwt-decode";
import * as Boom from "@hapi/boom";
import { userRepository } from '@/repositories/user.repository';
import { productRepository } from '@/repositories/product.repository';
import { verifyJwtToken } from "@/helper/jwt.helper";
import {UserAttributes} from '@/types';
import {base64ToString, decrypt} from '@/helper/cryptojs.helper';


export const throwError = async () => {
  throw Boom.unauthorized("Invalid token signature");
}





export default class AuthMiddleware {

  public static WHITE_LIST_SIGNATURE_ROUTES = [
    ROUTES.GET_ALL_ATTRIBUTE,
    ROUTES.GET_ONE_PRODUCT,
    ROUTES.SETTING.COMMON_TYPES_LIST,
    ROUTES.GET_LIST_REST_COLLECTION_PRODUCT,
    ROUTES.GET_LIST_COLLECTION,
    ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
    ROUTES.GET_MARKET_DISTRIBUTOR_COUNTRY_GROUP,
    ROUTES.PRE_SPECFICATION.GET_USER_SPEC_SELECTION,
  ];

  public static registration = (server: Server) => {
    server.auth.scheme(AUTH_NAMES.GENERAL, (_server: Server) => {
      return {
        authenticate: async (request, h) => {
          const credential = await AuthMiddleware.authenticate(request);
          return h.authenticated(credential);
        },
      };
    });

    server.auth.scheme(AUTH_NAMES.PERMISSION, (_server: Server) => {
      return {
        authenticate: async (request, h) => {
          const credential = await AuthMiddleware.authenticate(request);
          return h.authenticated(credential);
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
  }

  public static parseJwtToken = async (authorization?: string) => {
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

  public static parseSignature = async (request: Request, signature?: string) => {
    if (!signature) {
      return throwError();
    }
    ///
    const realSignature = base64ToString(signature);
    let signatureData = {} as {
      collection_id: string;
      user_id: string;
    }
    try {
      signatureData = decrypt(realSignature, true);
    } catch {
      return throwError();
    }
    ///
    if (!signatureData.collection_id || !signatureData.user_id) {
      return throwError();
    }
    /// validate signature for collection
    if (request.route.path === ROUTES.GET_ONE_PRODUCT) {
      const product = await productRepository.find(request.params.id);
      if (!product || product.collection_id !== signatureData.collection_id) {
        return throwError();
      }
    }
    //
    const user = await userRepository.find(signatureData.user_id);
    if (!user) {
      return throwError();
    }
    return user;
  }

  public static authenticate = async (request: Request) => {
    let user: UserAttributes;
    if (AuthMiddleware.WHITE_LIST_SIGNATURE_ROUTES.includes(request.route.path) &&
      !request.headers.authorization
    ) {
      user = await AuthMiddleware.parseSignature(
        request,
        request.headers.signature
      );
    } else {
      user = await AuthMiddleware.parseJwtToken(request.headers.authorization);
    }
    return {
      credentials: {
        user,
        user_id: user.id,
      },
    }
  }

  public static registerAll = (server: Server) => {
    AuthMiddleware.registration(server);
  }
}
