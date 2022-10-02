import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { brandRepository } from "./../../repositories/brand.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import {
  BRAND_STATUSES,
  BRAND_STATUS_OPTIONS,
  MESSAGES,
  REGION_KEY,
  ROLES,
  SYSTEM_TYPE,
  USER_STATUSES,
  VALID_IMAGE_TYPES,
} from "@/constants";
import {
  getAccessLevel,
  getDistinctArray,
  pagination,
} from "@/helper/common.helper";
import { toWebp } from "@/helper/image.helper";
import { createResetPasswordToken } from "@/helper/password.helper";
import BrandModel, { BRAND_NULL_ATTRIBUTES } from "@/model/brand.model";

import LocationModel, { ILocationAttributes } from "@/model/location.model";
import ProductModel from "@/model/product.model";
import UserModel, { USER_NULL_ATTRIBUTES } from "@/model/user.model";
import { distributorRepository } from "@/repositories/distributor.repository";
import { deleteFile, upload } from "@/service/aws.service";
import CountryStateCityService from "@/service/country_state_city_v1.service";
import MailService from "@/service/mail.service";
import { IMessageResponse, IPagination } from "@/type/common.type";
import { BrandAttributes, ICollectionAttributes, SortOrder } from "@/types";
import { IProductAttributes } from "@/types/product.type";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import MarketAvailabilityServices from "../market_availability/market_availability.services";
import { productService } from "../product/product.services";
// import {permissionService} from "@/api/permission/permission.service";
import { IAvatarResponse } from "../user/user.type";
import {
  IBrandByAlphabetResponse,
  IBrandCardsResponse,
  IBrandProfileResponse,
  IBrandRequest,
  IBrandResponse,
  IBrandsResponse,
  IUpdateBrandProfileRequest,
  IUpdateBrandStatusRequest,
} from "./brand.type";
import collectionRepository from "@/repositories/collection.repository";
import {
  getCountryName,
  mappingBrands,
  mappingBrandsAlphabet,
} from "./brand.mapping";
import { userRepository } from "@/repositories/user.repository";
export default class BrandService {
  private brandModel: BrandModel;
  private mailService: MailService;
  private locationModel: LocationModel;
  private productModel: ProductModel;
  private countryStateCityService: CountryStateCityService;
  private userModel: UserModel;
  constructor() {
    this.brandModel = new BrandModel();
    this.mailService = new MailService();
    this.locationModel = new LocationModel();
    this.productModel = new ProductModel();
    this.countryStateCityService = new CountryStateCityService();
    this.userModel = new UserModel();
  }

  public async getList(
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: SortOrder
  ) {
    const dataBrandCustom = await brandRepository.getListBrandCustom(
      limit,
      offset,
      sort,
      order
    );

    const result = mappingBrands(dataBrandCustom);

    return successResponse({
      data: {
        brands: result,
        pagination: pagination(limit, offset, result.length),
      },
    });
  }

  public async getAllByAlphabet() {
    const allBrand = await this.brandModel.getAllAndSortByName();

    let result = mappingBrandsAlphabet(allBrand);

    return successResponse({
      data: result,
    });
  }

  public async getOne(id: string) {
    const brand = await this.brandModel.find(id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404);
    }

    const officialWebsites = await Promise.all(
      brand.official_websites.map(async (officialWebsite) => {
        const country = await this.countryStateCityService.getCountryDetail(
          officialWebsite.country_id
        );
        return {
          ...officialWebsite,
          country_name:
            officialWebsite.country_id === "-1" ? "Global" : country.name,
        };
      })
    );

