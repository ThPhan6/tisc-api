import { MESSAGES } from "@/constants";
import { getDistinctArray } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { ICountryAttributes, SortOrder } from "@/types";
import CollectionRepository from "@/repositories/collection.repository";
import { distributorRepository } from "@/repositories/distributor.repository";
import { marketAvailabilityRepository } from "@/repositories/market_availability.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import { brandRepository } from "@/repositories/brand.repository";
import { productRepository } from "@/repositories/product.repository";
import { ICountryStateCity } from "@/types";
import {
  mappingAuthorizedCountries,
  mappingAuthorizedCountriesName,
  mappingDistributorByCountry,
  mappingMarketDistributorGroupByCountry,
  mappingResultGetList,
} from "./distributor.mapping";
import { IDistributorRequest } from "./distributor.type";
class DistributorService {
  private async updateMarkets(
    payload: IDistributorRequest,
    removeCountryIds?: string[],
    addCountryIds?: string[]
  ) {
    const authorizedCountryIds = getDistinctArray(
      payload.authorized_country_ids.concat([payload.country_id])
    );

    const collections = await CollectionRepository.getAllBy({
      brand_id: payload.brand_id,
    });

    const markets = await Promise.all(
      collections.map(async (collection) =>
        marketAvailabilityRepository.findBy({
          collection_id: collection.id,
        })
      )
    );

    await Promise.all(
      markets.map(async (market) => {
        let newCountryIds: string[] = getDistinctArray(
          market?.country_ids.concat(authorizedCountryIds) || []
        );
        if (removeCountryIds || addCountryIds) {
          newCountryIds =
            market?.country_ids
              .filter((item) => !removeCountryIds?.includes(item))
              .concat(addCountryIds || []) || [];
        }
        await marketAvailabilityRepository.update(market?.id || "", {
          country_ids: getDistinctArray(newCountryIds),
        });
        return true;
      })
    );
  }

  public async create(payload: IDistributorRequest) {
    const distributor = await distributorRepository.findBy({
      name: payload.name,
      brand_id: payload.brand_id,
    });

    if (distributor) {
      return errorMessageResponse(
        MESSAGES.DISTRIBUTOR.DISTRIBUTOR_EXISTED,
        404
      );
    }

    const brand = await brandRepository.find(payload.brand_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404);
    }

    await countryStateCityService.validateLocationData(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    const countryStateCity = await countryStateCityService.getCountryStateCity(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    if (!countryStateCity) {
      return errorMessageResponse(
        MESSAGES.COUNTRY_STATE_CITY.COUNTRY_STATE_CITY_NOT_FOUND
      );
    }

    const authorizedCountries = await countryStateCityService.getCountries(
      payload.authorized_country_ids
    );

    if (!authorizedCountries) {
      return errorMessageResponse("Not authorized countries, please check ids");
    }

    const authorizedCountriesName =
      mappingAuthorizedCountriesName(authorizedCountries);

    const createdDistributor = await distributorRepository.create({
      brand_id: payload.brand_id,
      name: payload.name,
      country_name: countryStateCity.country_name,
      country_id: countryStateCity.country_id,
      state_id: countryStateCity.state_id,
      state_name: countryStateCity.state_name,
      city_name: countryStateCity.city_name,
      city_id: countryStateCity.city_id,
      address: payload.address,
      phone_code: countryStateCity.phone_code,
      postal_code: payload.postal_code,
      first_name: payload.first_name,
      last_name: payload.last_name,
      gender: payload.gender,
      email: payload.email,
      phone: payload.phone,
      mobile: payload.mobile,
      authorized_country_ids: payload.authorized_country_ids,
      authorized_country_name: authorizedCountriesName,
      coverage_beyond: payload.coverage_beyond,
    });

    if (!createdDistributor) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_CREATE);
    }

    await this.updateMarkets(payload);

