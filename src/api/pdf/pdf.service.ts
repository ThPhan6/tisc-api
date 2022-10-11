// import { MESSAGES } from "./../../constant/common.constant";
import {projectRepository} from '@/repositories/project.repository';
// import {projectProductRepository} from '@/api/project_product/project_product.repository';
import {MESSAGES} from '@/constants';
import {UserAttributes} from '@/types';
import {isEmpty, merge} from 'lodash';
import {errorMessageResponse} from '@/helper/response.helper';
import {pdfNode} from '@/service/pdf/pdf.service';
import * as ejs from "ejs";

export default class PDFService {

  private baseTemplate = `${process.cwd()}/src/api/pdf/templates`;

  private injectBasePdfTemplate = (content: string, layout: 'specification' | 'none' = 'none') => {
    return ejs.renderFile(`${this.baseTemplate}/layouts/base.layout.ejs`, {content, layout});
  }

  private getProjectData = async (projectId: string, user: UserAttributes) => {
    const res: any = {};
    const project = await projectRepository.find(projectId);
    if (isEmpty(project)) {
      res.message = errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND);
      return res;
    }

    return res;
  }

  private generateCoverPage = async () => {
    const coverHtml = await ejs.renderFile(`${this.baseTemplate}/cover/specify.ejs`);
    const html = await this.injectBasePdfTemplate(coverHtml);
    return await pdfNode.create(html).toBuffer();
  }

  private getSpecifyHeader = async () => {
    const headerHtml = await ejs.renderFile(`${this.baseTemplate}/layouts/header.layout.ejs`);
    return {
      header: {
        height: '4.6cm',
        contents: headerHtml
      },
    }
  }

  private getSpecifyFooter = async () => {
    const footerHtml = await ejs.renderFile(`${this.baseTemplate}/layouts/footer.layout.ejs`);
    return {
      footer: {
        height: '1.7cm',
        contents: {
          default: footerHtml
        }
      },
    }
  }

  private mergePDF = () => {
    // pdfNode.merge
  }


  // Buffer response
  public generateProjectProduct = async () => {
    const coverHtml = await ejs.renderFile(`${this.baseTemplate}/specification/brand_distributor/contact_listing.ejs`);
    const html = await this.injectBasePdfTemplate(coverHtml, 'specification');
    const headerOption = await this.getSpecifyHeader();
    const footerOption = await this.getSpecifyFooter();
    console.log(html);
    return await pdfNode.create(html, merge(headerOption, footerOption)).toBuffer();
  }

}

export const pdfService = new PDFService();
