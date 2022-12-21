import StateModel from "@/model/state.model";
import BaseRepository from "./base.repository";
import { IStateAttributes } from "@/types";

class StateRepository extends BaseRepository<IStateAttributes> {
  protected model: StateModel;

  constructor() {
    super();
    this.model = new StateModel();
  }

  public getStatesByCountry = async (
    countryId: string
  ): Promise<IStateAttributes[]> => {
    return this.model
      .where("country_id", "==", countryId)
      .order("name", "ASC")
      .get();
  };
}

export default new StateRepository();
