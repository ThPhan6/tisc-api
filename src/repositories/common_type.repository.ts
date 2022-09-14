import CommonTypeModel from '@/model/common_type.models';
import BaseRepository from './base.repository';
import {CommonTypeAttributes, CommonTypeValue} from '@/types';
import {COMMON_TYPES} from '@/constants';

class CommonTypeRepository extends BaseRepository<CommonTypeAttributes> {
  protected model: CommonTypeModel;
  protected DEFAULT_ATTRIBUTE: Partial<CommonTypeAttributes> = {
    name: '',
    type: COMMON_TYPES.SHARING_GROUP,
    relation_id: null,
  }
  constructor() {
    super();
    this.model = new CommonTypeModel();
  }

  public async findOrCreate(
    keyword: string,
    relationId: string | null,
    type: CommonTypeValue
  ) {
    let commonType = await this.findByNameOrId(keyword, relationId, type);
    if (!commonType) {
      commonType = await this.create({
        name: keyword,
        type,
        relation_id: relationId
      });
    }
    return commonType;
  }

  public async findByNameOrId(
    keyword: string,
    relationId: string | null,
    type: CommonTypeValue
  ) {
    return await this.model
      .where('type', '==', type)
      .where('id', '==', keyword)
      .orWhere('name', '==', keyword)
      .where('relation_id', '==', relationId)
      .orWhere('relation_id', '==', null)
      .first() as CommonTypeAttributes | undefined;
  }

  public async getAllByRelationAndType(
    relationId: string | null,
    type: CommonTypeValue
  ) {
    return await this.model
      .select('id', 'name')
      .where('type', '==', type)
      .where('relation_id', '==', relationId)
      .orWhere('relation_id', '==', null)
      .get() as Pick<CommonTypeAttributes, 'id' | 'name'>[];
  }
}

export default CommonTypeRepository;
