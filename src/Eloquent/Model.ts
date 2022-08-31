import Connection from "./Connection";
import {
  BuilderBinding,
  WhereOperator,
} from './Interface/binding';

export default class Model<DataType> {
  protected table: string;

  public bindings: BuilderBinding = {
    select: [],
    join: [],
    where: [],
    order: [],
  };


  public where = (
    column: Extract<keyof DataType, string>,
    operator: WhereOperator = '==',
    value?: string | number
  ) => {
    ///
    const newWhere = this.bindings.where;
    newWhere.push({ column, operator, value });
    ///
    this.bindings = { ...this.bindings, where: newWhere };
  }

  // public join = (table: string, first: string, second: string) => {
  //   const newJoin = this.bindings.join;
  //   newJoin.push({
  //     table,
  //     alias: ``,
  //     value
  //   });
  // }
  // table
  // alias
  // first
  // second

  //
  // public get = (): DataType[] => {
  //   // if (keys) {
  //   //   this.query += isMerge
  //   //     ? ` return merge( ${toObject(keys, this.prefix)}, {@key: item })`
  //   //     : ` return ${toObject(keys, this.prefix)}`;
  //   // } else {
  //   //   this.query += isMerge
  //   //     ? ` return merge(  ${this.prefix}, {@key: item })`
  //   //     : ` return  ${this.prefix}`;
  //   // }
  //   // const executedData: any = await DB.query({
  //   //   query: this.query,
  //   //   bindVars: this.bindObj,
  //   // });
  //   // // reset query
  //   // this.query = this.temp;
  //   // this.bindObj = this.tempBindObj;
  //   // return executedData._result.map((item: any) => {
  //   //   return removeUnnecessaryArangoFields(item);
  //   // });
  // }
  //
  // // private parse
}
