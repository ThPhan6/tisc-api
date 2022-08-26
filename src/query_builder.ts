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

export const removeUnnecessaryArangoFields = (obj: any) => {
  if (obj) {
    const { _id, _key, _rev, ...rest } = obj;
    return rest;
  }
  return obj;
};

export default class QueryBuilder {
  private modelName: string;
  private prefix: string;
  private query: string;
  private temp: string;
  private bindObj: any;
  private tempBindObj: any;
  constructor(modelName: string) {
    this.modelName = modelName;
    this.prefix = "data";
    this.temp = ` for ${this.prefix} in @@model `;
    this.query = ` for ${this.prefix} in @@model `;
    this.tempBindObj = { "@model": this.modelName };
    this.bindObj = { "@model": this.modelName };
  }

  private filterToAqlString = (
    filter: any,
    prefix: string,
    positive = true,
    exact = true
  ) => {
    const keys = Object.keys(filter ? filter : {});
    return keys.reduce((pre, cur) => {
      if (filter[cur] === undefined) {
        return pre;
      }
      this.bindObj = {
        ...this.bindObj,
        [cur]:
          typeof filter[cur] === "string"
            ? filter[cur].toString().toLowerCase()
            : filter[cur],
      };
      if (!exact) {
        return (
          pre +
          ` filter ` +
          (typeof filter[cur] === "string"
            ? `lower(${prefix}.${cur})`
            : `(${prefix}.${cur})`) +
          ` ${positive ? " " : " not"} like concat('%',` +
          (typeof filter[cur] === "string" ? `lower(@${cur})` : `@${cur}`) +
          `, '%') `
        );
      }
      return (
        pre +
        ` filter ` +
        (typeof filter[cur] === "string"
          ? `lower(${prefix}.${cur})`
          : `(${prefix}.${cur})`) +
        `${positive ? " =" : " !"}= ` +
        (typeof filter[cur] === "string" ? `lower(@${cur})` : `@${cur}`)
      );
    }, "");
  };

  /**
   * Where functions
   */
  public whereLike = (key: any, value?: string) => {
    if (value) {
      this.query += ` filter ${this.prefix}.${key} like concat('%',@${key}, '%') `;
      this.bindObj = { ...this.bindObj, [key]: value };
    }
    if (typeof key === "object") {
      this.query += ` ${this.filterToAqlString(
        key,
        this.prefix,
        true,
        false
      )} `;
    }
    return this;
  };
  public whereOr = (key: string, values: string[]) => {
    const parts = values.map((value, index) => {
      this.bindObj = { ...this.bindObj, [key + index]: value };
      return ` ${this.prefix}.${key} == @${key}${index} `;
    });
    this.query += ` filter ${parts.join(" or ")} `;
    return this;
  };
  public whereOrRevert = (keys: string[], value: string) => {
    const parts = keys.map((key) => {
      this.bindObj = { ...this.bindObj, [key]: value };
      return ` ${this.prefix}.${key} == @${key} `;
    });
    this.query += ` filter ${parts.join(" or ")} `;
    return this;
  };

  public whereNotLike = (key: any, value?: string) => {
    if (value) {
      this.query += ` filter ${this.prefix}.${key} not like concat('%',@${key}, '%') `;
      this.bindObj = { ...this.bindObj, [key]: value };
    }
    if (typeof key === "object") {
      this.query += ` ${this.filterToAqlString(
        key,
        this.prefix,
        false,
        false
      )} `;
    }
    return this;
  };

  public whereIn = (key: string, value: Array<string>) => {
    this.bindObj = { ...this.bindObj, [key]: value };
    this.query += ` filter ${this.prefix}.${key} in @${key} `;
    return this;
  };

  public whereInRevert = (key: string, value: any) => {
    this.bindObj = { ...this.bindObj, [key]: value };
    this.query += ` filter @${key} in ${this.prefix}.${key} `;
    return this;
  };

  public whereNotIn = (key: string, value: Array<string>) => {
    this.bindObj = { ...this.bindObj, [key]: value };
    this.query += ` filter ${this.prefix}.${key} not in @${key} `;
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
    this.bindObj = { ...this.bindObj, between0: value[0], between1: value[1] };
    this.query += ` filter ${this.prefix}.${key} > @between0 and filter ${this.prefix}.${key} < @between1 `;
    return this;
  };

  public whereNotBetween = (key: string, value: Array<string>) => {
    this.bindObj = { ...this.bindObj, between0: value[0], between1: value[1] };
    this.query += ` filter ${this.prefix}.${key} < @between0 and filter ${this.prefix}.${key} > @between1 `;
    return this;
  };

