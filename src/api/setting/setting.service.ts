import { CommonTypeValue, SortOrder } from "@/types";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import { successResponse } from "@/helper/response.helper";
import { mappingCountryByRegion } from "./setting.mapping";

export default class SettingService {
  public getCommonTypes = async (
    relationId: string,
    type: CommonTypeValue,
    sort_order?: SortOrder
  ) => {
    const commonTypes = await commonTypeRepository.getAllByRelationAndType(
      relationId,
      type,
      sort_order
    );
    return successResponse({ data: commonTypes });
  };

  public getCountries = async () => {
    const countries = await countryStateCityService.getAllCountry();
    return successResponse({ data: countries });
  };

  public findCountry = async (id: string) => {
    const country = await countryStateCityService.getCountryDetail(id);
    return successResponse({ data: country });
  };

  public getStates = async (countryId: string) => {
    const states = await countryStateCityService.getStatesByCountry(countryId);
    return successResponse({ data: states });
  };
  public findState = async (id: string) => {
    const state = await countryStateCityService.getStateDetail(id);
    return successResponse({ data: state });
  };

  public getCities = async (countryId: string, stateId?: string) => {
    const cities = await countryStateCityService.getCitiesByStateAndCountry(
      countryId,
      stateId
    );
    return successResponse({ data: cities });
  };

  public findCity = async (id: string) => {
    const city = await countryStateCityService.getCityDetail(id);
    return successResponse({ data: city });
  };

  public getListCountryWithRegionGroup = async () => {
    const countries = await countryStateCityService.getAllCountry();
    return successResponse({
      data: mappingCountryByRegion(countries),
    });
  };

  public findOrCreateList = async (
    ids: string[],
    relationId: string | null,
    type: CommonTypeValue
  ) => {
    const commonRecords = await Promise.all(
      ids.map((id) => {
        return commonTypeRepository.findOrCreate(id, relationId || "", type);
      })
    );
    return commonRecords.map((el) => el.id);
  };
}
export const settingService = new SettingService();
