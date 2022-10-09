import { FUNCTIONAL_TYPE_OPTIONS, MEASUREMENT_UNIT_OPTIONS } from "@/constants";
import { UserAttributes } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { settingService } from "./setting.service";
export default class SettingController {
  public getCountries = async (_req: Request, toolkit: ResponseToolkit) => {
    const response = await settingService.getCountries();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getStates = async (req: Request, toolkit: ResponseToolkit) => {
    const { country_id } = req.query;
    const response = await settingService.getStates(country_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getCities = async (req: Request, toolkit: ResponseToolkit) => {
    const { country_id, state_id } = req.query;
    const response = await settingService.getCities(country_id, state_id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public findCountry = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await settingService.findCountry(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getAllCountryWithRegionGroup = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    const response = await settingService.getListCountryWithRegionGroup();
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public findState = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await settingService.findState(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public findCity = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await settingService.findCity(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getCommonTypes = async (req: Request, toolkit: ResponseToolkit) => {
    const { type } = req.params;
    const userId = req.auth.credentials.user_id as string;
    const response = await settingService.getCommonTypes(userId, type);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getMeasurementUnits = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    return toolkit.response(MEASUREMENT_UNIT_OPTIONS).code(200);
  };
  public getFunctionalType = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    return toolkit.response(FUNCTIONAL_TYPE_OPTIONS).code(200);
  };
  public async getListInquiryOrRequestFor(
    req: Request,
    toolkit: ResponseToolkit
  ) {
    const user = req.auth.credentials.user as UserAttributes;
    const response = await settingService.getListInquiryOrRequestFor(
      11,
      user.relation_id
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  }
}
