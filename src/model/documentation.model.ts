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
  number: number;
}
export const DOCUMENTATION_NULL_ATTRIBUTES = {
  id: null,
  logo: null,
  type: null,
  title: null,
  document: {},
  created_at: null,
  created_by: null,
  updated_at: null,
  is_deleted: false,
  number: 0,
};
export default class DocumentationModel extends Model<IDocumentationAttributes> {
  constructor() {
    super("documentations");
  }

  public getListWithoutFilter = async (
    type: number,
    limit: number,
    offset: number,
    sort: any
  ) => {
    try {
      const bindObj = {
        "@model": "documentations",
        "@users": "users",
      };
      const prefix = sort && sort[0] == "firstname" ? "user" : "documentation";
      const queryString = `
          FOR documentation in @@model
          FOR user in @@users 
          FILTER documentation.created_by == user.id
          FILTER documentation.type == ${type}
          ${sort ? `SORT ${prefix}.${sort[0]} ${sort[1]}` : ""}
          LIMIT ${offset},${limit} 
          RETURN merge(documentation, {author : user})
        `;
      const result: any = await this.getBuilder().builder.raw(
        queryString,
        bindObj
      );
      return result._result;
    } catch (error) {
      return false;
    }
  };
}
