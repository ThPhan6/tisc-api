import Connection from "./Connections/ArangoConnection";
import Builder from './Query/Builder';
import {
  Operator,
  ValueBinding,
  // DynamicValueBinding,
} from './Interfaces';

class Model<DataType> {
  protected connection: Connection;
  protected table: string = '';
  protected softDelete: boolean = false;

  constructor() {
    this.connection = new Connection();
  }

  private newQueryBuilder() {
    return new Builder<DataType>( this.connection, this.table, this.softDelete );
  }

  public query<DataType>() {
      return (new Model<DataType>()).newQueryBuilder();
  }

  public select(...columns: string[]) {
    return this.query<DataType>().select(columns);
  }

  public all(...columns: string[]) {
    return this.select(...columns).get();
  }

  public where(
    column: string,
    operator: Operator,
    value: ValueBinding,
    inverse: boolean = false
  ) {
    return this.query<DataType>().where(column, operator, value, inverse);
  }

  public whereLike(column: string, value: ValueBinding ) {
    return this.where(column, 'like', value);
  }
  public whereNotLike(column: string, value: ValueBinding ) {
    return this.where(column, 'not like', value);
  }
  public whereIn(column: string, value: ValueBinding, inverse: boolean = false ) {
    return this.where(column, 'in', value, inverse);
  }
  public whereNotIn(column: string, value: ValueBinding, inverse: boolean = false ) {
    return this.where(column, 'not in', value, inverse);
  }
  public whereNull(column: string) {
    return this.where(column, '==', null);
  }
  public whereNotNull(column: string) {
    return this.where(column, '!=', null);
  }

  // public static raw(query: string, bindVars: DynamicValueBinding) {
  //   this.connection
  // }

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
//
export default Model;
