import StateModel from '@/model/state.model';
import BaseRepository from './base.repository';
import {IStateAttributes} from '@/types';

class StateRepository extends BaseRepository<IStateAttributes> {
  protected model: StateModel;

  constructor() {
    super();
    this.model = new StateModel();
  }

  public getStatesByCountry = async (countryId: string) => {
    return await this.model
      .where('country_id', '==', countryId)
      .order('name', 'ASC')
      .get() as IStateAttributes[];
  }
}

export default new StateRepository();
