import { DOCUMENTATION_TYPES, MESSAGES } from "@/constants";
import { getTimestamps } from "@/Database/Utils/Time";
import { pagination } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { documentationRepository } from "@/repositories/documentation.repository";
import { userRepository } from "@/repositories/user.repository";
import { mappingGroupGeneralDocumentation } from "./documentation.mapping";
import { IDocumentationRequest, IHowto } from "./documentation.type";

class DocumentationService {
  public async create(payload: IDocumentationRequest, userId: string) {
    const user = await userRepository.find(userId);

    if (!user) {
      return errorMessageResponse(MESSAGES.USER_NOT_FOUND, 404);
    }

    const createdDocumentation = await documentationRepository.create({
      title: payload.title,
      document: payload.document,
      created_by: userId,
      updated_at: getTimestamps(),
      type: DOCUMENTATION_TYPES.GENERAL,
    });

    if (!createdDocumentation) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    return successResponse({
      data: createdDocumentation,
    });
  }

  public async getList(limit: number, offset: number, sort: any) {
    const generalDocumentations =
      await documentationRepository.getDocumentationsByType(
        DOCUMENTATION_TYPES.GENERAL,
        limit,
        offset,
        sort
      );

    const totalDocumentation =
      await documentationRepository.countDocumentationByType(
        DOCUMENTATION_TYPES.GENERAL
      );

    return successResponse({
      data: {
        documentations: generalDocumentations,
        pagination: pagination(limit, offset, totalDocumentation),
      },
    });
  }

  public async getAllHowto() {
    return successResponse({
      data: {
        tisc: await documentationRepository.getHowtosByType(
          DOCUMENTATION_TYPES.TISC_HOW_TO,
          ["id", "title", "logo", "document", "created_at"],
          "number",
          "ASC"
        ),

        brand: await documentationRepository.getHowtosByType(
          DOCUMENTATION_TYPES.BRAND_HOW_TO,
          ["id", "title", "logo", "document", "created_at"],
          "number",
          "ASC"
        ),

        design: await documentationRepository.getHowtosByType(
          DOCUMENTATION_TYPES.DESIGN_HOW_TO,
          ["id", "title", "logo", "document", "created_at"],
          "number",
          "ASC"
        ),
      },
    });
  }

  public async getHowto(userId: string) {
    const user = await userRepository.find(userId);

    if (!user) {
      return successResponse({
        data: [],
      });
    }

    return successResponse({
      data: await documentationRepository.getHowtosByType(
        user.type + 1,
        ["id", "title", "logo", "document", "created_at"],
        "number",
        "ASC"
      ),
    });
  }

  public async getById(id: string) {
    const documentation = await documentationRepository.find(id);

    if (!documentation) {
      return errorMessageResponse(MESSAGES.NOT_FOUND_DOCUMENTATION, 404);
    }

    return successResponse({
      data: documentation,
    });
  }

  public async update(
    id: string,
    payload: IDocumentationRequest,
    userId: string
  ) {
    const documentation = await documentationRepository.find(id);

    if (!documentation) {
      return errorMessageResponse(MESSAGES.NOT_FOUND_DOCUMENTATION, 404);
    }

    const updatedDocumentation = await documentationRepository.update(id, {
      ...payload,
      created_by: userId,
      updated_at: getTimestamps(),
    });

    if (!updatedDocumentation) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_UPDATE);
    }

    return successResponse({
      data: updatedDocumentation,
    });
  }

  public async updateHowto(payload: { data: IHowto[] }) {
    for (const howto of payload.data) {
      await documentationRepository.update(howto.id, {
        title: howto.title,
        document: howto.document,
      });
    }

    const firstHowto = await documentationRepository.find(payload.data[0]?.id);
    if (!firstHowto) {
      return successResponse({
        data: [],
      });
    }

    const howtos = await documentationRepository.getHowtosByType(
      firstHowto.type as number,
      ["id", "title", "document", "created_at"],
      "created_at",
      "DESC"
    );

    return successResponse({
      data: howtos,
    });
  }

  public async delete(id: string) {
    const documentation = await documentationRepository.find(id);

    if (!documentation) {
      return errorMessageResponse(MESSAGES.NOT_FOUND_DOCUMENTATION, 404);
    }

    if (documentation.type !== DOCUMENTATION_TYPES.GENERAL) {
      return errorMessageResponse(
        MESSAGES.DOCUMENTATION.CAN_NOT_DELETE_DOCUMENTATION
      );
    }

    const deletedDocumentation = await documentationRepository.delete(id);

    if (!deletedDocumentation) {
      return errorMessageResponse(MESSAGES.GENERAL.SOMETHING_WRONG_DELETE);
    }

    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  }

  public async getListPolicyForLandingPage() {
    const documentations = await documentationRepository.getAllBy({
      type: DOCUMENTATION_TYPES.GENERAL,
    });

    return successResponse({
      data: mappingGroupGeneralDocumentation(documentations),
    });
  }
}

export const documentationService = new DocumentationService();

export default DocumentationService;
