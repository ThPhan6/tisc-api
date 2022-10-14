import { pdfService } from "./pdf.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {UserAttributes} from '@/types';
export default class FavouriteController {

  public generateProjectProduct = async (_req: Request, toolkit: ResponseToolkit) => {
    const response = await pdfService.generateProjectProduct();
    return toolkit
      .response(response)
      .header('Content-Disposition', 'attachment; filename=specify.pdf')
      .header('Content-Type', 'application/pdf');
  }

  public getProjectSpecifyConfig = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const projectId = req.params.project_id;
    const response = await pdfService.getProjectSpecifyConfig(user, projectId);
    return toolkit.response(response).code(response.statusCode)
  }
}
