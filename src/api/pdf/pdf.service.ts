import { projectRepository } from "@/repositories/project.repository";
import { templateRepository } from "@/repositories/template.repository";
import { projectProductPDFConfigRepository } from "@/repositories/project_product_pdf_config.repository";
import { getBufferFile } from "@/service/aws.service";
import { projectProductRepository } from "@/api/project_product/project_product.repository";
import { projectZoneRepository } from "@/repositories/project_zone.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { MESSAGES, COMMON_TYPES } from "@/constants";
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
  mappingMaterialCode,
} from "./pdf.mapping";
import { ProjectPDfData } from "./pdf.type";
import {
  UserAttributes,
  ProjectProductPDFConfigAttribute,
  ProjectProductPDFConfigWithLocationAndType,
  ProjectAttributes,
} from "@/types";
import { isEmpty, map, merge, isUndefined, partition, clone } from "lodash";
import {
  errorMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { pdfNode } from "@/service/pdf/pdf.service";
import * as ejs from "ejs";
import { ENVIROMENT } from "@/config";
import { numberToFixed } from "@/helper/common.helper";

export default class PDFService {
  private baseTemplate = `${process.cwd()}/src/api/pdf/templates`;

  private injectBasePdfTemplate = async (content: string) => {
    return ejs.renderFile(`${this.baseTemplate}/layouts/base.layout.ejs`, {
      content,
    });
  };

  private getProjectData = async (projectId: string, user: UserAttributes) => {
    const res: ProjectPDfData = {};
    ///
    const project = await projectRepository.findProjectWithDesignData(
      projectId
    );
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
      { project, config }
    );
    const html = await this.injectBasePdfTemplate(coverHtml);
    return pdfNode.create(html).toBuffer();
  };

  private getSpecifyHeader = async (title: string, templateData: any) => {
    const headerHtml = (await ejs.renderFile(
      `${this.baseTemplate}/layouts/header.layout.ejs`,
      {
        title,
        ...templateData,
      }
    )) as string;
    return {
      header: {
        height: "4.6cm",
        contents: headerHtml,
      },
    };
  };
  private getInvoiceHeader = async (data: any, height?: string) => {
    const headerHtml = (await ejs.renderFile(
      `${this.baseTemplate}/invoice/header.ejs`,
      data
    )) as string;
    return {
      header: {
        height: height || "4.6cm",
        contents: headerHtml,
      },
    };
  };

  private getInvoiceFooter = async () => {
    const footerHtml: string = await ejs.renderFile(
      `${this.baseTemplate}/invoice/footer.ejs`
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
  private getSpecifyFooter = async (templateData: any) => {
    const footerHtml = (await ejs.renderFile(
      `${this.baseTemplate}/layouts/footer.layout.ejs`,
      templateData
    )) as string;
    return {
      footer: {
        height: "1.7cm",
        contents: {
          default: footerHtml,
        },
      },
    };
  };

  private dynamicRenderEjs = async (
    title: string,
    templatePath: string,
    templateData: any
  ) => {
    const headerOption = await this.getSpecifyHeader(title, templateData);
    const footerOption = await this.getSpecifyFooter(templateData);
    const templateHtml = (await ejs.renderFile(
      `${this.baseTemplate}/specification/${templatePath}`,
      templateData
    )) as string;
    const html = await this.injectBasePdfTemplate(templateHtml);
    return pdfNode.create(html, merge(headerOption, footerOption)).toBuffer();
  };

  // Buffer response

  public generateProjectProduct = async (
    user: UserAttributes,
    projectId: string,
    payload: Partial<ProjectProductPDFConfigAttribute>
  ) => {
    /// get project Data
    const projectData = await this.getProjectData(projectId, user);
    if (projectData.message) {
      return projectData.message;
    }
    /// get zone data
    const zones = await projectZoneRepository.getListWithTotalsize(projectId);
    // save issuing_for
    if (!payload.issuing_for_id) {
      return errorMessageResponse(MESSAGES.PDF_SPECIFY.NOT_FOUND);
    }
    const issueFor = await commonTypeRepository.findOrCreate(
      payload.issuing_for_id,
      user.relation_id,
      COMMON_TYPES.ISSUE_FOR
    );
    payload.issuing_for_id = issueFor.id;
    // save payload
    await projectProductPDFConfigRepository.updateByProjectId(
      projectId,
      payload
    );
    const pdfConfig =
      await projectProductPDFConfigRepository.findWithInfoByProjectId(
        projectId
      );
    const pdfBuffers: Buffer[] = [];

    if (!pdfConfig) {
      return errorMessageResponse(MESSAGES.PDF_SPECIFY.NOT_FOUND);
    }

    /// get selected templates
    const templates = await templateRepository
      .getModel()
      .whereIn("id", pdfConfig.template_ids)
      .order("sequence", "ASC")
      .get();
    const groupTemplate = groupSpecifyTemplates(templates);

    if (pdfConfig.has_cover) {
      pdfBuffers.push(
        await this.generateProjectCoverPage(projectData.project, pdfConfig)
      );
      // introTemplates include introduction and Preambles
      if (!isEmpty(groupTemplate.introTemplates)) {
        const mergeTemplates = await Promise.all(
          groupTemplate.introTemplates.map(async (template) => {
            return getBufferFile(template.pdf_url.substring(1));
          })
        );
        pdfBuffers.push(...mergeTemplates);
      }
    }
    // GET PDF DATA
    let response =
      await projectProductRepository.getWithBrandAndDistributorInfo(projectId);
    //
    response = response.map((el: any) => {
      const newEl = clone(el);
      const [weights, dimensions] = partition(
        newEl.product.dimension_and_weight,
        (newEl) => newEl.unit_1 === "kg"
      );

      const value1 = dimensions
        .map(
          (newEl: any) =>
            `${newEl.prefix} ${numberToFixed(newEl.value_1)} ${newEl.unit_1}`
        )
        .join(" x ");
      const value2 = dimensions
        .map(
          (newEl: any) =>
            `${newEl.prefix} ${numberToFixed(newEl.value_2)} ${newEl.unit_2}`
        )
        .join(" x ");
      newEl.product.dimension = value1 ? `${value1} (${value2})` : "No Specify";
      const weightValue1 = weights[0]
        ? `${numberToFixed(weights[0].value_1)} ${weights[0].unit_1}`
        : "";
      const weightValue2 = weights[0]
        ? `${numberToFixed(weights[0].value_2)} ${weights[0].unit_2}`
        : "";
      newEl.product.weight = weights[0]
        ? `${weightValue1} (${weightValue2})`
        : "No Specify";
      return newEl;
    });

    await Promise.all(
      map(
        groupTemplate.specificationTemplates,
        async (specificationTemplates) => {
          if (isEmpty(specificationTemplates)) {
            return false;
          }
          await Promise.all(
            specificationTemplates.map(async (template) => {
              const templatePath = findEjsTemplatePath(template.name);
              if (templatePath) {
                /// mapping data
                let data = response;
                if (templatePath.group === "brand") {
                  data = mappingPdfDataByBrand(response);
                }
                if (templatePath.group === "category") {
                  data = mappingPdfDataByCategory(response);
                }
                if (templatePath.group === "brand_distributor") {
                  data = mappingPdfDataByLocationAndDistributor(response);
                }
                if (templatePath.group === "finish_schedule") {
                  data = mappingFinishSchedules(response);
                }
                if (templatePath.group === "code_by_room") {
                  data = mappingCodeByRoom(response);
                }
                if (templatePath.group === "material_code_sub_list") {
                  data = mappingMaterialCode(response);
                }
                ////
                return this.dynamicRenderEjs(template.name, templatePath.path, {
                  data,
                  project: projectData.project,
                  config: pdfConfig,
                  user,
                  zones: mappingPdfZoneArea(zones),
                });
              }
            })
          ).then((finalBuffers) => {
            const pdfBufferOnly = finalBuffers.filter((res) => {
              return !isUndefined(res);
            }) as Buffer[];
            pdfBuffers.push(...pdfBufferOnly);
          });
        }
      )
    );

    return {
      project: projectData.project,
      pdfBuffer: pdfNode.merge(...pdfBuffers),
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
  public generateInvoicePdf = async (
    title: "Invoice" | "Receipt",
    data: any
  ) => {
    const params = {
      logo: `${ENVIROMENT.SPACES_ENDPOINT}/files-tisc/logo/black-logo.svg`,
      title,
    };
    const colWidth =
      data.billing_amount?.length > 10 ? data.billing_amount.length * 1.5 : 15;
    const headerOption = await this.getInvoiceHeader(params, "2.5cm");
    const footerOption = await this.getInvoiceFooter();
    const templateHtml = (await ejs.renderFile(
      `${this.baseTemplate}/invoice/invoice.ejs`,
      {
        ...params,
        ...data,
        colWidth,
      }
    )) as string;
    const html = await this.injectBasePdfTemplate(templateHtml);
    return pdfNode.create(html, merge(headerOption, footerOption)).toBuffer();
  };
}

export const pdfService = new PDFService();
