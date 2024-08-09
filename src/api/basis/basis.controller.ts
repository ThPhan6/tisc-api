import { Request, ResponseToolkit } from "@hapi/hapi";
import BasisService from "./basis.service";
import {
  IBasisConversionRequest,
  IBasisOptionRequest,
  IUpdateBasisOptionRequest,
  IBasisPresetRequest,
  IUpdateBasisPresetRequest,
  IBasisConversionUpdateRequest,
} from "./basis.type";
export default class BasisController {
  public createBasisConversion = async (
    req: Request & { payload: IBasisConversionRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await BasisService.createBasisConversion(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getBasisConversions = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const {
      limit,
      offset,
      filter,
      conversion_group_order,
      conversion_between_order,
    } = req.query;
    const response = await BasisService.getBasisConversions(
      limit,
      offset,
      filter,
      conversion_group_order,
      conversion_between_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public getBasisConversionById = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const response = await BasisService.getBasisConversionById(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public updateBasisConversion = async (
    req: Request & { payload: IBasisConversionUpdateRequest },
    toolkit: ResponseToolkit
  ) => {
    const { id } = req.params;
    const payload = req.payload;
    const response = await BasisService.updateBasisConversion(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public deleteBasis = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await BasisService.deleteBasis(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public createBasisOption = async (
    req: Request & { payload: IBasisOptionRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await BasisService.createBasisOption(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getBasisOption = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await BasisService.getBasisOption(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListBasisOption = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { limit, offset, filter, group_order, option_order, main_order } =
      req.query;
    const response = await BasisService.getListBasisOption(
      limit,
      offset,
      filter,
      group_order,
      main_order,
      option_order
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateBasisOption = async (
    req: Request & { payload: IUpdateBasisOptionRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const { id } = req.params;
    const response = await BasisService.updateBasisOption(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };

  public createBasisPreset = async (
    req: Request & { payload: IBasisPresetRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await BasisService.createBasisPreset(payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getBasisPreset = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await BasisService.getBasisPreset(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public copyBasisPreset = async (req: Request, toolkit: ResponseToolkit) => {
    const { id } = req.params;
    const response = await BasisService.copyBasisPreset(id);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getListBasisPreset = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const {
      limit,
      offset,
      filter,
      group_order,
      preset_order,
      sub_group_order,
      is_general,
    } = req.query;
    const response = await BasisService.getListBasisPreset(
      limit,
      offset,
      filter,
      group_order,
      preset_order,
      sub_group_order,
      is_general
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public updateBasisPreset = async (
    req: Request & { payload: IUpdateBasisPresetRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const { id } = req.params;
    const response = await BasisService.updateBasisPreset(id, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public changeIdtype = async (
    req: Request & { payload: { id_format_type: number } },
    toolkit: ResponseToolkit
  ) => {
    const { mainId } = req.params;
    const payload = req.payload;
    const response = await BasisService.changeIdtype(mainId, payload);
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}
