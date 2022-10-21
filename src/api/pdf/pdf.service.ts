import { projectRepository } from "@/repositories/project.repository";
import { templateRepository } from "@/repositories/template.repository";
import { projectProductPDFConfigRepository } from "@/repositories/project_product_pdf_config.repository";
import {getBufferFile} from '@/service/aws.service';
import {projectProductRepository} from '@/api/project_product/project_product.repository';
import {projectZoneRepository} from '@/repositories/project_zone.repository';
import { MESSAGES } from "@/constants";
import {
  mappingSpecifyPDFTemplate,
  groupSpecifyTemplates,
  findEjsTemplatePath,
  mappingPdfDataByBrand,
  mappingPdfDataByCategory,
  mappingPdfDataByLocationAndDistributor,
  mappingFinishSchedules,
  mappingCodeByRoom,
  mappingPdfZoneArea,
} from "./pdf.mapping";
import { ProjectPDfData } from "./pdf.type";
import {
  UserAttributes,
  ProjectProductPDFConfigAttribute,
  ProjectProductPDFConfigWithLocationAndType,
  ProjectAttributes,
} from "@/types";
import { isEmpty, map, merge, isUndefined } from "lodash";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { pdfNode } from "@/service/pdf/pdf.service";
import * as ejs from "ejs";

export default class PDFService {
  private baseTemplate = `${process.cwd()}/src/api/pdf/templates`;

  private injectBasePdfTemplate = async (content: string) => {
    return await ejs.renderFile(
      `${this.baseTemplate}/layouts/base.layout.ejs`,
      { content }
    ) as string;
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

  private getSpecifyHeader = async (title: string, templateData: any) => {
    const headerHtml = await ejs.renderFile(
      `${this.baseTemplate}/layouts/header.layout.ejs`,
      {
        title,
        ...templateData,
      }
    ) as string;
    return {
      header: {
        height: "4.6cm",
        contents: headerHtml,
      },
    };
  };

  private getSpecifyFooter = async (templateData: any) => {
    const footerHtml = await ejs.renderFile(
      `${this.baseTemplate}/layouts/footer.layout.ejs`,
      templateData
    ) as string;
    return {
      footer: {
        height: "1.7cm",
        contents: {
          default: footerHtml,
        },
      },
    };
  };

  private dynamicRenderEjs = async (title: string, templatePath: string, templateData: any) => {
    const headerOption = await this.getSpecifyHeader(title, templateData);
    const footerOption = await this.getSpecifyFooter(templateData);
    const templateHtml = await ejs.renderFile(
      `${this.baseTemplate}/specification/${templatePath}`,
      templateData
    ) as string;
    const html = await this.injectBasePdfTemplate(templateHtml);
    return await pdfNode
      .create(html, merge(headerOption, footerOption))
      .toBuffer();
  }

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
    /// get zone data
    const zones = await projectZoneRepository.getListWithTotalsize(projectId);
    // save payload
    await projectProductPDFConfigRepository.updateByProjectId(projectId, payload);
    const pdfConfig = await projectProductPDFConfigRepository.findWithInfoByProjectId(projectId);
    console.log('projectData', projectData);
    console.log('pdfConfig', pdfConfig);
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

    if (pdfConfig.has_cover) {
      pdfBuffers.push(
        await this.generateProjectCoverPage(projectData.project, pdfConfig)
      );
      // introTemplates include introduction and Preambles
      if (!isEmpty(groupTemplate.introTemplates)) {
        const mergeTemplates = await Promise.all(groupTemplate.introTemplates.map(async (template) => {
            return await getBufferFile(template.pdf_url.substring(1));
        }));
        pdfBuffers.push(...mergeTemplates);
      }
    }
    // GET PDF DATA
    const response = await projectProductRepository.getWithBrandAndDistributorInfo(projectId);
    //

    await Promise.all(
      map(groupTemplate.specificationTemplates, async (specificationTemplates) => {
        if (isEmpty(specificationTemplates)) {
          return false;
        }
        await Promise.all((specificationTemplates.map(async (template) => {
          const templatePath = findEjsTemplatePath(template.name);
          if (templatePath) {
            /// mapping data
            let data = response;
            if (templatePath.group === 'brand') {
              data = mappingPdfDataByBrand(response);
            }
            if (templatePath.group === 'category') {
              data = mappingPdfDataByCategory(response);
            }
            if (templatePath.group === 'brand_distributor') {
              data = mappingPdfDataByLocationAndDistributor(response);
            }
            if (templatePath.group === 'finish_schedule') {
              data = mappingFinishSchedules(response);
            }
            if (templatePath.group === 'code_by_room') {
              data = mappingCodeByRoom(response);
            }
            ////
            return await this.dynamicRenderEjs(
              template.name,
              templatePath.path,
              {
                data,
                project: projectData.project,
                config: pdfConfig,
                user,
                zones: mappingPdfZoneArea(zones)
              }
            );
          }
        }))).then((finalBuffers) => {
          const pdfBufferOnly = finalBuffers.filter((res) => {
            return !isUndefined(res);
          }) as Buffer[];
          pdfBuffers.push(...pdfBufferOnly);
        });
      })
    );

    return {
      project: projectData.project,
      pdfBuffer: pdfNode.merge(...pdfBuffers)
    };
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
