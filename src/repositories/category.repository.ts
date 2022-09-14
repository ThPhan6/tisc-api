import {
  ICategoryAttributes,
  ListCategoryWithPaginate,
} from "@/types/category.type";
import CategoryModel from "@/model/category.models";
import BaseRepository from "./base.repository";

class CategoryRepository extends BaseRepository<ICategoryAttributes> {
  protected model: CategoryModel;
  protected DEFAULT_ATTRIBUTE: Partial<ICategoryAttributes> = {
    name: "",
    subs: [],
    created_at: "",
  };
  constructor() {
    super();
    this.model = new CategoryModel();
  }
  public async getDuplicatedCategory(id: string, name: string) {
    try {
      return await this.model
        .where("id", "!=", id)
        .where("name", "==", name.toLowerCase())
        .first();
    } catch (error) {
      return false;
    }
  }

  public async getAllCategoriesSortByName(
    limit: number,
    offset: number,
    filter: any,
    mainCategoryOrder: "ASC" | "DESC"
  ) {
    return (await this.model
      .select()
      .order("name", mainCategoryOrder)
      .paginate(limit, offset)) as ListCategoryWithPaginate;
  }
}

export default CategoryRepository;
