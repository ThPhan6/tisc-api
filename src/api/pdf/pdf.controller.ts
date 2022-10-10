import { pdfService } from "./pdf.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
export default class FavouriteController {

  public generateProjectProduct = async (_req: Request, toolkit: ResponseToolkit) => {
    const response = await pdfService.generateProjectProduct();
    return toolkit
      .response(response)
      .header('Content-Disposition', 'attachment; filename=specify.pdf')
      .header('Content-Type', 'application/pdf');
  }

}