    return successResponse({
      data: { ...brand, official_websites: officialWebsites },
    });
  }

  public async invite(current_user_id: string, id: string) {
    const brand = await this.brandModel.find(id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND.BRAND_NOT_FOUND, 404);
    }

    if (brand.status !== BRAND_STATUSES.PENDING) {
      return errorMessageResponse(MESSAGES.GENERAL.INVITED);
    }

    const user = await userRepository.find(current_user_id);

    const inviteUser = await userRepository.getAdminOfCompany(brand.id);

    if (!user || !inviteUser) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND);
    }

    await this.mailService.sendInviteEmailTeamProfile(inviteUser, user);

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getListCard(filter: any, sort: any) {
    const brands = await brandRepository.getAllBrandsWithSort(sort);

    const result = await Promise.all(
      brands.map(async (brand) => {
        const originLocation = await this.locationModel.getOriginLocation(
          brand.id
        );
        const headquarter = await commonTypeRepository.findBy({
          name: "headquarter",
        });
        const headquarterLocation =
          await this.locationModel.getFirstHeadquarterLocation(
            brand.id,
            headquarter?.id || ""
          );
        const brandSummary: any = await productService.getBrandProductSummary(
          brand.id
        );

        const teamProfiles = await this.userModel.getMany(
          brand.team_profile_ids,
          ["id", "firstname", "lastname", "avatar"]
        );

        return {
          id: brand.id,
          name: brand.name,
          logo: brand.logo,
          country: getCountryName(originLocation, headquarterLocation),
          category_count: brandSummary.data.category_count,
          collection_count: brandSummary.data.collection_count,
          card_count: brandSummary.data.card_count,
          teams: teamProfiles,
        };
      })
    );
    return successResponse({
      data: result,
    });
  }

  public async updateBrandProfile(
    userId: string,
    payload: IUpdateBrandProfileRequest
  ) {
    const user = await userRepository.find(userId);

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    if (user.type !== SYSTEM_TYPE.BRAND || !user.relation_id) {
      return errorMessageResponse(MESSAGES.BRAND.NOT_IN_BRAND);
    }

    const brand = await brandRepository.find(user.relation_id);

    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND, 404);
    }

    const updatedBrand = await brandRepository.update(brand.id, payload);
    if (!updatedBrand) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_UPDATE);
    }

    return successResponse({
      data: {
        id: brand.id,
        name: updatedBrand.name,
        parent_company: updatedBrand.parent_company || "",
        logo: updatedBrand.logo,
        slogan: updatedBrand.slogan || "",
        mission_n_vision: updatedBrand.mission_n_vision || "",
        official_websites: updatedBrand.official_websites,
      },
    });
  }

  public updateLogo = (
    user_id: string,
    logo: any
  ): Promise<IMessageResponse | IAvatarResponse> =>
    new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (user.type !== SYSTEM_TYPE.BRAND || !user.relation_id) {
        return resolve({
          message: "You are not in this brand",
          statusCode: 400,
        });
      }
      const brand = await this.brandModel.find(user.relation_id);
      if (!brand) {
        return resolve({
          message: MESSAGES.BRAND_NOT_FOUND,
          statusCode: 404,
        });
      }

      if (!logo._data) {
        return resolve({
          message: MESSAGES.LOGO_NOT_VALID,
          statusCode: 400,
        });
      }
      if (
        !VALID_IMAGE_TYPES.find(
          (item) => item === logo.hapi.headers["content-type"]
        )
      ) {
        return resolve({
          message: MESSAGES.LOGO_NOT_VALID,
          statusCode: 400,
        });
      }
      const fileNameParts = logo.hapi.filename.split(".");
      const fileName = fileNameParts[0] + "_" + moment();
      const newFileName = fileName + "." + fileNameParts[1];
      if (brand.logo) {
        const urlParts = brand.logo.split("/");
        const oldNameParts = urlParts[2].split(".");
        await deleteFile(brand.logo.slice(1));
        await deleteFile("brand-logo/" + oldNameParts[0] + "_large.webp");
        await deleteFile("brand-logo/" + oldNameParts[0] + "_medium.webp");
        await deleteFile("brand-logo/" + oldNameParts[0] + "_small.webp");
        await deleteFile("brand-logo/" + oldNameParts[0] + "_thumbnail.webp");
      }
      const uploadedData = await upload(
        Buffer.from(logo._data),
        "brand-logo/" + newFileName,
        logo.hapi.headers["content-type"]
      );
      //upload 4 size webp
      const largeBuffer = await toWebp(Buffer.from(logo._data), "large");
      await upload(
        largeBuffer,
        "brand-logo/" + fileName + "_large.webp",
        "image/webp"
      );
      const mediumBuffer = await toWebp(Buffer.from(logo._data), "medium");
      await upload(
        mediumBuffer,
        "brand-logo/" + fileName + "_medium.webp",
        "image/webp"
      );
      const smallBuffer = await toWebp(Buffer.from(logo._data), "small");
      await upload(
        smallBuffer,
        "brand-logo/" + fileName + "_small.webp",
        "image/webp"
      );
      const thumbnailBuffer = await toWebp(
        Buffer.from(logo._data),
        "thumbnail"
      );
      await upload(
        thumbnailBuffer,
        "brand-logo/" + fileName + "_thumbnail.webp",
        "image/webp"
      );
      if (!uploadedData) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG,
          statusCode: 400,
        });
      }

      await this.brandModel.update(brand.id, {
        logo: "/brand-logo/" + newFileName,
      });
      return resolve({
        data: {
          url: "/brand-logo/" + newFileName,
        },
        statusCode: 200,
      });
    });

  public create = (
    payload: IBrandRequest
  ): Promise<IMessageResponse | IBrandResponse> =>
    new Promise(async (resolve) => {
      const brand = await this.brandModel.findBy({
        name: payload.name,
      });
      if (brand) {
        return resolve({
          message: MESSAGES.BRAND_EXISTED,
          statusCode: 400,
        });
      }
      const user = await this.userModel.findBy({
        email: payload.email,
      });
      if (user) {
        return resolve({
          message: MESSAGES.EMAIL_ALREADY_USED,
          statusCode: 400,
        });
      }
      const createdBrand = await this.brandModel.create({
        ...BRAND_NULL_ATTRIBUTES,
        name: payload.name,
        status: BRAND_STATUSES.PENDING,
      });
      if (!createdBrand) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      let verificationToken: string;
      let isDuplicated = true;
      do {
        verificationToken = createResetPasswordToken();
        const duplicateVerificationTokenFromDb = await this.userModel.findBy({
          verification_token: verificationToken,
        });
        if (!duplicateVerificationTokenFromDb) isDuplicated = false;
      } while (isDuplicated);
      const createdUser = await this.userModel.create({
        ...USER_NULL_ATTRIBUTES,
        firstname: payload.first_name,
        lastname: payload.last_name,
        gender: true,
        email: payload.email,
        role_id: ROLES.BRAND_ADMIN,
        access_level: getAccessLevel(ROLES.BRAND_ADMIN),
        verification_token: verificationToken,
        is_verified: false,
        status: USER_STATUSES.PENDING,
        type: SYSTEM_TYPE.BRAND,
        relation_id: createdBrand.id,
      });
      if (!createdUser) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      //create brand permissions
      // await permissionService.initPermission(createdUser);
      return resolve(await this.getOne(createdBrand.id));
    });

  public getAllBrandSummary = (): Promise<any> =>
    new Promise(async (resolve) => {
      let locations: ILocationAttributes[] = [];
      let countries: {
        id: string;
        name: string;
        phone_code: string;
        region: string;
      }[] = [];
      let collections: ICollectionAttributes[] = [];
      let cards: IProductAttributes[] = [];
      let categories: any[] = [];
      let products: number = 0;

      const brands = await this.brandModel.getAll(["id"]);
      const userCount = await this.brandModel.summaryUserAndLocation(
        null,
        "user"
      );
      for (const brand of brands) {
        /// need improve
        const brandLocations = await this.locationModel.getBy({
          type: SYSTEM_TYPE.BRAND,
          relation_id: brand.id,
        });
        locations = locations.concat(brandLocations);

        const foundCollections = await collectionRepository.getAllBy({
          brand_id: brand.id,
        });
        if (foundCollections.length)
          collections = collections.concat(foundCollections);

        const foundCards: any = await this.productModel.getBy({
          brand_id: brand.id,
        });
        if (foundCards) cards = cards.concat(foundCards);
      }
      ///
      const countryIds = await Promise.all(
        locations.map(async (location) => {
          return location.country_id;
        })
      );
      const distinctCountryIds = getDistinctArray(countryIds);
      countries = await MarketAvailabilityServices.getRegionCountries(
        distinctCountryIds
      );

      categories = getDistinctArray(
        cards.reduce((pre: string[], cur) => {
          return pre.concat(cur.category_ids);
        }, [])
      );

      products = cards.reduce((pre: number, cur) => {
        cur.specification_attribute_groups.forEach((group) => {
          group.attributes.forEach((attribute) => {
            if (attribute.type === "Options")
              pre = pre + (attribute.basis_options?.length || 0);
          });
        });
        return pre;
      }, 0);
      return resolve({
        data: [
          {
            id: uuidv4(),
            quantity: brands.length,
            label: "BRAND COMPANIES",
            subs: [
              {
                id: uuidv4(),
                quantity: locations.length,
                label: "Locations",
              },
              {
                id: uuidv4(),
                quantity: userCount,
                label: "Teams",
              },
            ],
          },
          {
            id: uuidv4(),
            quantity: countries.length,
            label: "COUNTRIES",
            subs: [
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.AFRICA
                ).length,
                label: "Africa",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.ASIA
                ).length,
                label: "Asia",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.EUROPE
                ).length,
                label: "Europe",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.NORTH_AMERICA
                ).length,
                label: "N.America",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.OCEANIA
                ).length,
                label: "Oceania",
              },
              {
                id: uuidv4(),
                quantity: countries.filter(
                  (item) => item.region === REGION_KEY.SOUTH_AMERICA
                ).length,
                label: "S.America",
              },
            ],
          },
          {
            id: uuidv4(),
            quantity: products,
            label: "PRODUCTS",
            subs: [
              {
                id: uuidv4(),
                quantity: getDistinctArray(categories).length,
                label: "Categories",
              },
              {
                id: uuidv4(),
                quantity: collections.length,
                label: "Collections",
              },
              {
                id: uuidv4(),
                quantity: cards.length,
                label: "Cards",
              },
            ],
          },
        ],
        statusCode: 200,
      });
    });

  public updateBrandStatus = (
    brand_id: string,
    payload: IUpdateBrandStatusRequest
  ): Promise<IMessageResponse> =>
    new Promise(async (resolve) => {
      const brand = await this.brandModel.find(brand_id);
      if (!brand) {
        return resolve({
          message: MESSAGES.BRAND_NOT_FOUND,
          statusCode: 404,
        });
      }

      if (brand.status !== payload.status) {
        const updatedBrandStatus = await this.brandModel.update(brand_id, {
          status: payload.status,
        });
        if (!updatedBrandStatus) {
          return resolve({
            message: MESSAGES.SOMETHING_WRONG_UPDATE,
            statusCode: 400,
          });
        }
        return resolve({
          message: MESSAGES.SUCCESS,
          statusCode: 200,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
}
