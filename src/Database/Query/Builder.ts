import Connection from "../Connections/ArangoConnection";
import ArangoGrammar from "../Grammars/ArangoGrammar";
import DataParser from "../Parsers/DataParser";
import { QUERY_TYPE } from "../Constants/QueryConstant";
import { getTimestamps } from "../Utils/Time";
import { head, isEmpty } from "lodash";
import {
  BuilderBinding,
  Operator,
  Sequence,
  ValueBinding,
  QueryType,
  WhereInverse,
} from "../Interfaces";

class Builder {
  public connection: Connection;
  public table: string;
  public softDelete: boolean;
  public bindings: BuilderBinding;
  private grammar: ArangoGrammar;

  constructor(
    connection: Connection,
    table: string,
    softDelete: boolean = false
  ) {
    this.connection = connection;
    this.table = table;
    this.softDelete = softDelete;
    this.bindings = {
      from: { table, alias: table },
      select: [],
      join: [],
      where: [],
      order: [],
      isCombineJoinSelect: false,
    };
    this.grammar = new ArangoGrammar();
  }

  public select(columns: string[] = ["*"]) {
    this.bindings = {
      ...this.bindings,
      select: columns,
    };
    return this;
  }

  public where(
    column: string,
    operator: Operator,
    value: ValueBinding,
    inverse: WhereInverse = false,
    and: boolean = true
  ) {
    ///
    const newWhere = this.bindings.where;
    newWhere.push({ column, operator, value, inverse, and });
    ///
    this.bindings = { ...this.bindings, where: newWhere };
    return this;
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
  public orWhere(
    column: string,
    operator: Operator,
    value: ValueBinding,
    inverse: WhereInverse = false
  ) {
    return this.where(column, operator, value, inverse, false);
  }

  public join(
    table: string,
    first: string,
    operator: Operator,
    second: string
  ) {
    const newJoin = this.bindings.join;
    newJoin.push({ table, first, operator, second });
    ///
    this.bindings = { ...this.bindings, join: newJoin };
    return this;
  }

  public order(column: string, order: Sequence = "ASC") {
    const newOrder = this.bindings.order;
    newOrder.push({ column, order });
    ///
    this.bindings = { ...this.bindings, order: newOrder };
    return this;
  }

  public limit(limit: number, offset: number = 0) {
    this.bindings = {
      ...this.bindings,
      pagination: { limit, offset },
    };
    return this;
  }

  public async get(isCombineJoinSelect: boolean = false) {
    this.bindings = {
      ...this.bindings,
      isCombineJoinSelect,
    };
    return this.query();
  }

  public async first(isCombineJoinSelect: boolean = false) {
    this.bindings = {
      ...this.bindings,
    };
    return head(await this.limit(1).get(isCombineJoinSelect));
  }

  public async count(type: QueryType = QUERY_TYPE.COUNT) {
    return (head(await this.query(type)) ?? 0) as number;
  }

  public async paginate(
    limit: number = this.bindings.pagination?.limit ?? 10,
    offset: number = this.bindings.pagination?.offset ?? 0
  ) {
    const totalRecords = await this.count(QUERY_TYPE.COUNT_WITHOUT_PAGINATION);
    const data = await this.limit(limit, offset).get();
    return {
      pagination: {
        page: offset / limit + 1,
        page_size: limit,
        total: totalRecords,
        page_count: Math.ceil(totalRecords / limit),
      },
      data,
    };
  }

  public async delete() {
    if (isEmpty(this.bindings.where)) {
      return false;
    }
    try {
      if (this.softDelete) {
        return this.update({ deleted_at: getTimestamps() });
      }
      return this.query(QUERY_TYPE.DELETE);
    } catch {
      return false;
    }
  }

  public async update(dataUpdate: Object) {
    const newData = await this.query(QUERY_TYPE.UPDATE, {
      ...dataUpdate,
      updated_at: getTimestamps(),
    });
    return DataParser.removeDocumentKey(newData);
  }

  public async rawQuery(query: string, bindVars: Object) {
    const response = await this.connection.query({
      query: `FOR ${this.table} IN ${this.table} ${query}`,
      bindVars,
    });

    return response.all();
  }

  public async rawQueryV2(query: string, bindVars: Object) {
    const response = await this.connection.query({
      query,
      bindVars,
    });
    console.log(query);
    console.log(bindVars);
    return response.all();
  }

  private async query(
    type: QueryType = QUERY_TYPE.SELECT,
    dataUpdate: Object = {}
  ) {
    const response = await this.connection.query(
      this.grammar.compileQuery(this.bindings, type, dataUpdate)
    );
    return response.all();
  }
}

export default Builder;
