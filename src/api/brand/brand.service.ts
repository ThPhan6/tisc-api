import BrandModel, { IBrandAttributes } from "../../model/brand.model";
import { IMessageResponse } from "../../type/common.type";
import { IBrandResponse, IBrandsResponse } from "./brand.type";

export default class BrandService {
  private brandModel: BrandModel;
  constructor() {
    this.brandModel = new BrandModel();
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
}
