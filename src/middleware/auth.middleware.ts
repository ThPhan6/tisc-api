import { AUTH_NAMES } from "../constant/auth.constant";
import { Server } from "@hapi/hapi";
import jwt_decode from "jwt-decode";
import * as Boom from "@hapi/boom";
import { verifyAdminToken, verifyNormalToken } from "../helper/jwt.helper";

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
          const userToken = verifyNormalToken(token);
          const adminToken = verifyAdminToken(token);
          if (!userToken.isValid && !adminToken.isValid) {
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
  };
  public static registerAll = (server: Server) => {
    AuthMiddleware.registration(server);
  };
}