    return successResponse({
      data: {
        ...createdDistributor,
        authorized_countries: mappingAuthorizedCountries(authorizedCountries),
      },
    });
  }

  public async getOne(id: string) {
    const distributor = await distributorRepository.find(id);

    if (!distributor) {
      return errorMessageResponse(
        MESSAGES.DISTRIBUTOR.DISTRIBUTOR_NOT_FOUND,
        404
      );
    }

    const authorizedCountries = await countryStateCityService.getCountries(
      distributor.authorized_country_ids
    );

    if (!authorizedCountries) {
      return errorMessageResponse("Not authorized countries, please check ids");
    }

    const authorizedCountriesName =
      mappingAuthorizedCountries(authorizedCountries);

    return successResponse({
      data: {
        ...distributor,
        authorized_countries: authorizedCountriesName,
      },
    });
  }

  public async update(id: string, payload: IDistributorRequest) {
    const distributor = await distributorRepository.find(id);

    if (!distributor) {
      return errorMessageResponse(MESSAGES.DISTRIBUTOR.DISTRIBUTOR_NOT_FOUND);
    }

    const brand = await brandRepository.find(payload.brand_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404);
    }

    const existedDistributor =
      await distributorRepository.getExistedBrandDistributor(
        id,
        payload.brand_id,
        payload.name
      );

    if (existedDistributor) {
      return errorMessageResponse(MESSAGES.DISTRIBUTOR.DISTRIBUTOR_EXISTED);
    }

    await countryStateCityService.validateLocationData(
      payload.country_id,
      payload.city_id,
      payload.state_id
    );

    let newPayload: any = payload;
    let countryStateCity: ICountryStateCity | false = false;

    if (
      payload.country_id !== distributor.country_id ||
      payload.state_id !== distributor.state_id ||
      payload.city_id !== distributor.city_id
    ) {
      countryStateCity = await countryStateCityService.getCountryStateCity(
        payload.country_id,
        payload.city_id,
        payload.state_id
      );
      if (!countryStateCity) {
        return errorMessageResponse(
          MESSAGES.COUNTRY_STATE_CITY.COUNTRY_STATE_CITY_NOT_FOUND
        );
      }
      newPayload = {
        ...newPayload,
        country_name: countryStateCity.country_name,
        country_id: countryStateCity.country_id,
        state_id: countryStateCity.state_id,
        state_name: countryStateCity.state_name,
        city_name: countryStateCity.city_name,
        city_id: countryStateCity.city_id,
        phone_code: countryStateCity.phone_code,
      };
    }

    let authorizedCountries: ICountryAttributes[] | false = false;
    let authorizedCountriesName = "";

    if (
      payload.authorized_country_ids.toString() !==
      distributor.authorized_country_ids.toString()
    ) {
      authorizedCountries = await countryStateCityService.getCountries(
        payload.authorized_country_ids
      );

      if (!authorizedCountries) {
        return errorMessageResponse(
          "Not authorized countries, please check ids"
        );
      }

      authorizedCountriesName =
        mappingAuthorizedCountriesName(authorizedCountries);

      newPayload = {
        ...newPayload,
        authorized_country_ids: payload.authorized_country_ids,
        authorized_country_name: authorizedCountriesName,
      };
    }

    const updatedDistributor = await distributorRepository.update(
      id,
      newPayload
    );

    if (!updatedDistributor) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }
    if (
      payload.country_id !== distributor.country_id ||
      payload.authorized_country_ids.sort().toString() !==
        distributor.authorized_country_ids.sort().toString()
    ) {
      const oldCountryIds = getDistinctArray(
        distributor.authorized_country_ids.concat([distributor.country_id])
      );
      const newCountryIds = getDistinctArray(
        payload.authorized_country_ids.concat([payload.country_id])
      );
      const removeCountryIds = oldCountryIds.filter(
        (item) => !newCountryIds.includes(item)
      );
      const addCountryIds = newCountryIds.filter(
        (item) => !oldCountryIds.includes(item)
      );
      await this.updateMarkets(payload, removeCountryIds, addCountryIds);
    }

    return successResponse({
      data: {
        ...updatedDistributor,
        authorized_countries: authorizedCountriesName,
      },
    });
  }

  public async delete(id: string) {
    const foundDistributor = await distributorRepository.findAndDelete(id);
    if (!foundDistributor) {
      return errorMessageResponse(
        MESSAGES.DISTRIBUTOR.DISTRIBUTOR_NOT_FOUND,
        404
      );
    }
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getList(
    brandId: string,
    limit: number,
    offset: number,
    _filter: any,
    sort: string,
    order: SortOrder
  ) {
    const distributors =
      await distributorRepository.getListDistributorWithPagination(
        limit,
        offset,
        brandId,
        sort,
        order
      );

    const mappingDistributors = mappingResultGetList(distributors.data);

    return successResponse({
      data: {
        distributors: mappingDistributors,
        pagination: distributors.pagination,
      },
    });
  }

  public async getDistributorGroupByCountry(brandId: string) {
    const brand = await brandRepository.find(brandId);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404);
    }

    const distributors = await distributorRepository.getAllBy({ brandId });

    const countryIds = getDistinctArray(
      distributors.map((distributor) => distributor.country_id)
    );

    const countries = await Promise.all(
      countryIds.map((countryId) => {
        return countryStateCityService.getCountryDetail(countryId);
      })
    );

    const result = mappingDistributorByCountry(countries, distributors);

    return successResponse({
      data: result,
    });
  }

  public async getMarketDistributorGroupByCountry(productId: string) {
    const product = await productRepository.find(productId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_NOT_FOUND, 404);
    }

    const market = await marketAvailabilityRepository.findBy({
      collection_id: product.collection_id,
    });
    if (!market) {
      return successResponse({
        data: [],
      });
    }

    const distributors = await distributorRepository.getMarketDistributor(
      product.brand_id,
      market.country_ids
    );

    const result = mappingMarketDistributorGroupByCountry(distributors);

    return successResponse({
      data: result,
    });
  }
}

export const distributorService = new DistributorService();
export default DistributorService;
