import { CommonTypeValue } from "@/types";
import { userRepository } from "@/repositories/user.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import { successResponse } from "@/helper/response.helper";
import { mappingCountryByRegion } from "./setting.mapping";

export default class SettingService {
  public getCommonTypes = async (userId: string, type: CommonTypeValue) => {
    const user = await userRepository.find(userId);
    if (!user) {
      return successResponse({ data: [] });
    }
    const commonTypes = await commonTypeRepository.getAllByRelationAndType(
      user.relation_id,
      type
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
  public async getListInquiryOrRequestFor(type: number, relationId: string) {
    const inquiriesFor = await commonTypeRepository.getListInquiryOrRequestFor(
      type,
      relationId
    );
    return successResponse({
      data: inquiriesFor,
    });
  }
}
export const settingService = new SettingService();
