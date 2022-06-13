import { DESIGN_STATUS_OPTIONS } from "../../constant/common.constant";
import DesignerModel, { IDesignerAttributes } from "../../model/designer.model";
import { IMessageResponse } from "../../type/common.type";
import { IDesignerResponse, IDesignersResponse } from "./designer.type";
import UserModel from "../../model/user.model";

export default class DesignerService {
  private designerModel: DesignerModel;
  private userModel: UserModel;
  constructor() {
    this.designerModel = new DesignerModel();
    this.userModel = new UserModel();
  }

  public getList = (
    limit: number,
    offset: number,
    filter: any,
    sort_name: string,
    sort_order: "ASC" | "DESC"
  ): Promise<IDesignersResponse> => {
    return new Promise(async (resolve) => {
      const designers: IDesignerAttributes[] = await this.designerModel.list(
        limit,
        offset,
        filter,
        [sort_name, sort_order]
      );
      const result = await Promise.all(
        designers.map(async (designer) => {
          const foundStatus = DESIGN_STATUS_OPTIONS.find(
            (item) => item.value === designer.status
          );
          const users = await this.userModel.getMany(
            designer.team_profile_ids,
            ["id", "firstname", "lastname", "role_id", "email", "avatar"]
          );
          return {
            id: designer.id,
            name: designer.name,
            logo: designer.logo,
            origin: "",
            main_office: "",
            satellites: 1,
            designers: 1,
            capacities: 1,
            projects: 1,
            live: 1,
            on_hold: 1,
            archived: 1,
            status: designer.status,
            status_key: foundStatus?.key,
            assign_team: users,
            created_at: designer.created_at,
          };
        })
      );
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public getOne = (
    id: string
  ): Promise<IDesignerResponse | IMessageResponse> => {
    return new Promise(async (resolve) => {
      const designer = await this.designerModel.find(id);
      if (!designer) {
        return resolve({
          message: "Not found desinger.",
          statusCode: 404,
        });
      }
      return resolve({
        data: designer,
        statusCode: 200,
      });
    });
  };
}
