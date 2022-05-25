import { AUTH_NAMES } from "../constant/auth.constant";
import { Server } from "@hapi/hapi";
import jwt_decode from "jwt-decode";
import * as Boom from "@hapi/boom";
import {
  verifyAdminToken,
  verifyBrandAdminToken,
  verifyBrandTeamToken,
  verifyConsultantTeamToken,
  verifyDesignAdminToken,
  verifyDesignTeamToken,
} from "../helper/jwt.helper";

export default class AuthMiddleware {
  public static registration = (server: Server) => {
    server.auth.scheme(AUTH_NAMES.GENERAL, (_server: Server) => {
      return {
        authenticate: async (request, h) => {
          const authorization = request.headers.authorization;
          if (!authorization) {
            throw Boom.unauthorized(null, "Invalid token signature");
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
            throw Boom.unauthorized(null, "Invalid token signature");
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
            throw Boom.unauthorized(null, "Invalid token signature");
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
            throw Boom.unauthorized(null, "Invalid token signature");
          }

          const decoded: any = jwt_decode(token);
          return h.authenticated({
            credentials: { user_id: decoded.user_id },
          });
        },
      };
    });

    server.auth.strategy(AUTH_NAMES.ADMIN, AUTH_NAMES.ADMIN);
  };
  public static registerAll = (server: Server) => {
    AuthMiddleware.registration(server);
  };
}
