import DocumentationModel from "@/model/documentation.model";
import {
  DocumentationType,
  IDocumentationAttributes,
  SortOrder,
} from "@/types";
import BaseRepository from "./base.repository";

class DocumentationRepository extends BaseRepository<IDocumentationAttributes> {
  protected model: DocumentationModel;
  protected DEFAULT_ATTRIBUTE: Partial<IDocumentationAttributes> = {
    logo: null,
    type: 0,
    title: "",
    document: {
      document: "",
      question_and_answer: [
        {
          question: "",
          answer: "",
        },
      ],
    },
    created_at: "",
    created_by: "",
    updated_at: "",
    number: 0,
  };
  constructor() {
    super();
    this.model = new DocumentationModel();
  }

  public async getDocumentationsByType(
    type: DocumentationType,
    limit: number,
    offset: number,
    sort: string,
    order: SortOrder = "DESC"
  ) {
    const params = {
      type,
      limit,
      offset,
    };
    const prefix = sort == "firstname" ? "user" : "documentations";

    const rawQuery = `
    FILTER documentations.type == @type
    let user = (
      FOR user in users
      FILTER user.deleted_at == null
      FILTER documentations.created_by == user.id
      return KEEP(user, "firstname", "lastname", "id")
    )
    ${`SORT ${prefix}.${sort} ${order}`}

    LIMIT @offset,@limit
    RETURN merge(UNSET(documentations,[
      '_key',
      '_id',
      '_rev',
      'deleted_at'
    ]), {author : user[0]})
    `;

    return this.model.rawQuery(rawQuery, params);
  }

  public async getHowtosByType(
    type: number,
    keys: string[],
    order: string,
    sort: SortOrder
  ) {
    return this.model
      .select(...keys)
      .where("type", "==", type)
      .order(order, sort)
      .get();
  }

  public async countDocumentationByType(type: DocumentationType) {
    return this.model.where("type", "==", type).count();
  }
}

export const documentationRepository = new DocumentationRepository();
export default DocumentationRepository;
