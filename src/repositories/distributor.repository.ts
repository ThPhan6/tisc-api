import { GetListDistributorSort } from "@/api/distributor/distributor.type";
import DistributorModel from "@/models/distributor.model";
import { IDistributorAttributes, SortOrder } from "@/types";
import { pick, isEmpty } from "lodash";
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
    const activeDistributor =
      await locationRepository.getListWithLocation<IDistributorAttributes>(
        "partners",
        `
        FILTER partners.brand_id == '${brandId}'
        LET authorized = partners.authorized_country_ids[* FILTER CURRENT IN [${countries.map(
          (c) => `'${c}'`
        )}] RETURN CURRENT]
        FILTER count(authorized) > 0
        `
      );

    if (!isEmpty(activeDistributor)) {
      const beyondDistributor =
        await locationRepository.getListWithLocation<IDistributorAttributes>(
          "partners",
          `
          FILTER partners.brand_id == '${brandId}'
          FILTER partners.coverage_beyond == true
          FILTER partners.id NOT IN [${activeDistributor.map(
            (d) => `'${d.id}'`
          )}]
          `
        );
      return activeDistributor.concat(beyondDistributor);
    }
    return activeDistributor;
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
