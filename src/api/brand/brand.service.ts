import {
  BRAND_STATUSES,
  BRAND_STATUS_OPTIONS,
  MESSAGES,
  SYSTEM_TYPE,
  VALID_IMAGE_TYPES,
} from "../../constant/common.constant";
import BrandModel, { IBrandAttributes } from "../../model/brand.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IBrandByAlphabetResponse,
  IBrandCardsResponse,
  IBrandProfileResponse,
  IBrandResponse,
  IBrandsResponse,
  IUpdateBrandProfileRequest,
} from "./brand.type";
import MailService from "../../service/mail.service";
import UserModel from "../../model/user.model";
import LocationModel from "../../model/location.model";
import ProductService from "../../api/product/product.service";
import { IAvatarResponse } from "../user/user.type";
import { upload, deleteFile } from "../../service/aws.service";
import { toWebp } from "../../helper/image.helper";
import moment from "moment";

export default class BrandService {
  private brandModel: BrandModel;
  private mailService: MailService;
  private userModel: UserModel;
  private locationModel: LocationModel;
  private productService: ProductService;
  constructor() {
    this.brandModel = new BrandModel();
    this.mailService = new MailService();
    this.userModel = new UserModel();
    this.locationModel = new LocationModel();
    this.productService = new ProductService();
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
          return {
            id: brand.id,
            name: brand.name,
            logo: brand.logo,
            origin: "",
            locations: 1,
            teams: 1,
            distributors: 1,
            coverages: 1,
            categories: 1,
            collections: 1,
            cards: 1,
            products: 1,
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
      return resolve({
        data: brand,
        statusCode: 200,
      });
    });
  };
  public invite = (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const brand = await this.brandModel.find(id);
      if (!brand) {
        return resolve({
          message: "Not found brand.",
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
          message: "Not found user.",
          statusCode: 404,
        });
      }
      await this.mailService.sendRegisterEmail(user);
      return resolve({
        message: "Success.",
        statusCode: 200,
      });
    });
  };
  public getListCard = (
    limit: number,
    offset: number,
    filter: any,
    sort_name: string,
    sort_order: "ASC" | "DESC"
  ): Promise<IBrandCardsResponse> => {
    return new Promise(async (resolve) => {
      const brands: IBrandAttributes[] = await this.brandModel.list(
        limit,
        offset,
        filter,
        [sort_name, sort_order]
      );
      const result = await Promise.all(
        brands.map(async (brand) => {
          const location = await this.locationModel.find(
            brand.location_ids ? brand.location_ids[0] : ""
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
            country: location?.country_name || "",
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
        parent_company: updatedBrand.parent_company,
        logo: updatedBrand.logo,
        slogan: updatedBrand.slogan,
        mission_n_vision: updatedBrand.mission_n_vision,
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
          message: MESSAGES.NOT_VALID_LOGO,
          statusCode: 400,
        });
      }
      if (
        !VALID_IMAGE_TYPES.find(
          (item) => item === logo.hapi.headers["content-type"]
        )
      ) {
        return resolve({
          message: MESSAGES.NOT_VALID_LOGO,
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
}
