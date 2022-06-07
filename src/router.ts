import * as Hapi from "@hapi/hapi";
import AuthRoute from "./api/auth/auth.route";
import ContactRoute from "./api/contact/contact.route";
import Documentation from "./api/documentation/documentation.route";
import UserRoute from "./api/user/user.route";
import BrandRoute from "./api/brand/brand.route";
import DesignerRoute from "./api/designer/designer.route";
import PermissionRoute from "./api/permission/permission.route";
import ProductSettingRoutes from "./api/product-setting/product_setting.route";
import CollectionRoute from "./api/collection/collection.route";
export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new AuthRoute().register(server);
    await new Documentation().register(server);
    await new UserRoute().register(server);
    await new ContactRoute().register(server);
    await new BrandRoute().register(server);
    await new DesignerRoute().register(server);
    await new PermissionRoute().register(server);
    await new ProductSettingRoutes().register(server);
    await new CollectionRoute().register(server);
  }
}
