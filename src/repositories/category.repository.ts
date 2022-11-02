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
    mainCategoryOrder?: SortOrder,
    haveProduct?: boolean
  ): Promise<ICategoryAttributes[]> {
    return this.model.rawQuery(
      `
      FILTER categories.deleted_at == null

      ${
        haveProduct
          ? `
        LET haveProduct = LENGTH(
          FOR subCategory IN categories.subs
          FOR category IN subCategory.subs
          FOR p IN products 
          FILTER category.id IN p.category_ids
          LIMIT 1 RETURN true)
        FILTER haveProduct > 0
      `
          : ""
      } 

      SORT categories.${mainCategoryOrder ? "name" : "created_at"} ${
        mainCategoryOrder || "DESC"
      }
      LIMIT @offset, @limit
      RETURN UNSET(categories, ['_id', '_key', '_rev', 'deleted_at'])
    `,
      { limit, offset }
    );
  }

  public async getAllCategoriesCount(haveProduct?: boolean): Promise<number[]> {
    return this.model.rawQuery(
      `
      FILTER categories.deleted_at == null

      ${
        haveProduct
          ? `
        LET haveProduct = LENGTH(
          FOR subCategory IN categories.subs
          FOR category IN subCategory.subs
          FOR p IN products 
          FILTER category.id IN p.category_ids
          LIMIT 1 RETURN true)
        FILTER haveProduct > 0
      `
          : ""
      }
      COLLECT WITH COUNT INTO length

      RETURN length
    `,
      {}
    );
  }

  public async findProductByMainCategoryId(mainCategoryId: string) {
    const params = {
      mainCategoryId,
    } as any;

    const rawQuery = `
    FILTER categories.id == @mainCategoryId
    FILTER categories.deleted_at == null
    FOR subCategory in categories.subs
    FOR category in subCategory.subs
    FOR products in products
    FILTER products.deleted_at == null
    FILTER category.id IN products.category_ids
    RETURN UNSET(products, ['_id', '_key', '_rev', 'deleted_at', 'deleted_by'])
    `;
    return (await this.model.rawQuery(
      rawQuery,
      params
    )) as IProductAttributes[];
  }
}

export default CategoryRepository;
