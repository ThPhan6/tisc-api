import LabelModel from "@/models/label.model";
import { ILabelAttributes } from "@/types";
import BaseRepository from "./base.repository";
import { head } from "lodash";

class LabelRepository extends BaseRepository<ILabelAttributes> {
  protected model: LabelModel;
  protected DEFAULT_ATTRIBUTE: Partial<ILabelAttributes> = {
    name: "",
  };
  constructor() {
    super();
    this.model = new LabelModel();
  }

  public async findLabelInBrand(
    name: string,
    brandId: string,
    parentId?: string | null
  ): Promise<ILabelAttributes | null> {
    const result = await this.model.rawQueryV2(
      `
      FOR label in labels
      FILTER label.deleted_at == null
      FILTER label.brand_id == @brandId
      FILTER LOWER(label.name) == LOWER(@name)
      ${parentId !== undefined ? "FILTER label.parent_id == @parentId" : ""}
      RETURN label
      `,
      { name, brandId, parentId }
    );

    return head(result);
  }
}
export default new LabelRepository();
export const labelRepository = new LabelRepository();
