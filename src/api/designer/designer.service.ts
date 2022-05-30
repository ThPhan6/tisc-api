import DesignerModel, { IDesignerAttributes } from "../../model/designer.model";
import { IMessageResponse } from "../../type/common.type";
import { IDesignerResponse, IDesignersResponse } from "./designer.type";

export default class DesignerService {
  private designerModel: DesignerModel;
  constructor() {
    this.designerModel = new DesignerModel();
  }

  public getList = (
    limit: number,
    offset: number
  ): Promise<IDesignersResponse> => {
    return new Promise(async (resolve) => {
      const designers: IDesignerAttributes[] = await this.designerModel.list(
        limit,
        offset,
        {},
        ["created_at", "desc"]
      );
      const result = designers.map((designer) => {
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
          assign_team: [],
          created_at: designer.created_at,
        };
      });
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
