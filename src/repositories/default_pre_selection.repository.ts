import BaseRepository from "./base.repository";
import DefaultPreSelectionModel from "@/models/default_pre_selection.model";
import { DefaultPreSelectionAttribute } from "@/types";

class DefaultPreSelectionRepository extends BaseRepository<DefaultPreSelectionAttribute> {
  protected model: DefaultPreSelectionModel;

  constructor() {
    super();
    this.model = new DefaultPreSelectionModel();
  }
}

export default new DefaultPreSelectionRepository();
export const defaultPreSelectionRepository =
  new DefaultPreSelectionRepository();
