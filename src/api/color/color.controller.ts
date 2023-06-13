import { Request, ResponseToolkit } from "@hapi/hapi";
import { colorService } from "./color.service";

class ColorController {
  public detectColor = async (
    req: Request & { payload: { images: string[]; category_ids: string[] } },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const response = await colorService.detectColor(
      payload.images,
      payload.category_ids
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
  public getColorCollection = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const { saturation, lightness, hue } = req.query;
    const response = await colorService.getColorCollection(
      saturation,
      lightness,
      hue
    );
    return toolkit.response(response).code(response.statusCode ?? 200);
  };
}

export const colorController = new ColorController();
