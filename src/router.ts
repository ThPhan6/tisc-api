import * as Hapi from "@hapi/hapi";
import AboutRoute from "./api/about/about.route";
import AuthRoute from "./api/auth/auth.route";
import Documentation from "./api/documentation/documentation.route";
import UserRoute from "./api/user/user.route";
export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new AboutRoute().register(server);
    await new AuthRoute().register(server);
    await new Documentation().register(server);
    await new UserRoute().register(server);
  }
}
