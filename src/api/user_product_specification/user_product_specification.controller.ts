import {
  UserProductSpecificationAttributes,
  UserProductSpecificationRequest,
} from "@/api/user_product_specification/user_product_specification.model";
import productRepository from "@/repositories/product.repository";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { customProductRepository } from "../custom_product/custom_product.repository";
import { linkageService } from "../linkage/linkage.service";
import { toOriginDataAndConfigurationStep } from "./user_product_specification.mapping";
import { userProductSpecificationRepository } from "./user_product_specification.repository";
import { projectProductRepository } from "@/api/project_product/project_product.repository";
import { specificationStepRepository } from "@/repositories/specification_step.repository";
import { stepSelectionRepository } from "@/repositories/step_selection.repository";
import { mappingSpecificationStep } from "../product/product.mapping";

export default class UserProductSpecificationController {
  public selectSpecification = async (
    req: Request & { payload: UserProductSpecificationRequest },
    toolkit: ResponseToolkit
  ) => {
    const payload = req.payload;
    const currentUserId = req.auth.credentials.user_id as string;
    const productId = req.params.id;

    const repo = payload.custom_product
      ? customProductRepository
      : productRepository;
    const product = await repo.find(req.params.id);

    if (!product) {
      return toolkit
        .response({
          message: "Product not found.",
          status: 400,
        })
        .code(400);
    }
    let mapping: any = payload.specification
      ? toOriginDataAndConfigurationStep(payload)
      : { data: payload };
    if (payload.specification) {
      const updatedStepSelection = await linkageService.upsertStepSelection({
        product_id: req.params.id,
        user_id: currentUserId,
        step_selections: mapping.step_selections,
        specification_id: mapping.specification_id,
      });
      if (updatedStepSelection.statusCode !== 200) {
        return toolkit.response(updatedStepSelection).code(400);
      }
    }
    const response = await userProductSpecificationRepository.upsert(
      productId,
      currentUserId,
      mapping.data
    );

    if (!response) {
      return "failed";
    }

    return toolkit.response("success").code(200);
  };

  private addStepDataToSpecification = async (
    data: UserProductSpecificationAttributes
  ) => {
    const newGroups = await Promise.all(
      data.specification.attribute_groups.map(async (attributeGroup) => {
        if (!attributeGroup.attributes[0]) {
          const stepSelection = await stepSelectionRepository.findBy({
            specification_id: attributeGroup.id,
            project_id: (data as any).project_id,
            deleted_at: null,
          });
          const specificationSteps: any = await linkageService.getSteps(
            data.product_id,
            attributeGroup.id || ""
          );
          const quantities = stepSelection?.quantities;
          const viewSteps = specificationSteps.data.map(
            (specificationStep: any, index: number) => {
              const combinedOptions = specificationStep.options.map(
                (option: any) => {
                  const tempSelectId: string = !option.pre_option
                    ? `${option.id}_1`
                    : option.pre_option
                        .split(",")
                        .concat(option.id)
                        .map((selectId: string) => `${selectId}_1`)
                        .join(",");
                  let picked = false;
                  if (
                    quantities &&
                    quantities[tempSelectId] &&
                    quantities[tempSelectId] > 0
                  ) {
                    picked = true;
                  }
                  const nextOptions = specificationSteps.data[
                    index + 1
                  ]?.options.filter(
                    (item: any) =>
                      item.pre_option ===
                      (option.pre_option
                        ? `${option.pre_option},${option.id}`
                        : option.id)
                  );
                  return {
                    ...option,
                    index: 1,
                    select_id: tempSelectId,
                    picked,
                    has_next_options: nextOptions?.length > 0,
                    yours: option.replicate,
                  };
                }
              );
              return {
                ...specificationStep,
                options: combinedOptions,
              };
            }
          );

          return {
            ...attributeGroup,
            viewSteps,
            step_selections: stepSelection,
          };
        }
        return attributeGroup;
      })
    );

    return {
      ...data,
      specification: {
        ...data.specification,
        attribute_groups: newGroups,
      },
    };
  };
  public getSelectedSpecification = async (
    req: Request,
    toolkit: ResponseToolkit
  ) => {
    const currentUserId = req.auth.credentials.user_id as string;
    const productId = req.params.id;
    const project_product_id = req.query.project_product_id;

    let response = await userProductSpecificationRepository.findBy({
      product_id: productId,
      user_id: currentUserId,
    });

    if (project_product_id) {
      // temp code need to refactor
      response = (await projectProductRepository.findBy({
        product_id: productId,
        id: project_product_id,
      })) as any;
      if (response) {
        response = (await this.addStepDataToSpecification(response)) as any;
      }
      response = {
        brand_location_id: response?.brand_location_id ?? "",
        distributor_location_id: response?.distributor_location_id ?? "",
        created_at: response?.created_at ?? "",
        id: response?.id ?? "",
        product_id: response?.product_id ?? "",
        specification: response?.specification ?? {
          attribute_groups: [],
          is_refer_document: true,
        },
        updated_at: response?.updated_at ?? "",
        user_id: response?.user_id ?? "",
      } as UserProductSpecificationAttributes;
    }

    if (!response) {
      return toolkit.response({ data: null }).code(201);
    }

    return toolkit.response({ data: response }).code(200);
  };
}
