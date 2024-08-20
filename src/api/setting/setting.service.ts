import { CommonTypeValue, SortOrder } from "@/types";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { countryStateCityService } from "@/services/country_state_city.service";
import { countryRepository } from "@/repositories/country.repository";
import { successResponse } from "@/helpers/response.helper";
import { COMMON_TYPES } from "@/constants";

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
  public getCommonPartnerTypes = async (
    relationId: string,
    sort_order?: SortOrder
  ) => {
    const types: CommonTypeValue[] = [
      COMMON_TYPES.PARTNER_AFFILIATION,
      COMMON_TYPES.PARTNER_RELATION,
      COMMON_TYPES.PARTNER_ACQUISITION,
    ];

    const data = await commonTypeRepository.getByMultipleTypes(
      relationId,
      types,
      sort_order
    );

    const groupData = {
      affiliation: data
        .filter((item) => item.type === COMMON_TYPES.PARTNER_AFFILIATION)
        .map(({ id, name }) => ({ id, name })),
      relation: data
        .filter((item) => item.type === COMMON_TYPES.PARTNER_RELATION)
        .map(({ id, name }) => ({ id, name })),
      acquisition: data
        .filter((item) => item.type === COMMON_TYPES.PARTNER_ACQUISITION)
        .map(({ id, name }) => ({ id, name })),
    };

    return successResponse({ data: groupData });
  };
  public getManyNames = async (ids: string[]) => {
    const documents = await commonTypeRepository.getByListIds(ids);
    return documents.map((item) => item.name).join(", ");
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
    const countries = await countryRepository.groupByRegion();
    return successResponse({ data: countries });
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
