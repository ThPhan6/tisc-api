import TemplateModel from "@/model/template.model";
import { TemplateAttributes } from "@/types";
import BaseRepository from "./base.repository";

class TemplateRepository extends BaseRepository<TemplateAttributes> {
  protected model: TemplateModel;

  constructor() {
    super();
    this.model = new TemplateModel();
  }

}

export default TemplateRepository;
export const templateRepository = new TemplateRepository();
