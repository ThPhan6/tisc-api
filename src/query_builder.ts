import { Database } from "arangojs";
import dotenv from "dotenv";
dotenv.config();

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const toObject = (keys: Array<string>, prefix: string) => {
  const obj = keys.reduce((pre: any, cur: string) => {
    return { ...pre, [cur]: `${prefix}.${cur}` };
  }, {});
  return JSON.stringify(obj).replace(/"/gi, "");
};

const filterToAqlString = (filter: any, prefix: string) => {
  const keys = Object.keys(filter ? filter : {});
  return keys.reduce((pre, cur) => {
    if (typeof filter[cur] === "string") {
      return pre + `filter ${prefix}.${cur} == "${filter[cur]}" `;
    }
    return pre + `filter ${prefix}.${cur} == ${filter[cur]} `;
  }, "");
};

const removeUnnecessaryArangoFields = (obj: any) => {
  const { _id, _key, _rev, ...rest } = obj;
  return rest;
};

export default class Builder {
  private modelName: string;
  private prefix: string;
  private query: string;
  private temp: string;
  constructor(modelName: string) {
    this.modelName = modelName;
    this.prefix = "data";
    this.temp = ` for ${this.prefix} in ${this.modelName} `;
    this.query = ` for ${this.prefix} in ${this.modelName} `;
  }

  /**
   * Where functions
   */
  public where = (key: any, value?: string): any => {
    if (value && typeof key === "string") {
      this.query += ` filter ${this.prefix}.${key} == "${value}" `;
    }
    if (typeof key === "object") {
      this.query += ` ${filterToAqlString(key, this.prefix)} `;
    }
    return this;
  };

  public whereNot = (key: string, value: string) => {
    this.query += ` filter ${this.prefix}.${key} != '%${value}%' `;
    return this;
  };

  public whereIn = (key: string, value: Array<string>) => {
    this.query += ` filter ${this.prefix}.${key} in ${value} `;
    return this;
  };

  public whereNotIn = (key: string, value: Array<string>) => {
    this.query += ` filter ${this.prefix}.${key} not in ${value} `;
    return this;
  };

  public whereNull = (key: string) => {
    this.query += ` filter ${this.prefix}.${key} == null `;
    return this;
  };

  public whereNotNull = (key: string) => {
    this.query += ` filter ${this.prefix}.${key} != null `;
    return this;
  };

  public whereBetween = (key: string, value: Array<string>) => {
    this.query += ` filter ${this.prefix}.${key} > ${value[0]} and filter ${this.prefix}.${key} < ${value[1]} `;
    return this;
  };

  public whereNotBetween = (key: string, value: Array<string>) => {
    this.query += ` filter ${this.prefix}.${key} < ${value[0]} and filter ${this.prefix}.${key} > ${value[1]} `;
    return this;
  };

  public whereLike = (key: string, value: string) => {
    this.query += ` filter ${this.prefix}.${key} like '%${value}%' `;
    return this;
  };

  /**
   * Having methods
   */

  public paginate = (limit: number, offset?: number) => {
    if (!offset) {
      this.query += ` limit ${limit} `;
    } else {
      this.query += ` limit ${offset},${limit} `;
    }
    return this;
  };

  public groupBy = (key: string) => {
    this.query += ` collect group = ${this.prefix}.${key}`;
    return this;
  };

  public orderBy = (key: string, direction: string = "asc") => {
    this.query += ` sort ${this.prefix}.${key} ${direction}`;
    return this;
  };

  /**
   * Get methods
   */

  public select = async (keys?: Array<string>) => {
    if (keys) {
      this.query += ` return ${toObject(keys, this.prefix)}`;
    } else {
      this.query += ` return ${this.prefix} `;
    }
    const executedData: any = await db.query(this.query);
    // reset query
    this.query = this.temp;
    const result = executedData._result.map((item: any) => {
      return removeUnnecessaryArangoFields(item);
    });
    return result;
  };

  public first = async (keys?: Array<string>) => {
    if (keys) {
      this.query += ` return ${toObject(keys, this.prefix)}`;
    } else {
      this.query += ` return ${this.prefix} `;
    }
    const result: any = await db.query(this.query);
    // reset query
    this.query = this.temp;
    return removeUnnecessaryArangoFields(result._result[0]);
  };

  /**
   * Insert
   */
  public insert = async (params: object) => {
    try {
      const result: any = await db.query(
        `insert ${JSON.stringify(params)} into ${this.modelName} return NEW`
      );
      return result._result;
    } catch (error) {
      return false;
    }
  };

  /**
   * Update
   */
  public update = async (params: any) => {
    try {
      const { id, created_at, ...rest } = params;
      this.query += ` update ${this.prefix} with ${JSON.stringify(rest)} in ${
        this.modelName
      } return ${this.prefix}`;
      const isUpdated: any = await db.query(this.query);
      this.query = this.temp;
      const { _id, _key, _rev, ...result } = isUpdated._result[0];
      return result;
    } catch (error) {
      return false;
    }
  };

  /**
   * Delete
   */
  public delete = async () => {
    try {
      this.query += ` remove ${this.prefix} in ${this.modelName} `;
      const result: any = await db.query(this.query);
      this.query = this.temp;
      return true;
    } catch (error) {
      return false;
    }
  };
}
