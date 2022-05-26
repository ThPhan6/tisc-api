// import { Database } from "arangojs";
// import { v4 as uuidv4 } from "uuid";
// import moment from "moment";
// import dotenv from "dotenv";
// import Builder from "./builder";
// dotenv.config();

// const db = new Database({
//   url: process.env.DATABASE_HOSTNAME,
// });
// db.useDatabase(process.env.DATABASE_NAME || "");
// db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

// const filterToAql = (filter: any, prefix: string) => {
//   const keys = Object.keys(filter ? filter : {});
//   return keys.reduce((pre, cur) => {
//     if (typeof filter[cur] === "string") {
//       return pre + `filter ${prefix}.${cur} == "${filter[cur]}" `;
//     }
//     return pre + `filter ${prefix}.${cur} == ${filter[cur]} `;
//   }, "");
// };

// export default class Model<IModelData> {
//   private modelName: string;
//   private builder: Builder;
//   public constructor(modelName: string) {
//     this.modelName = modelName;
//     this.builder = new Builder(this.modelName);
//   }

//   public list = async (
//     limit: number,
//     offset: number,
//     filter: any,
//     sort?: any
//   ): Promise<any> => {
//     try {
//       let result: any;
//       if (sort) {
//         result = await db.query({
//           query: `
//           FOR data IN @@model
//           ${filterToAql(filter, "data")}
//           limit @offset,@limit
//           sort data.${sort[0]} @direction
//           RETURN data
//         `,
//           bindVars: {
//             offset: offset,
//             limit: limit,
//             "@model": this.modelName,
//             direction: sort[1],
//           },
//         });
//       } else {
//         result = await db.query({
//           query: `
//           FOR data IN @@model
//           ${filterToAql(filter, "data")}
//           limit @offset,@limit
//           sort data._key asc
//           RETURN data
//         `,
//           bindVars: {
//             offset: offset,
//             limit: limit,
//             "@model": this.modelName,
//           },
//         });
//       }
//       return result._result;
//     } catch (err) {
//       return false;
//     }
//   };

//   public create = async (params: Omit<IModelData, "id" | "created_at">) => {
//     try {
//       const id = uuidv4();
//       const created_at = moment().toISOString();
//       const record = {
//         ...params,
//         id,
//         created_at,
//       };
//       const result = await db.query({
//         query: `insert ${JSON.stringify(record)} into @@model`,
//         bindVars: {
//           "@model": this.modelName,
//         },
//       });
//       if (result) {
//         return record;
//       }
//       return false;
//     } catch (err) {
//       console.log(err);
//       return false;
//     }
//   };

//   public find = async (id: string): Promise<IModelData | false> => {
//     try {
//       const result: any = await db.query({
//         query: `for data in @@model filter data.id == @id return data`,
//         bindVars: {
//           "@model": this.modelName,
//           id,
//         },
//       });
//       return result._result[0];
//     } catch (error) {
//       return false;
//     }
//   };

//   public findBy = async (params: any): Promise<IModelData | false> => {
//     try {
//       const result: any = await db.query({
//         query: `for data in @@model ${filterToAql(params, "data")} return data`,
//         bindVars: {
//           "@model": this.modelName,
//         },
//       });
//       return result._result[0];
//     } catch (error) {
//       return false;
//     }
//   };

//   public getBy = async (params: any): Promise<IModelData[] | false> => {
//     try {
//       const result: any = await db.query({
//         query: `for data in @@model ${filterToAql(params, "data")} return data`,
//         bindVars: {
//           "@model": this.modelName,
//         },
//       });
//       return result._result;
//     } catch (error) {
//       return false;
//     }
//   };

//   public getAll = async (): Promise<IModelData[] | false> => {
//     try {
//       const result: any = await db.query({
//         query: `for data in @@model return data`,
//         bindVars: {
//           "@model": this.modelName,
//         },
//       });
//       return result._result;
//     } catch (error) {
//       return false;
//     }
//   };

//   public update = async (
//     id: string,
//     params: object
//   ): Promise<IModelData | false> => {
//     try {
//       const record = await this.find(id);
//       if (record) {
//         const isUpdated = await db.query({
//           query: `for data in @@model filter data.id == @id update data with ${JSON.stringify(
//             params
//           )} in @@model`,
//           bindVars: { "@model": this.modelName, id },
//         });
//         if (isUpdated) {
//           return {
//             ...record,
//             ...params,
//           };
//         }
//       }
//       return false;
//     } catch (error) {
//       return false;
//     }
//   };

//   public delete = async (id: string): Promise<boolean> => {
//     try {
//       const record = await this.find(id);
//       if (record) {
//         await db.query({
//           query: `for data in @@model filter data.id == @id remove data in @@model`,
//           bindVars: { "@model": this.modelName, id },
//         });
//         return true;
//       }
//       return false;
//     } catch (error) {
//       return false;
//     }
//   };

//   public deleteMany = async (ids: string[]): Promise<boolean> => {
//     try {
//       await db.query({
//         query: `for data in @@model filter data.id in @ids remove data in @@model`,
//         bindVars: { "@model": this.modelName, ids },
//       });
//       return true;
//     } catch (error) {
//       return false;
//     }
//   };
// }

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
    filter?: any,
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
            .where(filter)
            .join(join.key, join.collection)
            .paginate(limit, offset)
            .orderBy(sort[0], sort[1])
            .select();
        } else
          result = await this.builder
            .where(filter)
            .paginate(limit, offset)
            .orderBy(sort[0], sort[1])
            .select();
      } else {
        if (join) {
          result = await this.builder
            .where(filter)
            .join(join.key, join.collection)
            .paginate(limit, offset)
            .select(undefined, true);
        } else {
          result = await this.builder
            .where(filter)
            .paginate(limit, offset)
            .select();
        }
      }
      return result;
    } catch (err) {
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
      const result = await this.builder.insert(record);
      if (result) {
        return record;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  public find = async (id: string): Promise<IModelData | false> => {
    try {
      const result = await this.builder.where("id", id).first();
      return result;
    } catch (error) {
      return false;
    }
  };

  public findBy = async (params: any): Promise<IModelData | false> => {
    try {
      const result: any = await this.builder.where(params).first();
      return result;
    } catch (error) {
      return false;
    }
  };

  public getBy = async (params: any): Promise<IModelData[] | false> => {
    try {
      const result: any = await this.builder.where(params).select();
      return result;
    } catch (error) {
      return false;
    }
  };

  public getAll = async (): Promise<IModelData[] | false> => {
    try {
      const result: any = await this.builder.select();
      return result;
    } catch (error) {
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
        const isUpdated = await this.builder.where("id", id).update(params);
        if (isUpdated) {
          return isUpdated;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  public delete = async (id: string): Promise<boolean> => {
    try {
      const record = await this.find(id);
      if (record) {
        await this.builder.where("id", id).delete();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  public deleteMany = async (ids: string[]): Promise<boolean> => {
    try {
      await this.builder.whereIn("id", ids).delete();
      return true;
    } catch (error) {
      return false;
    }
  };

  public join = async (key: string, collection: string) => {
    try {
      const result = await this.builder
        .join(key, collection)
        .select(undefined, true);
      return result;
    } catch (error) {
      return false;
    }
  };
}
