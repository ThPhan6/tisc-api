import * as Hapi from "@hapi/hapi";
import PDFController from "./pdf.controller";
// import commonValidate from "../../validate/common.validate";
import { defaultRouteOptionResponseStatus } from "@/helper/response.helper";
import validate from "./pdf.validate";
import response from "./pdf.response";
import IRoute from "../../helper/route.helper";
import { ROUTES, AUTH_NAMES } from "@/constants";

export default class PDFRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new PDFController();
      server.route([
        {
          method: "POST",
          path: ROUTES.PDF.GENERATE_PROJECT_PDF,
          options: {
            handler: controller.generateProjectProduct,
            validate: validate.downloadProjectPdf,
            description: "Method that generate project PDF specify",
            tags: ["api", "PDF Generator"],
            auth: AUTH_NAMES.PERMISSION,
          },
        },
        {
          method: "GET",
          path: ROUTES.PDF.GET_PROJECT_PDF_CONFIG,
          options: {
            handler: controller.getProjectSpecifyConfig,
            validate: validate.paramProjectId,
            description: "Method that get Project Specify PDF configuration",
            tags: ["api", "PDF Generator"],
            auth: AUTH_NAMES.PERMISSION,
            response: {
              status: {
                ...defaultRouteOptionResponseStatus,
                200: response.getSpecifyPDFConfig,
              },
            },
          },
        },
      ]);
      resolve(true);
    });
  }
}
