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

      const country = await this.countryStateCityService.getCountryDetail(
        payload.country_id
      );
      const state = await this.countryStateCityService.getStateDetail(
        payload.country_id,
        payload.state_id
      );

      const cities = payload.state_id
        ? await this.countryStateCityService.getCitiesByStateAndCountry(
            payload.country_id,
            payload.state_id
          )
        : await this.countryStateCityService.getCitiesByCountry(
            payload.country_id
          );
      const city = cities
        .filter((city) => city.id.toString() == payload.city_id.toString())
        .reduce(function (pre: any, cur: any) {
          return cur;
        }, {});

      const createdDistributor = await this.distributorModel.create({
        ...DISTRIBUTOR_NULL_ATTRIBUTES,
        brand_id: payload.brand_id,
        name: payload.name,
        country_name: country.name,
        country_id: payload.country_id,
        state_id: payload.state_id,
        state_name: state.name,
        city_name: city.name,
        city_id: payload.city_id,
        address: payload.address,
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
      const returnDistributor = {
        ...createdDistributor,
        authorized_country_ids: await this.getAuthorizedCountries(
          payload.authorized_country_ids
        ),
      };
      const { is_deleted, ...rest } = returnDistributor;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public getOne = (
    id: string
  ): Promise<IMessageResponse | IDistributorResponse> => {
    return new Promise(async (resolve) => {
      const distributor = await this.distributorModel.find(id);
      if (!distributor) {
        return resolve({
          message: MESSAGES.DISTRIBUTOR_NOT_FOUND,
          statusCode: 404,
        });
      }

      const distributorData = {
        ...distributor,
        authorized_country_ids: await this.getAuthorizedCountries(
          distributor.authorized_country_ids
        ),
      };
      const { is_deleted, ...rest } = distributorData;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public update = (
    id: string,
    payload: IDistributorRequest
  ): Promise<IMessageResponse | IDistributorResponse | any> => {
    return new Promise(async (resolve) => {
      const foundDistributor = await this.distributorModel.find(id);

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
      const returnDistributor = {
        ...updatedDistributor,
        authorized_country_ids: await this.getAuthorizedCountries(
          updatedDistributor.authorized_country_ids
        ),
      };
      const { is_deleted, ...rest } = returnDistributor;
      return resolve({
        data: rest,
        statusCode: 200,
      });
    });
  };

  public delete = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const foundDistributor = await this.distributorModel.findBy(id);
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
    sort: string,
    order: "ASC" | "DESC"
  ): Promise<IMessageResponse | IGetListDistributorResponse> => {
    return new Promise(async (resolve) => {
      const distributors = await this.distributorModel.list(
        limit,
        offset,
        {
          ...filter,
          brand_id,
        },
        [sort, order]
      );

      const result = await Promise.all(
        distributors.map(async (distributor: IDistributorAttributes) => {
          const { is_deleted, ...rest } = distributor;
          return {
            ...rest,
            authorized_country_ids: await this.getAuthorizedCountries(
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
