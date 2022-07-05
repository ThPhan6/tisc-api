import * as Hapi from "@hapi/hapi";
import AuthRoute from "./api/auth/auth.route";
import ContactRoute from "./api/contact/contact.route";
import DocumentationRoute from "./api/documentation/documentation.route";
import UserRoute from "./api/user/user.route";
import BrandRoute from "./api/brand/brand.route";
import DesignerRoute from "./api/designer/designer.route";
import PermissionRoute from "./api/permission/permission.route";
import CollectionRoute from "./api/collection/collection.route";
import ProductRoute from "./api/product/product.route";
import CategoryRoute from "./api/category/category.route";
import AttributeRoute from "./api/attribute/attribute.route";
import BasisRoute from "./api/basis/basis.route";
import LocationRoute from "./api/location/location.route";
import ProductTipRoute from "./api/product-tip/product_tip.route";
import ProductDownloadRoute from "./api/product_download/product_download.route";
import QuotationRoute from "./api/quotation/quotation.route";
import AutoEmailRoute from "./api/auto_email/auto_email.route";
import MarketAvailabilityRoute from "./api/market_availability/market_availability.route";

export default class Router {
  public static async loadRoute(server: Hapi.Server): Promise<any> {
    await new AuthRoute().register(server);
    await new DocumentationRoute().register(server);
    await new UserRoute().register(server);
    await new ContactRoute().register(server);
    await new BrandRoute().register(server);
    await new DesignerRoute().register(server);
    await new PermissionRoute().register(server);
    await new CollectionRoute().register(server);
    await new ProductRoute().register(server);
    await new CategoryRoute().register(server);
    await new AttributeRoute().register(server);
    await new BasisRoute().register(server);
    await new LocationRoute().register(server);
    await new ProductTipRoute().register(server);
    await new ProductDownloadRoute().register(server);
    await new QuotationRoute().register(server);
    await new AutoEmailRoute().register(server);
    await new MarketAvailabilityRoute().register(server);
  }
}
