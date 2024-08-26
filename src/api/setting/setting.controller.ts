import { MEASUREMENT_UNIT_OPTIONS } from "@/constants";
import { UserAttributes, DesignLocationFunctionTypeOption } from "@/types";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { settingService } from "./setting.service";
import { getDefaultDimensionAndWeightAttribute } from "@/api/attribute/attribute.mapping";

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
    const { type, sort_order } = req.params;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await settingService.getCommonTypes(
      user.relation_id,
      type,
      sort_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getPartnerCommonTypes = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { sort_order } = req.query;
    const user = req.auth.credentials.user as UserAttributes;
    const response = await settingService.getPartnerCommonTypes(
      user.relation_id,
      sort_order
    );
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
    return toolkit.response(DesignLocationFunctionTypeOption).code(200);
  };
  public getDimensionAndWeight = async (
    _req: Request,
    toolkit: ResponseToolkit
  ) => {
    return toolkit.response(getDefaultDimensionAndWeightAttribute()).code(200);
  };
}
