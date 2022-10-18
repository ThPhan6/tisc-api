// import { MESSAGES } from "./../../constant/common.constant";
import { projectRepository } from "@/repositories/project.repository";
import { templateRepository } from "@/repositories/template.repository";
import { projectProductPDFConfigRepository } from "@/repositories/project_product_pdf_config.repository";
import {getBufferFile, listFilePrefix} from '@/service/aws.service';
// import {projectProductRepository} from '@/api/project_product/project_product.repository';
import { MESSAGES } from "@/constants";
import { mappingSpecifyPDFTemplate, groupSpecifyTemplates } from "./pdf.mapping";
import { ProjectPDfData } from "./pdf.type";
import {
  UserAttributes,
  ProjectProductPDFConfigAttribute,
  ProjectProductPDFConfigWithLocationAndType,
  ProjectAttributes
} from "@/types";
import { isEmpty, merge } from "lodash";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { pdfNode } from "@/service/pdf/pdf.service";
import * as ejs from "ejs";

export default class PDFService {
  private baseTemplate = `${process.cwd()}/src/api/pdf/templates`;

  private injectBasePdfTemplate = (content: string) => {
    return ejs.renderFile(
      `${this.baseTemplate}/layouts/base.layout.ejs`,
      { content }
    );
  };

  private getProjectData = async (
    projectId: string,
    user: UserAttributes
  ) => {
    const res: ProjectPDfData = {};
    ///
    const project = await projectRepository.findProjectWithDesignData(projectId);
    if (isEmpty(project) || project.design_id !== user.relation_id) {
      res.message = errorMessageResponse(MESSAGES.PROJECT_NOT_FOUND);
      return res;
    }
    res.project = project;
    return res;
  };

  private generateProjectCoverPage = async (
    project: ProjectAttributes & {
      design_firm_official_website: string;
      design_firm_name: string;
    },
    config: ProjectProductPDFConfigWithLocationAndType
  ) => {
    const coverHtml = await ejs.renderFile(
      `${this.baseTemplate}/cover/specify.ejs`,
      {project, config}
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

  // Buffer response


  public generateProjectProduct = async (
    user: UserAttributes,
    projectId: string,
    payload: Partial<ProjectProductPDFConfigAttribute>
    // payload: Omit<
    //   ProjectProductPDFConfigAttribute,
    //   'created_by' | 'created_at' | 'updated_at' | 'id' | 'project_id'
    // >
  ) => {
    /// get project Data
    const projectData = await this.getProjectData(projectId, user);
    if (projectData.message) {
      return projectData.message;
    }
    // save payload
    await projectProductPDFConfigRepository.updateByProjectId(projectId, payload);
    const pdfConfig = await projectProductPDFConfigRepository.findWithInfoByProjectId(projectId);
    console.log('pdfConfig', pdfConfig);
    console.log('projectData', projectData);

    const pdfBuffers: Buffer[] = [];

    if (!pdfConfig) {
      return errorMessageResponse(MESSAGES.PDF_SPECIFY.NOT_FOUND);
    }

    /// get selected templates
    const templates = await templateRepository.getModel()
      .whereIn('id', pdfConfig.template_ids)
      .order('sequence')
      .get();
    const groupTemplate = groupSpecifyTemplates(templates);

    if (true) {
    // if (pdfConfig.has_cover) {
      pdfBuffers.push(
        await this.generateProjectCoverPage(projectData.project, pdfConfig)
      );
      // mergeTemplate include introduction and Preambles
      if (!isEmpty(groupTemplate.mergeTemplate)) {
        const mergeTemplates = await Promise.all(groupTemplate.mergeTemplate.map(async (template) => {
            return await getBufferFile(template.pdf_url.substring(1));
        }));
        pdfBuffers.push(...mergeTemplates);
      }
    }

    return pdfNode.merge(...pdfBuffers);

    // // PDFBuffer
    // const pdfBuffers: Buffer[] = [];
    //
    //
    //
    // const coverHtml = await ejs.renderFile(
    //   `${this.baseTemplate}/cover/specify.ejs`
    // );
    // const html = await this.injectBasePdfTemplate(coverHtml, "specification");
    // const headerOption = await this.getSpecifyHeader(
    //   "finishes, materials & products listing by code"
    // );
    // const footerOption = await this.getSpecifyFooter();
    // console.log(html);
    // return await pdfNode
    //   .create(html, merge(headerOption, footerOption))
    //   .toBuffer();

    ////////


  };

  public getProjectSpecifyConfig = async (
    user: UserAttributes,
    projectId: string
  ) => {
    const projectData = await this.getProjectData(projectId, user);
    if (projectData.message) {
      return projectData.message;
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
