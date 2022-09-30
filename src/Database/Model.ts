import Connection from "./Connections/ArangoConnection";
import Builder from "./Query/Builder";
import DataParser from "./Parsers/DataParser";
import {
  Operator,
  ValueBinding,
  DynamicValueBinding,
  WhereInverse,
} from "./Interfaces";

class Model<DataType> {
  protected connection: Connection;
  protected table: string = "";
  protected softDelete: boolean = false;

  constructor() {
    this.connection = new Connection();
  }

  public getQuery() {
    return new Builder(this.connection, this.table, this.softDelete);
  }

  public select(...columns: string[]) {
    return this.getQuery().select(columns);
  }

  public all(...columns: string[]) {
    return this.select(...columns).get();
  }

  public where(
    column: string,
    operator: Operator,
    value: ValueBinding,
    inverse: WhereInverse = false
  ) {
    return this.getQuery().where(column, operator, value, inverse);
  }

  public whereLike(column: string, value: ValueBinding) {
    return this.where(column, "like", value);
  }
  public whereNotLike(column: string, value: ValueBinding) {
    return this.where(column, "not like", value);
  }
  public whereIn(
    column: string,
    value: ValueBinding,
    inverse: WhereInverse = false
  ) {
    return this.where(column, "in", value, inverse);
  }
  public whereNotIn(
    column: string,
    value: ValueBinding,
    inverse: WhereInverse = false
  ) {
    return this.where(column, "not in", value, inverse);
  }
  public whereNull(column: string) {
    return this.where(column, "==", null);
  }
  public whereNotNull(column: string) {
    return this.where(column, "!=", null);
  }
  public count() {
    return this.getQuery().count();
  }
  public paginate(limit?: number, offset?: number) {
    return this.getQuery().paginate(limit, offset);
  }

  public async insert(data: Partial<DataType> | Partial<DataType>[]) {
    return (await this.connection.insert(
      this.table,
      DataParser.combineInsertData(data)
    )) as DataType | DataType[];
  }
  public async delete(id: string) {
    if (this.softDelete) {
      return await this.getQuery().where("id", "==", id).delete();
    }
  }

  public async rawQuery(query: string, bindVars: DynamicValueBinding) {
    return await this.getQuery().rawQuery(query, bindVars);
  }

  public async rawQueryV2(query: string, bindVars: DynamicValueBinding) {
    return await this.getQuery().rawQueryV2(query, bindVars);
  }
}
//
export default Model;
