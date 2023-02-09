import ProjectProductPDFConfigModel from "@/model/project_product_pdf_config.model";
import {
  ProjectProductPDFConfigAttribute,
  ProjectProductPDFConfigWithLocationAndType,
} from "@/types";
import BaseRepository from "./base.repository";
import moment from 'moment';
import {v4 as uuidv4} from 'uuid';
import {head} from 'lodash';

class ProjectProductPDFConfigRepository extends BaseRepository<ProjectProductPDFConfigAttribute> {
  protected model: ProjectProductPDFConfigModel;
  protected DEFAULT_ATTRIBUTE: Partial<ProjectProductPDFConfigAttribute> = {
    id: "",
    project_id: "",
    location_id: "",
    issuing_for_id: "",
    issuing_date: "",
    revision: "",
    has_cover: false,
    document_title: "",
    template_ids: [],
  };

  constructor() {
    super();
    this.model = new ProjectProductPDFConfigModel();
  }

  public updateByProjectId = (
    projectId: string,
    payload: Partial<ProjectProductPDFConfigAttribute>
  ) => {
    return this.model.where("project_id", "==", projectId).update(payload);
  };

  public findWithInfoByProjectId = async (projectId: string) => {
    return (await this.model
      .where("project_product_pdf_configs.project_id", "==", projectId)
      .join(
        "locations",
        "locations.id",
        "==",
        "project_product_pdf_configs.location_id"
      )
      .join(
        "common_types",
        "common_types.id",
        "==",
        "project_product_pdf_configs.issuing_for_id"
      )
      .first(true)) as ProjectProductPDFConfigWithLocationAndType | undefined;
  };

  public upsert = async (payload: Partial<ProjectProductPDFConfigAttribute>) => {
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    const result = await this.model.rawQueryV2(
      `UPSERT {project_id: @project_id, created_by: @created_by, deleted_at: null}
      INSERT @payloadWithId
      UPDATE @payload
      IN project_product_pdf_configs
      RETURN MERGE(UNSET(NEW, ['_key', '_id', '_rev', 'deleted_at']), {
        location_id: '',
        issuing_for_id: '',
        issuing_date: '',
        revision: '',
        has_cover: false,
        document_title: '',
        template_ids: []
      })
    `,
      {
        ...payload,
        payloadWithId: {
          ...this.DEFAULT_ATTRIBUTE,
          ...payload,
          id: uuidv4(),
          created_at: now,
          updated_at: now,
        },
        payload,
      }
    ) as ProjectProductPDFConfigAttribute[];
    return head(result);
  }
}

export default ProjectProductPDFConfigRepository;
export const projectProductPDFConfigRepository =
  new ProjectProductPDFConfigRepository();
