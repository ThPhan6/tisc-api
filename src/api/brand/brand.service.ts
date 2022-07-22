import {
  BRAND_STATUSES,
  BRAND_STATUS_OPTIONS,
  MESSAGES,
  REGION_KEY,
  SYSTEM_TYPE,
  VALID_IMAGE_TYPES,
} from "../../constant/common.constant";
import BrandModel, {
  IBrandAttributes,
  BRAND_NULL_ATTRIBUTES,
} from "../../model/brand.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IBrandByAlphabetResponse,
  IBrandCardsResponse,
  IBrandProfileResponse,
  IBrandRequest,
  IBrandResponse,
  IBrandsResponse,
  IUpdateBrandProfileRequest,
} from "./brand.type";
import MailService from "../../service/mail.service";
import UserModel, { USER_NULL_ATTRIBUTES } from "../../model/user.model";
import LocationModel from "../../model/location.model";
import ProductService from "../../api/product/product.service";
import { IAvatarResponse } from "../user/user.type";
import { upload, deleteFile } from "../../service/aws.service";
import { toWebp } from "../../helper/image.helper";
import moment from "moment";
import { ROLES, USER_STATUSES } from "../../constant/user.constant";
import { getAccessLevel, getDistinctArray } from "../../helper/common.helper";
import { createResetPasswordToken } from "../../helper/password.helper";
import PermissionService from "../permission/permission.service";
import DistributorModel from "../../model/distributor.model";
import CollectionModel from "../../model/collection.model";
import ProductModel from "../../model/product.model";
import MarketAvailabilityService from "../market_availability/market_availability.service";
import CountryStateCityService from "../../service/country_state_city_v1.service";

export default class BrandService {
  private brandModel: BrandModel;
  private mailService: MailService;
  private userModel: UserModel;
  private locationModel: LocationModel;
  private productService: ProductService;
  private permissionService: PermissionService;
  private distributorModel: DistributorModel;
  private collectionModel: CollectionModel;
  private productModel: ProductModel;
  private marketAvailabilityService: MarketAvailabilityService;
  private countryStateCityService: CountryStateCityService;

  constructor() {
    this.brandModel = new BrandModel();
    this.mailService = new MailService();
    this.userModel = new UserModel();
    this.locationModel = new LocationModel();
    this.productService = new ProductService();
    this.permissionService = new PermissionService();
    this.distributorModel = new DistributorModel();
    this.collectionModel = new CollectionModel();
    this.productModel = new ProductModel();
    this.marketAvailabilityService = new MarketAvailabilityService();
    this.countryStateCityService = new CountryStateCityService();
  }

