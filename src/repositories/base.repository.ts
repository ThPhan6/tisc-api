import { head, isEmpty, forEach } from "lodash";
import Model from "../Database/Model";

class BaseRepository<DataType> {
  protected model: Model<DataType>;
  protected DEFAULT_ATTRIBUTE: Partial<DataType> = {};

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
    return (await this.model.all()) as DataType[];
  }

  /**
   * Get one
   * @param id string
   * @return DataType | undefined
   */
  public async find(id: string) {
    return (await this.model.where("id", "==", id).first()) as
      | DataType
      | undefined;
  }

  /**
   * Get one by object params
   * @param params Partial<DataType>
   * @return DataType | undefined
   */
  public async findBy(params: { [key: string]: string | number | null }) {
    let query = this.model.getQuery();
    forEach(params, (value, column) => {
      query = query.where(column, "==", value);
    });
    return (await query.first()) as DataType | undefined;
  }

  /**
   * Create
   * @param attributes Partial<DataType>
   * @return DataType | DataType[]
   */
  public async create(attributes: Partial<DataType>) {
    return (await this.model.insert({
      ...this.DEFAULT_ATTRIBUTE,
      attributes,
    })) as DataType;
  }

  /**
   * Update
   * @param id string
   * @param attributes Partial<DataType>
   * @return DataType | false
   */
  public async update(id: string, attributes: Partial<DataType>) {
    const updatedData = await this.model
      .where("id", "==", id)
      .update(attributes);
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
    return this.model.where("id", "==", id).delete();
  }
}
export default BaseRepository;
