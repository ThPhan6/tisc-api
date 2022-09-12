import Model from '../Database/Model';
import {head, isEmpty} from 'lodash';

class BaseRepository<DataType> {

  protected model: Model<DataType>;

  constructor() {
    this.model = new Model<DataType>();
  }

  public getModel() {
    return this.model;
  }

  /**
   * Get all
   * @return DataType[]
   */
  public async getAll() {
    return await this.model.all() as DataType[];
  }

  /**
   * Get one
   * @param id string
   * @return DataType | undefined
   */
  public async find(id: string) {
    return await this.model.where('id', '==', id).first() as DataType | undefined;
  }

  /**
   * Create
   * @param attributes Partial<DataType>
   * @return DataType | DataType[]
   */
  public async create(attributes: Partial<DataType> | Partial<DataType>[]) {
    return await this.model.insert(attributes);
  }

  /**
   * Update
   * @param id string
   * @param attributes Partial<DataType>
   * @return DataType | false
   */
  public async update(id: string, attributes:  Partial<DataType>) {
    const updatedData = await this.model.where('id', '==', id).update(attributes);
    if (!isEmpty(updatedData)) {
      return head(updatedData) as DataType;
    }
    return false;
  }

  /**
   * Delete
   * @param id string
   * @return boolean
   */
  public async delete(id: string) {
    return await this.model.where('id', '==', id).delete();
  }
}
export default BaseRepository;
