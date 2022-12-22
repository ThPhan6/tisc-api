import { AUTH_NAMES, ROUTES, MESSAGES } from "@/constants";
import { Server, Request, ResponseToolkit } from "@hapi/hapi";
import jwt_decode from "jwt-decode";
import * as Boom from "@hapi/boom";
import { userRepository } from "@/repositories/user.repository";
import { companyPermissionRepository } from "@/repositories/company_permission.repository";
import { verifyJwtToken } from "@/helper/jwt.helper";
import { UserAttributes } from "@/types";
import { base64ToString, decrypt } from "@/helper/cryptojs.helper";
import { ENVIROMENT } from "@/config";

export const throwError = async (message?: string) => {
  throw Boom.unauthorized(message || MESSAGES.GENERAL.INVALID_TOKEN_SIGNATURE);
};
export const throwForbidden = async () => {
  throw Boom.forbidden(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_PERFORM);
};

const customScheme = (_server: Server) => {
  return {
    authenticate: async (request: Request, h: ResponseToolkit) => {
      const credential = await AuthMiddleware.authenticate(request);
      return h.authenticated(credential);
    },
  };
};
const customPermissionScheme = (_server: Server) => {
  return {
    authenticate: async (request: Request, h: ResponseToolkit) => {
      const credential = await AuthMiddleware.authenticate(request);
      if (
        (AuthMiddleware.WHITE_LIST_SIGNATURE_ROUTES.includes(
          request.route.path
        ) ||
          AuthMiddleware.WHITE_LIST_CUSTOM_PRODUCT_SIGNATURE_ROUTES.includes(
            request.route.path
          )) &&
        credential
      ) {
        return h.authenticated(credential);
      }
      const check = ENVIROMENT.CHECK_PERMISSION;
      if (check === "true") {
        const companyPermission =
          await companyPermissionRepository.findByRouteRoleIdAndRelationId(
            request.route.path,
            credential.credentials.user.role_id,
            credential.credentials.user.relation_id
          );
        if (!companyPermission) {
          return throwForbidden();
        }
      }

      return h.authenticated(credential);
    },
  };
};

export default class AuthMiddleware {
  public static WHITE_LIST_SIGNATURE_ROUTES = [
    ROUTES.GET_ALL_ATTRIBUTE,
    ROUTES.GET_ONE_PRODUCT,
    ROUTES.SETTING.COMMON_TYPES_LIST,
    ROUTES.GET_LIST_REST_COLLECTION_PRODUCT,
    ROUTES.COLLECTION.GET_LIST,
    ROUTES.GET_BRAND_LOCATIONS_COUNTRY_GROUP,
    ROUTES.GET_MARKET_DISTRIBUTOR_COUNTRY_GROUP,
    ROUTES.PRE_SPECFICATION.GET_USER_SPEC_SELECTION,
  ];
  public static WHITE_LIST_CUSTOM_PRODUCT_SIGNATURE_ROUTES = [
    ROUTES.CUSTOM_PRODUCT.GET_LIST,
    ROUTES.CUSTOM_PRODUCT.GET_ONE,
    ROUTES.CUSTOM_RESOURCE.GET_ALL,
    ROUTES.CUSTOM_RESOURCE.GET_DISTRIBUTORS_BY_COMPANY,
    ROUTES.CUSTOM_RESOURCE.GET_LIST,
    ROUTES.CUSTOM_RESOURCE.GET_ONE,
    ROUTES.CUSTOM_RESOURCE.GET_SUMMARY,
  ];

  public static registration = (server: Server) => {
    server.auth.scheme(AUTH_NAMES.GENERAL, customScheme);

    server.auth.scheme(AUTH_NAMES.PERMISSION, customPermissionScheme);

    ///
    server.auth.strategy(AUTH_NAMES.PERMISSION, AUTH_NAMES.PERMISSION);
    server.auth.strategy(AUTH_NAMES.GENERAL, AUTH_NAMES.GENERAL);
  };

  public static parseJwtToken = async (authorization?: string) => {
    if (!authorization) {
      return throwError();
    }
    const token = authorization.substring(7);
    const tokenArtifact = verifyJwtToken(token);
    if (!tokenArtifact.isValid) {
      return throwError();
    }
    const jwtData = jwt_decode(token) as { user_id: string };
    const user = await userRepository.find(jwtData.user_id);
    if (!user) {
      return throwError();
    }
    return user;
  };

  public static parseSignature = async (
    _request: Request,
    signature?: string
  ) => {
    if (!signature) {
      return throwError();
    }
    ///
    const realSignature = base64ToString(signature);
    let signatureData: {
      // collection_id: string;
      user_id: string;
    };
    try {
      signatureData = decrypt(realSignature, true);
    } catch {
      return throwError();
    }
    ///
    if (!signatureData.user_id) {
      return throwError();
    }
    /// validate signature for collection
    // if (request.route.path === ROUTES.GET_ONE_PRODUCT) {
    //   const product = await productRepository.find(request.params.id);
    //   if (!product || product.collection_id !== signatureData.collection_id) {
    //     return throwError();
    //   }
    // }
    //
    const user = await userRepository.find(signatureData.user_id);
    if (!user) {
      return throwError();
    }
    return user;
  };

  public static authenticate = async (request: Request) => {
    let user: UserAttributes;
    if (
      (AuthMiddleware.WHITE_LIST_SIGNATURE_ROUTES.includes(
        request.route.path
      ) ||
        AuthMiddleware.WHITE_LIST_CUSTOM_PRODUCT_SIGNATURE_ROUTES.includes(
          request.route.path
        )) &&
      request.headers.signature
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
    };
  };

  public static registerAll = (server: Server) => {
    AuthMiddleware.registration(server);
  };
}
