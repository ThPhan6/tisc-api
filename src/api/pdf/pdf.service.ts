// import { MESSAGES } from "./../../constant/common.constant";
import { projectRepository } from "@/repositories/project.repository";
import { templateRepository } from "@/repositories/template.repository";
import { projectProductPDFConfigRepository } from "@/repositories/project_product_pdf_config.repository";
// import {projectProductRepository} from '@/api/project_product/project_product.repository';
import { MESSAGES } from "@/constants";
import { mappingSpecifyPDFTemplate } from "./pdf.mapping";
import { UserAttributes } from "@/types";
import { isEmpty, merge } from "lodash";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { pdfNode } from "@/service/pdf/pdf.service";
import * as ejs from "ejs";

export default class PDFService {
  private baseTemplate = `${process.cwd()}/src/api/pdf/templates`;

  private injectBasePdfTemplate = (
    content: string,
    layout: "specification" | "none" = "none"
  ) => {
    return ejs.renderFile(`${this.baseTemplate}/layouts/base.layout.ejs`, {
      content,
      layout,
    });
  };

  private validateProjectWithRelation = async (
    projectId: string,
    user: UserAttributes
  ) => {
    const project = await projectRepository.find(projectId);
    if (isEmpty(project) || project.design_id !== user.relation_id) {
      return errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND);
    }
  };

  private getProjectData = async (projectId: string, user: UserAttributes) => {
    const res: any = {};
    const project = await projectRepository.find(projectId);
    if (isEmpty(project)) {
      res.message = errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND);
      return res;
    }

    return res;
  };

  private generateCoverPage = async () => {
    const coverHtml = await ejs.renderFile(
      `${this.baseTemplate}/cover/specify.ejs`
    );
    const html = await this.injectBasePdfTemplate(coverHtml);
    return await pdfNode.create(html).toBuffer();
  };

  private getSpecifyHeader = async (title: string) => {
    const headerHtml = await ejs.renderFile(
      `${this.baseTemplate}/layouts/header.layout.ejs`,
      { title }
    );
    return {
      header: {
        height: "4.6cm",
        contents: headerHtml,
      },
    };
  };

  private getSpecifyFooter = async () => {
    const footerHtml = await ejs.renderFile(
      `${this.baseTemplate}/layouts/footer.layout.ejs`
    );
    return {
      footer: {
        height: "1.7cm",
        contents: {
          default: footerHtml,
        },
      },
    };
  };

  private mergePDF = () => {
    // pdfNode.merge
  };

  // Buffer response
  public generateProjectProduct = async () => {
    const coverHtml = await ejs.renderFile(
      `${this.baseTemplate}/specification/finishes_material_products/reference_by_code.ejs`
    );
    const html = await this.injectBasePdfTemplate(coverHtml, "specification");
    const headerOption = await this.getSpecifyHeader(
      "finishes, materials & products listing by code"
    );
    const footerOption = await this.getSpecifyFooter();
    console.log(html);
    return await pdfNode
      .create(html, merge(headerOption, footerOption))
      .toBuffer();
  };

  public getProjectSpecifyConfig = async (
    user: UserAttributes,
    projectId: string
  ) => {
    const isInvalid = await this.validateProjectWithRelation(projectId, user);
    if (isInvalid) {
      return isInvalid;
    }

    let projectProductPDFConfig =
      await projectProductPDFConfigRepository.findBy({ project_id: projectId });

    if (!projectProductPDFConfig) {
      projectProductPDFConfig = await projectProductPDFConfigRepository.create({
        project_id: projectId,
        created_by: user.id,
      });
    }

    if (!projectProductPDFConfig) {
      return errorMessageResponse(MESSAGES.PDF_SPECIFY.ERROR_CREATE);
    }
    const templates = await templateRepository.getAll("sequence", "ASC");
    const templatesResponse = mappingSpecifyPDFTemplate(templates);

    return successResponse({
      data: {
        config: projectProductPDFConfig,
        templates: templatesResponse,
      },
    });
  };
}

export const pdfService = new PDFService();
