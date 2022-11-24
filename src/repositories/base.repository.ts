import { head, isEmpty, forEach, isUndefined } from "lodash";
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
  public async getAll(
    orderBy?: Extract<keyof DataType, string>,
    sequence?: "ASC" | "DESC"
  ) {
    if (!isUndefined(orderBy) && !isUndefined(sequence)) {
      return (await this.model
        .select()
        .order(orderBy, sequence)
        .get()) as DataType[];
    }
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
  public async findBy(params: {
    [key: string]: string | number | null | boolean;
  }) {
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
    const newData = await this.model.insert({
      ...this.DEFAULT_ATTRIBUTE,
      ...attributes,
    });
    if (isEmpty(newData)) {
      return undefined;
    }
    return newData as DataType;
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

  public async findAndDelete(id: string) {
    const foundItem: any = await this.model.where("id", "==", id).first();
    if (!foundItem) {
      return false;
    }
    return this.model.where("id", "==", foundItem.id).delete();
  }

  public async findAndUpdate(id: string, attributes: Partial<DataType>) {
    const foundItem: any = await this.model.where("id", "==", id).first();
    if (!foundItem) {
      return false;
    }
    return this.model.where("id", "==", foundItem.id).update(attributes);
  }

  /**
   * Get all by object params
   * @param params Partial<DataType>
   * @return DataType | undefined
   */
  public async getAllBy(params: {
    [key: string]: string | number | null | boolean;
  }) {
    let query = this.model.getQuery();
    forEach(params, (value, column) => {
      query = query.where(column, "==", value);
    });
    return (await query.get()) as DataType[];
  }
  /**
   * delete by object params
   * @param params Partial<DataType>
   * @return DataType | undefined
   */
  public async deleteBy(params: {
    [key: string]: string | number | null | boolean;
  }) {
    let query = this.model.getQuery();
    forEach(params, (value, column) => {
      query = query.where(column, "==", value);
    });
    return await query.delete();
  }
}
export default BaseRepository;
