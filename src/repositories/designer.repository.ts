import DesingerModel from '@/model/designer.models';
import BaseRepository from './base.repository';
import {DesignerAttributes} from '@/types';

class DesignerRepository extends BaseRepository<DesignerAttributes> {
  protected model: DesingerModel;
  protected DEFAULT_ATTRIBUTE: Partial<DesignerAttributes> = {
    name: '',
    parent_company: '',
    logo: null,
    slogan: '',
    profile_n_philosophy: '',
    official_website: '',
    team_profile_ids: [],
    status: 1,
  }

  constructor() {
    super();
    this.model = new DesingerModel();
  }

}

export default DesignerRepository;