  public where = (key: any, value?: any) => {
    if (value || value === false || value === "") {
      this.query += ` filter ${this.prefix}.${key} == @${key} `;
      this.bindObj = { ...this.bindObj, [key]: value };
    }
    if (typeof key === "object") {
      this.query += ` ${this.filterToAqlString(key, this.prefix, true, true)} `;
    }
    return this;
  };

  public whereNot = (key: any, value?: any) => {
    if (value) {
      this.query += ` filter ${this.prefix}.${key} != @${key} `;
      this.bindObj = { ...this.bindObj, [key]: value };
    }
    if (typeof key === "object") {
      this.query += ` ${this.filterToAqlString(
        key,
        this.prefix,
        false,
        true
      )} `;
    }
    return this;
  };

  /**
   * Having methods
   */

  public paginate = (limit: number, offset?: number) => {
    if (!offset) {
      this.bindObj = { ...this.bindObj, limit };
      this.query += ` limit @limit `;
    } else {
      this.bindObj = { ...this.bindObj, limit, offset };
      this.query += ` limit @offset,@limit `;
    }
    return this;
  };

  public groupBy = async (key: string, count_key?: string) => {
    if (count_key) {
      this.query += ` collect ${key} = ${this.prefix}.${key} with count into ${count_key} return {${key}, ${count_key}}`;
    } else {
      this.query += ` collect ${key} = ${this.prefix}.${key} return {${key}}`;
    }
    const executedData: any = await db.query({
      query: this.query,
      bindVars: this.bindObj,
    });
    // reset query
    this.query = this.temp;
    this.bindObj = this.tempBindObj;
    return executedData._result.map((item: any) => {
      return removeUnnecessaryArangoFields(item);
    });
  };

  public orderBy = (key: string, direction: string = "asc") => {
    this.bindObj = { ...this.bindObj, direction };
    this.query += ` sort ${this.prefix}.${key} @direction`;
    return this;
  };

  /**
   * Get methods
   */

  public select = async (keys?: Array<string>, isMerge?: boolean) => {
    if (keys) {
      this.query += isMerge
        ? ` return merge( ${toObject(keys, this.prefix)}, {@key: item })`
        : ` return ${toObject(keys, this.prefix)}`;
    } else {
      this.query += isMerge
        ? ` return merge(  ${this.prefix}, {@key: item })`
        : ` return  ${this.prefix}`;
    }
    const executedData: any = await db.query({
      query: this.query,
      bindVars: this.bindObj,
    });
    // reset query
    this.query = this.temp;
    this.bindObj = this.tempBindObj;
    return executedData._result.map((item: any) => {
      return removeUnnecessaryArangoFields(item);
    });
  };

  public first = async (keys?: Array<string>, isMerge?: boolean) => {
    if (keys) {
      this.query += isMerge
        ? ` return merge (${toObject(keys, this.prefix)}, {@key: item }))`
        : ` return ${toObject(keys, this.prefix)}`;
    } else {
      this.query += isMerge
        ? ` return merge(${this.prefix}, {@key : item}) `
        : ` return ${this.prefix} `;
    }
    const result: any = await db.query({
      query: this.query,
      bindVars: this.bindObj,
    });
    // reset query
    this.query = this.temp;
    this.bindObj = this.tempBindObj;
    return removeUnnecessaryArangoFields(result._result[0]);
  };

  /**
   * Insert
   */
  public insert = async (params: object) => {
    try {
      const result: any = await db.query({
        query: `insert ${JSON.stringify(params)} into @@model return NEW`,
        bindVars: this.bindObj,
      });
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
      } return NEW`;
      const isUpdated: any = await db.query({
        query: this.query,
        bindVars: this.bindObj,
      });
      this.query = this.temp;
      this.bindObj = this.tempBindObj;
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
      this.query += ` remove ${this.prefix} in @@model `;
      await db.query({
        query: this.query,
        bindVars: this.bindObj,
      });
      this.query = this.temp;
      this.bindObj = this.tempBindObj;
      return true;
    } catch (error) {
      return false;
    }
  };

  public join = (key: string, collection: string) => {
    this.query += `FOR item in @@collection
        FILTER ${this.prefix}.${key} == item.id
      `;
    this.bindObj = {
      ...this.bindObj,
      key,
      "@collection": collection,
    };
    return this;
  };

  public raw = async (raw_string: string, bindObj: any) => {
    try {
      return await db.query({
        query: raw_string,
        bindVars: bindObj,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}
