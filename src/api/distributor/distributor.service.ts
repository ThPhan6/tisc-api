import { IDistributorAttributes } from "./../../model/distributor.model";
import { MESSAGES } from "./../../constant/common.constant";
import DistributorModel, {
  DISTRIBUTOR_NULL_ATTRIBUTES,
} from "../../model/distributor.model";
import { IMessageResponse } from "./../../type/common.type";
import {
  IDistributorRequest,
  IDistributorResponse,
  IGetListDistributorResponse,
  IGetOneDistributorResponse,
} from "./distributor.type";
import CountryStateCityService from "../../service/country_state_city.service";
export default class DistributorService {
  private distributorModel: DistributorModel;
  private countryStateCityService: CountryStateCityService;
  constructor() {
    this.distributorModel = new DistributorModel();
    this.countryStateCityService = new CountryStateCityService();
  }

  private getAuthorizedCountries = async (authorized_country_ids: string[]) => {
    return await Promise.all(
      authorized_country_ids.map(async (id) => {
        const country = await this.countryStateCityService.getCountryDetail(id);
        return {
          id: country.iso2,
          name: country.name,
        };
      })
    );
  };

  private getLocation = async (
    country_id: string,
    state_id: string,
    city_id: string,
    address: string
  ) => {
    const country = await this.countryStateCityService.getCountryDetail(
      country_id
    );
    const state = await this.countryStateCityService.getStateDetail(
      country_id,
      state_id
    );

    const cities = state_id
      ? await this.countryStateCityService.getCitiesByStateAndCountry(
          country_id,
          state_id
        )
      : await this.countryStateCityService.getCitiesByCountry(country_id);
    const city = cities
      .filter((city) => city.id.toString() == city_id.toString())
      .reduce(function (pre: any, cur: any) {
        return cur;
      }, {});
    return {
      country: {
        id: country.iso2,
        name: country.name,
      },
      state: {
        id: state.iso2,
        name: state.name,
      },
      city: city,
      address,
    };
  };

  public create = (
    payload: IDistributorRequest
  ): Promise<IMessageResponse | IDistributorResponse> => {
    return new Promise(async (resolve) => {
      const distributor = await this.distributorModel.findBy({
        name: payload.name,
        band_id: payload.brand_id,
      });
      if (distributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_EXISTED,
          statusCode: 400,
        });
      }

      const location = await this.getLocation(
        payload.location.country_id,
        payload.location.state_id,
        payload.location.city_id,
        payload.location.address
      );
      const createdDistributor = await this.distributorModel.create({
        ...DISTRIBUTOR_NULL_ATTRIBUTES,
        brand_id: payload.brand_id,
        name: payload.name,
        country_name: location.country.name,
        city_name: location.city.name,
        location: {
          country_id: payload.location.country_id,
          state_id: payload.location.state_id,
          city_id: payload.location.city_id,
          address: payload.location.address,
        },
        postal_code: payload.postal_code,
        first_name: payload.first_name,
        last_name: payload.last_name,
        gender: payload.gender,
        email: payload.email,
        phone: payload.phone,
        mobile: payload.mobile,
        authorized_country_ids: payload.authorized_country_ids,
        coverage_beyond: payload.coverage_beyond,
      });

      if (!createdDistributor) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const { is_deleted, country_name, city_name, ...rest } =
        createdDistributor;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getOne = (
    id: string,
    brand_id: string
  ): Promise<IMessageResponse | IGetOneDistributorResponse> => {
    return new Promise(async (resolve) => {
      const distributor = await this.distributorModel.findBy({
        id,
        brand_id,
      });
      if (!distributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_NOT_FOUND,
          statusCode: 404,
        });
      }
      const authorizedCountries = await Promise.all(
        distributor.authorized_country_ids.map(async (id) => {
          const country = await this.countryStateCityService.getCountryDetail(
            id
          );
          return {
            id: country.iso2,
            name: country.name,
          };
        })
      );

      const distributorData = {
        ...distributor,
        location: await this.getLocation(
          distributor.location.country_id,
          distributor.location.state_id,
          distributor.location.city_id,
          distributor.location.address
        ),
        authorized_countries: authorizedCountries,
      };
      const {
        is_deleted,
        authorized_country_ids,
        country_name,
        city_name,
        ...rest
      } = distributorData;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public update = (
    id: string,
    brand_id: string,
    payload: IDistributorRequest
  ): Promise<IMessageResponse | IDistributorResponse> => {
    return new Promise(async (resolve) => {
      const foundDistributor = await this.distributorModel.findBy({
        id,
        brand_id,
      });

      if (!foundDistributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_NOT_FOUND,
          statusCode: 404,
        });
      }

      const updatedDistributor = await this.distributorModel.update(
        id,
        payload
      );
      if (!updatedDistributor) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const { is_deleted, country_name, city_name, ...rest } =
        updatedDistributor;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public delete = (id: string, brand_id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const foundDistributor = await this.distributorModel.findBy({
        id,
        brand_id,
      });
      if (!foundDistributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_NOT_FOUND,
          statusCode: 404,
        });
      }

      const updatedDistributor = await this.distributorModel.update(id, {
        is_deleted: true,
      });
      if (!updatedDistributor) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_DELETE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };

  public getList = (
    brand_id: string,
    limit: number,
    offset: number,
    filter: any,
    sort_name: string,
    sort_order: "ASC" | "DESC"
  ): Promise<IMessageResponse | IGetListDistributorResponse | any> => {
    return new Promise(async (resolve) => {
      const distributors = await this.distributorModel.list(
        limit,
        offset,
        {
          ...filter,
          brand_id,
        },
        [sort_name, sort_order]
      );

      const result = await Promise.all(
        distributors.map(async (distributor: IDistributorAttributes) => {
          const {
            is_deleted,
            authorized_country_ids,
            country_name,
            city_name,
            ...rest
          } = distributor;
          return {
            ...rest,
            location: await this.getLocation(
              distributor.location.country_id,
              distributor.location.state_id,
              distributor.location.city_id,
              distributor.location.address
            ),
            authorized_countries: await this.getAuthorizedCountries(
              distributor.authorized_country_ids
            ),
          };
        })
      );
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
}
