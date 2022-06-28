import Model from "./index";

export interface IDocumentationAttributes {
  id: string;
  logo: string | null;
  type: number | null;
  title: string;
  document: object;
  created_at: string | null;
  created_by: string;
  updated_at: string | null;
  is_deleted: boolean;
}
export const DOCUMENTATION_NULL_ATTRIBUTES = {
  id: null,
  logo: null,
  type: null,
  title: null,
  document: null,
  created_at: null,
  created_by: null,
  updated_at: null,
  is_deleted: false,
};
export default class DocumentationModel extends Model<IDocumentationAttributes> {
  constructor() {
    super("documentations");
  }

  public getListWithoutFilter = async (
    type: number,
    limit: number,
    offset: number,
    sort?: any
  ) => {
    try {
      const bindObj = {
        "@model": "documentations",
        "@users": "users",
      };
      let queryString = "";
      if (sort) {
        const prefix = sort[0] == "firstname" ? "user" : "documentation";
        queryString = `
          FOR documentation in @@model
          FOR user in @@users 
          FILTER documentation.created_by == user.id
          FILTER documentation.type == ${type}
          SORT ${prefix}.${sort[0]} ${sort[1]}
          LIMIT ${offset},${limit} 
          RETURN merge(documentation, {author : user})
        `;
      } else {
        queryString = `
        FOR documentation in @@model
        FOR user in @@users 
        FILTER documentation.created_by == user.id
        FILTER documentation.type == ${type}
        LIMIT ${offset},${limit} 
        RETURN merge(documentation, {author : user})
      `;
      }
      console.log(bindObj, "[bindObj]");
      console.log(queryString, "[queryString]");
      const result: any = await this.builder.raw(queryString, bindObj);
      return result._result;
    } catch (error) {
      return false;
    }
  };
}
