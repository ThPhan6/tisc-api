import { pdfService } from "./pdf.service";
import { Request, ResponseToolkit } from "@hapi/hapi";
import {UserAttributes} from '@/types';
export default class PDFController {

  public generateProjectProduct = async (req: Request, toolkit: ResponseToolkit) => {
    const user = req.auth.credentials.user as UserAttributes;
    const projectId = req.params.project_id;

    const response = await pdfService.generateProjectProduct(user, projectId, {
      location_id: 'f0da64d6-c001-42e5-b238-0e63b9ef1f0e',
      issuing_for_id: 'b1936587-210a-4d86-875b-9f3b6cc4ea48',
      document_title: 'Enablestartup Documentation Tender',
      issuing_date: '2022-12-02',
      revision: '#20220901-1',
      template_ids: [
        // '93a33785-a7c5-4234-8e12-d4ece0615070',
        // 'd37891fc-eb54-4053-b5b7-4f9b8654a3b5',
        // 'e77d203c-e8c5-40e2-8537-fbeffb35f1ea',
        // 'dff5ed63-b257-4e58-98e6-d2f279fb8fea',
        '26004554-8c88-4b88-9c11-5c9c8d8a4299',
      ]
    });
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
