import * as Hapi from "@hapi/hapi";
import AuthRoute from "./api/auth/auth.route";
import UserRoute from "./api/user/user.route";
export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new AuthRoute().register(server);
    await new UserRoute().register(server);
  }
}
