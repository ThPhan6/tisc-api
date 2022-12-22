import { Server, Request } from "@hapi/hapi";
import * as Boom from "@hapi/boom";
import { reCaptchaService } from "@/service/captcha.service";
import { AUTH_NAMES } from "@/constants";
import { ENVIROMENT } from "@/config";

export default class CaptchaMiddleware {
  public static throwError = () => {
    throw Boom.badRequest("Invalid Captcha");
  };

  public static registerAll = (server: Server) => {
    server.auth.scheme(AUTH_NAMES.CAPTCHA, () => {
      return {
        authenticate: async (_request, h) => {
          return h.authenticated({
            credentials: {
              auth: true,
            },
          });
        },
        payload: async (
          request: Request & { payload: { captcha: string } },
          h
        ) => {
          if (ENVIROMENT.CHECK_CAPTCHA === "true") {
            const captcha = request.payload.captcha || "";
            if (!captcha) {
              CaptchaMiddleware.throwError();
            }
            const isValid = await reCaptchaService.verify(captcha);
            if (!isValid) {
              CaptchaMiddleware.throwError();
            }
          }
          return h.continue;
        },
        options: {
          payload: true, // Required to force payload verification
        },
      };
    });
    server.auth.strategy(AUTH_NAMES.CAPTCHA, AUTH_NAMES.CAPTCHA);
  };
}
