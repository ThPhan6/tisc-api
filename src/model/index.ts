import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import Builder from "../query_builder";

export default class Model<IModelData> {
  private modelName: string;
  public builder: Builder;
  public constructor(modelName: string) {
    this.modelName = modelName;
    this.builder = new Builder(this.modelName);
  }

  public list = async (
    limit: number,
    offset: number,
    filter: any,
    sort?: any,
    join?: {
      key: string;
      collection: string;
    }
  ): Promise<any> => {
    try {
      let result: any;
      if (sort) {
        if (join) {
          result = await this.builder
            .whereNot("is_deleted", true)
            .where(filter)
            .join(join.key, join.collection)
            .orderBy(sort[0], sort[1])
            .paginate(limit, offset)
            .select(undefined, true);
        } else
          result = await this.builder
            .whereNot("is_deleted", true)
            .where(filter)
            .orderBy(sort[0], sort[1])
            .paginate(limit, offset)
            .select();
      } else {
        if (join) {
          result = await this.builder
            .whereNot("is_deleted", true)
            .where(filter)
            .join(join.key, join.collection)
            .paginate(limit, offset)
            .select(undefined, true);
        } else {
          result = await this.builder
            .whereNot("is_deleted", true)
            .where(filter)
            .paginate(limit, offset)
            .select();
        }
      }
      return result;
    } catch (err) {
      return undefined;
    }
  };

  public create = async (params: Omit<IModelData, "id" | "created_at">) => {
    try {
      const id = uuidv4();
      const created_at = moment().toISOString();
      const record = {
        ...params,
        id,
        created_at,
      };
      const result = await this.builder.insert(record);
      if (result) {
        return record;
      }
      return undefined;
    } catch (err) {
      return undefined;
    }
  };

  public find = async (id: string): Promise<IModelData | undefined> => {
    try {
      return await this.builder
        .where("id", id)
        .whereNot("is_deleted", true)
        .first();
    } catch (error) {
      return undefined;
    }
  };

  public findBy = async (params: any): Promise<IModelData | undefined> => {
    try {
      const result: any = await this.builder
        .where(params)
        .whereNot("is_deleted", true)
        .first();
      return result;
    } catch (error) {
      return undefined;
    }
  };

  public getBy = async (params: any): Promise<IModelData[] | undefined> => {
    try {
      const result: any = await this.builder
        .where(params)
        .whereNot("is_deleted", true)
        .select();
      return result;
    } catch (error) {
      return undefined;
    }
  };

  public getAll = async (): Promise<IModelData[] | undefined> => {
    try {
      const result: any = await this.builder
        .whereNot("is_deleted", true)
        .select();
      return result;
    } catch (error) {
      return undefined;
    }
  };

  public update = async (
    id: string,
    params: object
  ): Promise<IModelData | undefined> => {
    try {
      const record = await this.find(id);
      if (record) {
        const isUpdated = await this.builder.where("id", id).update(params);
        if (isUpdated) {
          return await this.find(id);
        }
      }
      return undefined;
    } catch (error) {
      return undefined;
    }
  };

  // public delete = async (id: string): Promise<boolean> => {
  //   try {
  //     const record = await this.find(id);
  //     if (record) {
  //       await this.builder.where("id", id).delete();
  //       return true;
  //     }
  //     return false;
  //   } catch (error) {
  //     return false;
  //   }
  // };

  // public deleteMany = async (ids: string[]): Promise<boolean> => {
  //   try {
  //     await this.builder.whereIn("id", ids).delete();
  //     return true;
  //   } catch (error) {
  //     return false;
  //   }
  // };

  public join = async (
    key: string,
    collection: string,
    custom_key: string[]
  ) => {
    try {
      return await this.builder.join(key, collection).select(custom_key, true);
    } catch (error) {
      return false;
    }
  };
}
