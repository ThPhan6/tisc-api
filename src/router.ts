import * as Hapi from "@hapi/hapi";
import AboutRoute from "./api/about/about.route";
import AuthRoute from "./api/auth/auth.route";
import AgreementPoliciesTermsRoute from "./api/agreement_policies_terms/agreement_policies_terms.route";
export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new AboutRoute().register(server);
    await new AuthRoute().register(server);
    await new AgreementPoliciesTermsRoute().register(server);
  }
}
