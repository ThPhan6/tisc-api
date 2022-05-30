import * as Hapi from "@hapi/hapi";
import AuthRoute from "./api/auth/auth.route";
import Documentation from "./api/documentation/documentation.route";
import UserRoute from "./api/user/user.route";
export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new AuthRoute().register(server);
    await new Documentation().register(server);
    await new UserRoute().register(server);
  }
}
