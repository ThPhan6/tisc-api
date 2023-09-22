import BaseRepository from "./base.repository";
import SpecificationStepModel from "@/models/specification_step.model";
import { SpecificationStepAttribute } from "@/types";
import { BASIS_TYPES, SpecificationType } from "@/constants";

class SpecificationStepRepository extends BaseRepository<SpecificationStepAttribute> {
  protected model: SpecificationStepModel;

  constructor() {
    super();
    this.model = new SpecificationStepModel();
  }
  public async getStepsBy(product_id: string, specification_id: string) {
    const raw = `
    LET allBasisOption = (
      FOR group IN bases
      FILTER group.type == ${BASIS_TYPES.OPTION}
        FOR sub IN group.subs
          FOR value IN sub.subs
          RETURN MERGE(value, {sub_id: sub.id, sub_name: sub.name})
      )
    FOR ss IN specification_steps
    FILTER ss.product_id == @product_id
    FILTER ss.specification_id == @specification_id
      LET newOptions = (
        FOR option IN ss.options 
        LET foundBasisOption = FIRST(FOR bo IN allBasisOption FILTER bo.id == option.id RETURN bo)
        RETURN MERGE(option, foundBasisOption)
      )
    RETURN UNSET(MERGE(ss, {options: newOptions}), ['_id', '_key', '_rev', 'deleted_at'])`;
    const res = (await this.model.rawQueryV2(raw, {
      product_id,
      specification_id,
    })) as any;
    return res;
  }

  public async getSpecificationType(
    specification_id: string
  ): Promise<SpecificationType> {
    const result = await this.model.rawQueryV2(
      `
      FOR ss IN specification_steps
      FILTER ss.specification_id == @specification_id
      COLLECT WITH COUNT INTO length RETURN length
    `,
      { specification_id }
    );
    return result[0] > 0
      ? SpecificationType.autoStep
      : SpecificationType.attribute;
  }
}

export default new SpecificationStepRepository();
export const specificationStepRepository = new SpecificationStepRepository();
