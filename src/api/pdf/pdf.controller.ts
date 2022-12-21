import { pdfService } from "./pdf.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {UserAttributes, ProjectProductPDFConfigAttribute} from '@/types';
import moment from 'moment';
import {kebabCase} from 'lodash';
import {toNonAccentUnicode} from '@/helper/common.helper';

export default class PDFController {

  public generateProjectProduct = async (req: Request & {
    payload: Partial<ProjectProductPDFConfigAttribute>,
    query: {responseType?: 'stream' | 'base64'}
  }, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const projectId = req.params.project_id;
    const responseType = req.query.responseType;

    const response: any = await pdfService.generateProjectProduct(user, projectId, req.payload);
    ///
    if (!response.project) {
      return toolkit.response(response).code(response.statusCode);
    }
    ///
    const filename = `project-${toNonAccentUnicode(kebabCase(response.project.name))}-${moment().unix()}.pdf`;
    if (responseType === 'base64') {
      return toolkit
        .response({
          filename,
          data: response.pdfBuffer.toString('base64')
        })
    }
    return toolkit
      .response(response.pdfBuffer)
      .header('Content-Disposition', `attachment; filename="${filename}`)
      .header('Content-Type', 'application/pdf');
  }

  public getProjectSpecifyConfig = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const projectId = req.params.project_id;
    const response = await pdfService.getProjectSpecifyConfig(user, projectId);
    return toolkit.response(response).code(response.statusCode)
  }
}