  public getList = (
    limit: number,
    offset: number,
    filter: any,
    sort_name: string,
    sort_order: "ASC" | "DESC"
  ): Promise<IBrandsResponse> => {
    return new Promise(async (resolve) => {
      const brands: IBrandAttributes[] = await this.brandModel.list(
        limit,
        offset,
        filter,
        [sort_name, sort_order]
      );
      const result = await Promise.all(
        brands.map(async (brand) => {
          const foundStatus = BRAND_STATUS_OPTIONS.find(
            (item) => item.value === brand.status
          );
          const users = await this.userModel.getMany(brand.team_profile_ids, [
            "id",
            "firstname",
            "lastname",
            "role_id",
            "email",
            "avatar",
          ]);
          const locations = await this.locationModel.getBy({
            type: SYSTEM_TYPE.BRAND,
            relation_id: brand.id,
          });
          const originLocation = await this.locationModel.getOriginLocation(
            brand.id
          );
          const distributors = await this.distributorModel.getBy({
            brand_id: brand.id,
          });
          const collections = await this.collectionModel.getBy({
            brand_id: brand.id,
          });
          const cards = await this.productModel.getBy({
            brand_id: brand.id,
          });
          const categories = getDistinctArray(
            cards.reduce((pre: string[], cur) => {
              return pre.concat(cur.category_ids);
            }, [])
          );
          const products = cards.reduce((pre: number, cur) => {
            cur.specification_attribute_groups.forEach((group) => {
              group.attributes.forEach((attribute) => {
                if (attribute.type === "Options")
                  pre = pre + (attribute.basis_options?.length || 0);
              });
            });
            return pre;
          }, 0);
          const coverages = getDistinctArray(
            distributors.reduce((pre: string[], cur) => {
              const temp = [cur.country_id].concat(cur.authorized_country_ids);
              return pre.concat(temp);
            }, [])
          );

          return {
            id: brand.id,
            name: brand.name,
            logo: brand.logo,
            origin: originLocation === false ? "" : originLocation.country_name,
            locations: locations.length,
            teams: users.length,
            distributors: distributors.length,
            coverages: coverages.length,
            categories: categories.length,
            collections: collections.length,
            cards: cards.length,
            products: products,
            assign_team: users,
            status: brand.status,
            status_key: foundStatus?.key,
            created_at: brand.created_at,
          };
        })
      );
      const pagination: IPagination = await this.brandModel.getPagination(
        limit,
        offset
      );

      return resolve({
        data: {
          brands: result,
          pagination,
        },
        statusCode: 200,
      });
    });
  };
  public getAllByAlphabet = (): Promise<IBrandByAlphabetResponse> => {
    return new Promise(async (resolve) => {
      const allBrand = await this.brandModel.getAllAndSortByName();
      let result = allBrand.reduce(
        (pre: any, cur: IBrandAttributes) => {
          let returnedValue;
          let arr;
          switch (cur.name.slice(0, 1).toLowerCase()) {
            case "a":
            case "b":
            case "c":
              {
                arr = pre.abc;
                arr.push(cur);
                returnedValue = {
                  ...pre,
                  abc: arr,
                };
              }
              break;
            case "d":
            case "e":
            case "f":
              {
                arr = pre.def;
                arr.push(cur);
                returnedValue = {
                  ...pre,
                  def: arr,
                };
              }
              break;
            case "g":
            case "h":
            case "i":
              {
                arr = pre.ghi;
                arr.push(cur);
                returnedValue = {
                  ...pre,
                  ghi: arr,
                };
              }
              break;
            case "j":
            case "k":
            case "l":
              {
                arr = pre.jkl;
                arr.push(cur);
                returnedValue = {
                  ...pre,
                  jkl: arr,
                };
              }
              break;
            case "m":
            case "n":
            case "o":
              {
                arr = pre.mno;
                arr.push(cur);
                returnedValue = {
                  ...pre,
                  mno: arr,
                };
              }
              break;
            case "p":
            case "q":
            case "r":
              {
                arr = pre.pqr;
                arr.push(cur);
                returnedValue = {
                  ...pre,
                  pqr: arr,
                };
              }
              break;
            case "s":
            case "t":
            case "u":
            case "v":
              {
                arr = pre.stuv;
                arr.push(cur);
                returnedValue = {
                  ...pre,
                  stuv: arr,
                };
              }
              break;

            default:
              {
                arr = pre.wxyz;
                arr.push(cur);
                returnedValue = {
                  ...pre,
                  wxyz: arr,
                };
              }
              break;
          }
          return returnedValue;
        },
        {
          abc: [],
          def: [],
          ghi: [],
          jkl: [],
          mno: [],
          pqr: [],
          stuv: [],
          wxyz: [],
        }
      );
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public getOne = (id: string): Promise<IBrandResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const brand = await this.brandModel.find(id);
      if (!brand) {
        return resolve({
          message: "Not found brand.",
          statusCode: 404,
        });
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
      return resolve({
        data: {
          ...brand,
          official_websites: officialWebsites,
        },
        statusCode: 200,
      });
    });
  };
  public invite = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const brand = await this.brandModel.find(id);
      if (!brand) {
        return resolve({
          message: MESSAGES.BRAND_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (brand.status !== BRAND_STATUSES.PENDING) {
        return resolve({
          message: "Invited.",
          statusCode: 400,
        });
      }
      const user = await this.userModel.getFirstBrandAdmin(brand.id);
      if (!user) {
        return resolve({
          message: MESSAGES.USER_NOT_FOUND,
          statusCode: 404,
        });
      }
      await this.mailService.sendRegisterEmail(user);
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
  public getListCard = (
    filter: any,
    sort: any
  ): Promise<IBrandCardsResponse> => {
    return new Promise(async (resolve) => {
      const brands: IBrandAttributes[] = await this.brandModel.getAllBy(
        filter,
        undefined,
        sort ? sort[0] : "created_at",
        sort ? sort[1] : "DESC"
      );
      const result = await Promise.all(
        brands.map(async (brand) => {
          const originLocation = await this.locationModel.getOriginLocation(
            brand.id
          );
          const brandSummary = await this.productService.getBrandProductSummary(
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
            country:
              originLocation === false ? "N/A" : originLocation.country_name,
            category_count: brandSummary.data.category_count,
            collection_count: brandSummary.data.collection_count,
            card_count: brandSummary.data.card_count,
            teams: teamProfiles,
          };
        })
      );
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public updateBrandProfile = (
    user_id: string,
    payload: IUpdateBrandProfileRequest
  ): Promise<IBrandProfileResponse | IMessageResponse> =>
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
      const updatedBrand = await this.brandModel.update(brand.id, payload);
      if (!updatedBrand) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      const result = {
        id: brand.id,
        name: updatedBrand.name,
        parent_company: updatedBrand.parent_company || "",
        logo: updatedBrand.logo,
        slogan: updatedBrand.slogan || "",
        mission_n_vision: updatedBrand.mission_n_vision || "",
        official_websites: updatedBrand.official_websites,
      };
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
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
          message: MESSAGES.USER_EXISTED,
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
      await this.permissionService.createBrandPermission(createdBrand.id);
      return resolve(await this.getOne(createdBrand.id));
    });

  public getAllBrandSummary = (): Promise<any> =>
    new Promise(async (resolve) => {
      const allBrand = await this.brandModel.getAll();
      const locationIds = getDistinctArray(
        allBrand.reduce((pre: string[], cur) => {
          return pre.concat(cur.location_ids);
        }, [])
      );
      const teamProfileIds = getDistinctArray(
        allBrand.reduce((pre: string[], cur) => {
          return pre.concat(cur.team_profile_ids);
        }, [])
      );
      const countryIds = await Promise.all(
        locationIds.map(async (locationId) => {
          const location = await this.locationModel.find(locationId);
          return location?.country_id || "";
        })
      );
      const distinctCountryIds = getDistinctArray(countryIds);
      const countries = await this.marketAvailabilityService.getRegionCountries(
        distinctCountryIds
      );
      const cards = (
        await Promise.all(
          allBrand.map(async (brand) => {
            return await this.productModel.getBy({ brand_id: brand.id });
          })
        )
      ).flat();
      const collectionIds = getDistinctArray(
        cards.map((product) => product.collection_id || "")
      );
      const categoryIds = getDistinctArray(
        cards.map((product) => product.category_ids).flat()
      );

      const products = cards.reduce((pre: number, cur) => {
        cur.specification_attribute_groups.forEach((group) => {
          group.attributes.forEach((attribute) => {
            if (attribute.type === "Options")
              pre = pre + (attribute.basis_options?.length || 0);
          });
        });
        return pre;
      }, 0);
      return resolve({
        data: {
          brands: allBrand.length,
          locations: locationIds.length,
          teams: teamProfileIds.length,
          countries: countries.length,
          africa: countries.filter((item) => item.region === REGION_KEY.AFRICA)
            .length,
          asia: countries.filter((item) => item.region === REGION_KEY.ASIA)
            .length,
          europe: countries.filter((item) => item.region === REGION_KEY.EUROPE)
            .length,
          north_america: countries.filter(
            (item) => item.region === REGION_KEY.NORTH_AMERICA
          ).length,
          oceania: countries.filter(
            (item) => item.region === REGION_KEY.OCEANIA
          ).length,
          south_america: countries.filter(
            (item) => item.region === REGION_KEY.SOUTH_AMERICA
          ).length,
          cards: cards.length,
          collections: collectionIds.length,
          categories: categoryIds.length,
          products: products,
        },
        statusCode: 200,
      });
    });
}
