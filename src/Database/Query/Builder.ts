import Connection from "../Connections/ArangoConnection";
import ArangoGrammar from "../Grammars/ArangoGrammar";
import {
  BuilderBinding,
  Operator,
  GeneralOperator,
  Sequence,
  ValueBinding,
} from '../Interfaces';

class Builder<DataType> {
  public connection: Connection;
  public table: string;
  public softDelete: boolean;
  public bindings: BuilderBinding;
  private grammar: ArangoGrammar;

  constructor(
    connection: Connection,
    table: string,
    softDelete: boolean = false,
  ) {
    this.connection = connection;
    this.table = table;
    this.softDelete = softDelete;
    this.bindings = {
      from: { table, alias: table },
      select: [],
      join: [],
      where: [],
      rawFilter: [],
      order: [],
    };
    this.grammar = new ArangoGrammar();
  }

  public select(columns: string[] = ['*']){
    this.bindings = {
      ...this.bindings,
      select: columns
    }
    return this;
  }

  public where(
    column: string,
    operator: Operator,
    value: ValueBinding,
    inverse: boolean = false,
    and: boolean = true
  ){
    ///
    const newWhere = this.bindings.where;
    newWhere.push({ column, operator, value, inverse, and });
    ///
    this.bindings = { ...this.bindings, where: newWhere };
    return this;
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
  public orWhere(column: string, operator: Operator, value: ValueBinding, inverse: boolean = false) {
    return this.where(column, operator, value, inverse, false);
  }

  public join(
    table: string,
    first: string,
    operator: GeneralOperator,
    second: string
  ){
    const newJoin = this.bindings.join;
    newJoin.push({ table, first, operator, second });
    ///
    this.bindings = { ...this.bindings, join: newJoin };
    return this;
  }

  public order(column: string, order: Sequence = 'ASC'){
    const newOrder = this.bindings.order;
    newOrder.push({ column, order });
    ///
    this.bindings = { ...this.bindings, order: newOrder };
    return this;
  }

  public async get() {
    const da = this.grammar.compileQuery(this.bindings);
    console.log('da', da);
    const data = await this.connection.query(
      da
    );
    console.log('data', data.all());
    return [] as DataType[];
  }
}

export default Builder;
