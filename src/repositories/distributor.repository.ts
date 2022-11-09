import { GetListDistributorSort } from "@/api/distributor/distributor.type";
import DistributorModel from "@/model/distributor.model";
import { IDistributorAttributes, SortOrder } from "@/types";
import { pick } from "lodash";
import { v4 } from "uuid";
import BaseRepository from "./base.repository";
import { locationRepository } from "./location.repository";

class DistributorRepository extends BaseRepository<IDistributorAttributes> {
  protected model: DistributorModel;
  protected DEFAULT_ATTRIBUTE: Partial<IDistributorAttributes> = {
    brand_id: "",
    location_id: "",
    name: "",
    first_name: "",
    last_name: "",
    gender: false,
    email: "",
    phone: "",
    mobile: "",
    authorized_country_ids: [],
    authorized_country_name: "",
    coverage_beyond: false,
  };
  constructor() {
    super();
    this.model = new DistributorModel();
  }

  public async getExistedBrandDistributor(
    id: string,
    brandId: string,
    name: string
  ) {
    return (await this.model
      .where("brand_id", "==", brandId)
      .where("id", "!=", id)
      .where("name", "==", name)
      .first()) as IDistributorAttributes;
  }

  public async getMarketDistributor(brandId: string, countries: string[]) {
    return locationRepository.getListWithLocation<IDistributorAttributes>(
      "distributors",
      `
        FILTER distributors.brand_id == '${brandId}'
        FILTER loc.country_id IN [${countries.map((c) => `'${c}'`)}]
        `
    );
  }

  public async getListDistributorWithPagination(
    limit: number,
    offset: number,
    brandId: string,
    sort: GetListDistributorSort,
    order: SortOrder
  ) {
    return locationRepository.getListWithLocation<IDistributorAttributes>(
      "distributors",
      `
        FILTER distributors.brand_id == '${brandId}'
        LET country_name = loc.country_name 
        LET city_name = loc.city_name 
        SORT ${
          sort === "city_name" || sort === "country_name"
            ? sort
            : `distributors.${sort}`
        } ${order}
        LIMIT ${offset}, ${limit}
     `
    );
  }

  public async syncDistributorLocations() {
    const distributors = await this.model
      .where("location_id", "==", null)
      .get();

    if (distributors.length === 0) {
      return;
    }

    const createLocationPromises = distributors.map(async (el: any) => {
      const location = await locationRepository.create({
        id: v4(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...pick(
          el,
          "country_id",
          "state_id",
          "city_id",
          "country_name",
          "state_name",
          "city_name",
          "phone_code",
          "address",
          "postal_code"
        ),
      });
      if (location) {
        await this.model.where("id", "==", el.id).update({
          location_id: location.id,
        });
      }
    });
    await Promise.all(createLocationPromises);
  }
}

export const distributorRepository = new DistributorRepository();
export default DistributorRepository;
