import { isEmpty, isUndefined } from "lodash";
import { QUERY_TYPE } from "../Constants/QueryConstant";
import {
  FromBinding,
  JoinBinding,
  WhereBinding,
  OrderBinding,
  DynamicValueBinding,
  BuilderBinding,
  PaginationBinding,
  QueryType,
} from "../Interfaces";

class ArangoGrammar {
  protected query: string = "";
  protected bindVars: DynamicValueBinding = {};
  private unQueryFields = ["_id", "_key", "_rev", "deleted_at", "deleted_by"];

  public compileQuery(
    bindings: BuilderBinding,
    type: QueryType = QUERY_TYPE.SELECT,
    dataUpdate: Object = {}
  ) {
    const { from, select, join, where, order, pagination } = bindings;
    const query = this.compileFrom(from)
      .compileJoins(join)
      .compileWhere(from.alias, where)
      .compileOrder(from.alias, order);

    /// combine limit offset
    if (type !== QUERY_TYPE.COUNT_WITHOUT_PAGINATION) {
      query.compileLimitOffset(pagination);
    }
    /// combine query select
    if (type === QUERY_TYPE.SELECT) {
      query.compileSelect(from.alias, select);
    }
    /// combine query count | pagination
    if (
      type === QUERY_TYPE.COUNT ||
      type === QUERY_TYPE.COUNT_WITHOUT_PAGINATION
    ) {
      query.compileCount();
    }
    /// compile query delete
    if (type === QUERY_TYPE.DELETE) {
      query.compileDelete(from.alias, from.table);
    }
    /// compile query update
    if (type === QUERY_TYPE.UPDATE) {
      query.compileUpdate(from.alias, from.table, dataUpdate);
    }

    return query.getQuery();
  }

  protected compileFrom(from: FromBinding) {
    this.query = `FOR ${from.alias} IN ${from.table} `;
    return this;
  }

  protected compileJoins(joins: JoinBinding[]) {
    joins.forEach((join) => {
      this.query += ` FOR ${join.table} IN ${join.table} FILTER ${join.first} ${join.operator} ${join.second} `;
      this.filterDeleteAt(join.table);
    });
    return this;
  }

  protected compileWhere(primaryAlias: string, filters: WhereBinding[]) {
    // always exclude delete_at
    this.filterDeleteAt(primaryAlias);
    //
    filters.forEach((filter, filterIndex) => {
      const valueAlias = `filter${filterIndex}`;
      //
      let column = filter.column;
      if (filter.column.indexOf(".") === -1) {
        /// not found alias
        column = `${primaryAlias}.${filter.column}`;
      }
      //
      if (filter.inverse) {
        // value | condition | column
        if (!filter.and) {
          // condition or where
          this.query += ` OR @${valueAlias} ${filter.operator} ${column} `;
        } else {
          this.query += ` FILTER @${valueAlias} ${filter.operator} ${column} `;
        }
      } else {
        // column | condition | value
        if (!filter.and) {
          // condition or where
          this.query += ` OR ${column} ${filter.operator} @${valueAlias} `;
        } else {
          this.query += ` FILTER ${column} ${filter.operator} @${valueAlias} `;
        }
      }
      // bind value
      this.bindVars[valueAlias] = filter.value;
    });
    return this;
  }

  protected compileOrder(primaryAlias: string, sorts: OrderBinding[]) {
    if (isEmpty(sorts)) {
      this.query += ` SORT ${primaryAlias}._key DESC `;
      return this;
    }
    sorts.forEach((sort, sortIndex) => {
      const sortDirection = `sort${sortIndex}`;
      let column = sort.column;
      if (sort.column.indexOf(".") === -1) {
        /// not found alias
        column = `${primaryAlias}.${sort.column}`;
      }
      this.query += ` SORT ${column} @${sortDirection}`;
      /// bind sort direction
      this.bindVars[sortDirection] = sort.order;
    });
    return this;
  }

  protected compileLimitOffset(pagination?: PaginationBinding) {
    if (pagination) {
      this.query += ` LIMIT ${pagination.offset ?? 0}, ${pagination.limit} `;
    }
    return this;
  }

  protected compileSelect(primaryAlias: string, selects: string[]) {
    if (
      isEmpty(selects) ||
      (selects.length === 1 && selects[0].indexOf("*") > 0)
    ) {
      // select * from ...
      this.query += ` RETURN ${this.unQueryField(primaryAlias)}`;
    } else {
      let aliases = selects.filter((select) => select.indexOf(".*") > -1);
      let fields = selects.filter((select) => select.indexOf(".*") === -1);
      this.query += ` RETURN merge(`;
      ///
      /// table select
      aliases = aliases.map((field) => {
        let [alias] = field.split(".");
        return this.unQueryField(alias);
      });
      this.query += aliases.join(", ");
      /// custom select
      this.query += `{`;
      fields = fields.map((field) => {
        /// get column and alias of field
        let [column, alias] = field.replace(" AS ", " as ").split(" as ");
        /// get table name and field name of column
        let [table, fieldName] = column.split(".");

        if (isUndefined(fieldName)) {
          fieldName = table;
          table = primaryAlias;
          if (!isUndefined(alias)) {
            fieldName = alias;
          }
        }
        return `${alias ?? fieldName}: ${table}.${fieldName}`;
      });
      this.query += fields.join(", ");
      this.query += `})`;
    }
    return this;
  }

  protected compileCount() {
    this.query += ` COLLECT WITH COUNT INTO length RETURN length`;
    return this;
  }

  protected compileDelete(alias: string, table: string) {
    this.query += ` REMOVE ${alias} IN ${table}`;
    return this;
  }

  protected compileUpdate(alias: string, table: string, newData: Object) {
    this.query += ` UPDATE ${alias} with ${JSON.stringify(
      newData
    )} IN ${table} RETURN NEW`;
    return this;
  }

  protected filterDeleteAt(alias: string) {
    this.query += ` FILTER ${alias}.deleted_at == null `;
  }

  protected getQuery() {
    return {
      query: this.query,
      bindVars: this.bindVars,
    };
  }

  private unQueryField(alias: string) {
    return `UNSET(${alias}, ${JSON.stringify(this.unQueryFields)})`;
  }
}

export default ArangoGrammar;
