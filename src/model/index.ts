import { Database } from "arangojs";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import dotenv from 'dotenv'
dotenv.config()

const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const filterToAql = (filter: any, prefix: string) => {
  const keys = Object.keys(filter ? filter : {});
  return keys.reduce((pre, cur) => {
    if (typeof filter[cur] === "string") {
      return pre + `filter ${prefix}.${cur} == "${filter[cur]}" `;
    }
    return pre + `filter ${prefix}.${cur} == ${filter[cur]} `;
  }, "");
};

export default class Model<IModelData> {
  private modelName: string;
  public constructor(modelName: string) {
    this.modelName = modelName;
  }

  public list = async (
    limit: number,
    offset: number,
    filter: any,
    sort?: any
  ): Promise<any> => {
    try {
      let result: any;
      if (sort) {
        result = await db.query({
          query: `
          FOR data IN @@model
          ${filterToAql(filter, "data")}
          limit @offset,@limit
          sort data.${sort[0]} @direction
          RETURN data
        `,
          bindVars: {
            offset: offset,
            limit: limit,
            "@model": this.modelName,
            direction: sort[1],
          },
        });
      } else {
        result = await db.query({
          query: `
          FOR data IN @@model
          ${filterToAql(filter, "data")}
          limit @offset,@limit
          sort data._key asc
          RETURN data
        `,
          bindVars: {
            offset: offset,
            limit: limit,
            "@model": this.modelName,
          },
        });
      }
      return result._result;
    } catch (err) {
      // console.error(err);
      return false;
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
      const result = await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": this.modelName,
        },
      });
      if (result) {
        return record;
      }
      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  public find = async (id: string): Promise<IModelData | false> => {
    try {
      const result: any = await db.query({
        query: `for data in @@model filter data.id == @id return data`,
        bindVars: {
          "@model": this.modelName,
          id,
        },
      });
      return result._result[0];
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  public update = async (
    id: string,
    params: object
  ): Promise<IModelData | false> => {
    try {
      const record = await this.find(id);
      if (record) {
        const isUpdated = await db.query({
          query: `for data in @@model filter data.id == @id update data with ${JSON.stringify(
            params
          )} in @@model`,
          bindVars: { "@model": this.modelName, id },
        });
        if (isUpdated) {
          return {
            ...record,
            ...params,
          };
        }
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  public delete = async (id: string): Promise<boolean> => {
    try {
      const record = await this.find(id);
      if (record) {
        await db.query({
          query: `for data in @@model filter data.id == @id remove data in @@model`,
          bindVars: { "@model": this.modelName, id },
        });
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}
