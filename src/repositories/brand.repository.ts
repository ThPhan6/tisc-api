import BrandModel from '@/model/brand.models';
import BaseRepository from './base.repository';
import {BrandAttributes} from '@/types';

class BrandRepository extends BaseRepository<BrandAttributes> {
  protected model: BrandModel;
  protected DEFAULT_ATTRIBUTE: Partial<BrandAttributes> = {
    name: '',
    parent_company: '',
    logo: null,
    slogan: '',
    mission_n_vision: '',
    official_websites: [],
    team_profile_ids: [],
    status: 3,
  }

  constructor() {
    super();
    this.model = new BrandModel();
  }

  public async getAllAndSortByName() {
    return await this.model
      .select('*')
      .order('name', 'ASC')
      .get() as BrandAttributes[];
  }

  public async getByIds(ids: string[]) {
    return await this.model
      .select('id', 'name')
      .whereIn('id', ids)
      .get() as Pick<BrandAttributes, 'id' | 'name'>[];
  }

  public async summaryUserAndLocation(
    brandId?: string | null,
    type?: 'user' | 'location'
  ) {
    let query = this.model.getQuery();
    if (brandId) {
      query = query.where('brand.id', '==', brandId);
    }
    if (type === 'user') {
      query = query.join('users', 'users.relation_id', '==', 'brand.id');
    }
    if (type === 'location') {
      query = query.join('locations', 'location.relation_id', '==', 'brand.id');
    }
    return await query.count();
  }
}

export default BrandRepository;
export const brandRepository = new BrandRepository();
