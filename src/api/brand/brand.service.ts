import {
  BRAND_STATUSES,
  BRAND_STATUS_OPTIONS,
} from "../../constant/common.constant";
import BrandModel, { IBrandAttributes } from "../../model/brand.model";
import { IMessageResponse, IPagination } from "../../type/common.type";
import {
  IBrandByAlphabetResponse,
  IBrandResponse,
  IBrandsResponse,
} from "./brand.type";
import MailService from "../../service/mail.service";
import UserModel from "../../model/user.model";

export default class BrandService {
  private brandModel: BrandModel;
  private mailService: MailService;
  private userModel: UserModel;
  constructor() {
    this.brandModel = new BrandModel();
    this.mailService = new MailService();
    this.userModel = new UserModel();
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
}
