import * as Hapi from "@hapi/hapi";
import PDFController from "./pdf.controller";
// import commonValidate from "../../validate/common.validate";
// import validate from "./favourite.validate";
import IRoute from "../../helper/route.helper";
// import { ROUTES } from "../../constant/api.constant";
// import { AUTH_NAMES } from "../../constant/auth.constant";

export default class PDFRoute implements IRoute {
  public async register(server: Hapi.Server): Promise<any> {
    return new Promise((resolve) => {
      const controller = new PDFController();
      server.route([
        {
          method: "POST",
          path: '/api/pdf/project-product/{project_product_id}',
          options: {
            handler: controller.generateProjectProduct,
            description: "ABCD---ABCD",
            tags: ["api", "pdf"],
          },
        },
      ]);
      resolve(true);
    });
  }
}
