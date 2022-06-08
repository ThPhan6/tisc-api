import * as Hapi from "@hapi/hapi";
import AuthRoutes from "./api/auth/auth.route";
import ContactRoutes from "./api/contact/contact.route";
import DocumentationRoutes from "./api/documentation/documentation.route";
import UserRoutes from "./api/user/user.route";
import BrandRoutes from "./api/brand/brand.route";
import DesignerRoutes from "./api/designer/designer.route";
import PermissionRoutes from "./api/permission/permission.route";
import CollectionRoutes from "./api/collection/collection.route";
import ProductRoutes from "./api/product/product.route";
import CategoryRoutes from "./api/category/category.route";
import AttributeRoutes from "./api/attribute/attribute.route";
export default class Routesr {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new AuthRoutes().register(server);
    await new DocumentationRoutes().register(server);
    await new UserRoutes().register(server);
    await new ContactRoutes().register(server);
    await new BrandRoutes().register(server);
    await new DesignerRoutes().register(server);
    await new PermissionRoutes().register(server);
    await new CollectionRoutes().register(server);
    await new ProductRoutes().register(server);
    await new CategoryRoutes().register(server);
    await new AttributeRoutes().register(server);
  }
}
