import { BRAND_STATUSES } from "../../constant/common.constant";
import BrandModel, { IBrandAttributes } from "../../model/brand.model";
import { IMessageResponse } from "../../type/common.type";
import { IBrandResponse, IBrandsResponse } from "./brand.type";
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
    offset: number
  ): Promise<IBrandsResponse> => {
    return new Promise(async (resolve) => {
      const brands: IBrandAttributes[] = await this.brandModel.list(
        limit,
        offset,
        {},
        ["created_at", "desc"]
      );
      const result = brands.map((brand) => {
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
          assign_team: [],
          status: brand.status,
          created_at: brand.created_at,
        };
      });
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
