import {
  ICategoryAttributes,
  ListCategoryWithPaginate,
} from "@/types/category.type";
import CategoryModel from "@/model/category.model";
import BaseRepository from "./base.repository";
import { IProductAttributes } from "@/types/product.type";
import { SortOrder } from "@/types";

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
        .where("name", "==", name)
        .first();
    } catch (error) {
      return false;
    }
  }

  public async getAllCategoriesSortByName(
    limit: number,
    offset: number,
    filter: any,
    mainCategoryOrder?: SortOrder
  ): Promise<ListCategoryWithPaginate> {
    return this.model
      .select()
      .order(
        mainCategoryOrder ? "name" : "created_at",
        mainCategoryOrder || "DESC"
      )
      .paginate(limit, offset);
  }

  public async findProductByMainCategoryId(mainCategoryId: string) {
    const params = {
      mainCategoryId,
    } as any;

    const rawQuery = `
    FILTER categories.id == @mainCategoryId
    FOR subCategory in categories.subs
    FOR category in subCategory.subs
    FOR products in products
    FOR productCategoryId in products.category_ids
    FILTER category.id == productCategoryId
    RETURN UNSET(products, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by'])
    `;
    return (await this.model.rawQuery(
      rawQuery,
      params
    )) as IProductAttributes[];
  }
}

export default CategoryRepository;
