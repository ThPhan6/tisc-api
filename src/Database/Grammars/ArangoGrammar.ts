import {isEmpty, isUndefined} from 'lodash';

import {
  FromBinding,
  JoinBinding,
  WhereBinding,
  OrderBinding,
  DynamicValueBinding,
  BuilderBinding,
} from '../Interfaces';

class ArangoGrammar {
  protected query: string = '';
  protected bindVars: DynamicValueBinding = {};

  public compileQuery(bindings: BuilderBinding) {
    const {from, select, join, where, order} = bindings;
    return this.compileFrom(from)
    .compileJoins(join)
    .compileWhere(from.alias, where)
    .compileOrder(from.alias, order)
    .compileSelect(from.alias, select)
    .getQuery();
  }

  protected compileFrom(from: FromBinding) {
    this.query += `FOR ${from.alias} IN ${from.table} `;
    return this;
  }


  protected compileJoins(joins: JoinBinding[]) {
    joins.forEach((join) => {
      this.query += ` FOR ${join.table} IN ${join.table} FILTER ${join.first} ${join.operator} ${join.second} `;
    });
    return this;
  }

  protected compileWhere(primaryAlias: string, filters: WhereBinding[]) {
    filters.forEach((filter, filterIndex) => {
      const valueAlias = `filter${filterIndex}`;
      //
      let column = filter.column;
      if (filter.column.indexOf('.') === -1) { /// not found alias
        column = `${primaryAlias}.${filter.column}`;
      }

      if (!filter.and) {
        this.query += ` OR ${column} ${filter.operator} @${valueAlias} `;
      } else {
        this.query += ` FILTER ${column} ${filter.operator} @${valueAlias} `;
      }

      /// bind value
      this.bindVars[valueAlias] = filter.value;
    });
    return this;
  }

  protected compileOrder(primaryAlias: string, sorts: OrderBinding[]) {
    sorts.forEach((sort, sortIndex) => {
      const sortDirection = `sort${sortIndex}`;
      let column = sort.column;
      if (sort.column.indexOf('.') === -1) { /// not found alias
        column = `${primaryAlias}.${sort.column}`;
      }
      this.query += ` SORT ${column} @${sortDirection}`;
      /// bind sort direction
      this.bindVars[sortDirection] = sort.order;
    });
    return this;
  }

  protected compileSelect(primaryAlias: string, selects: string[]) {
    if (
      isEmpty(selects) ||
      (selects.length === 1 && selects[0].indexOf('*') > 0)
    ) { // select * from ...
      this.query += ` RETURN ${primaryAlias}`;
    } else {
      let aliases = selects.filter((select) => select.indexOf('.*') > -1);
      let fields = selects.filter((select) => select.indexOf('.*') === -1);
      this.query += ` RETURN merge(`;
      ///
      /// table select
      aliases = aliases.map((field) => {
        let [alias] = field.split('.');
        return `UNSET(${alias}, ['_id', '_key', '_rev'])`;
      });
      this.query += aliases.join(', ');
      /// custom select
      this.query += `{`;
      fields = fields.map((field) => {
        /// get column and alias of field
        let [column, alias] = field.replace(' AS ', ' as ').split(' as ');
        /// get table name and field name of column
        let [table, fieldName] = column.split('.');
        if (isUndefined(fieldName)) {
          fieldName = alias;
          alias = primaryAlias;
        }
        return `${alias ?? fieldName}: ${table}.${fieldName}`;
      });
      this.query += fields.join(', ');
      this.query += `})`;
    }
    return this;
  }

  protected getQuery() {
    return {
      query: this.query,
      bindVars: this.bindVars
    }
  }
}

export default ArangoGrammar;
