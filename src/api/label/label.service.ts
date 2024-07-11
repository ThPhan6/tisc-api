import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import labelRepository from "@/repositories/label.repository";
import { toNestLabels } from "./label.mapping";
import { ILabelRequest, UpdateLabelRequest } from "./label.type";

class LabelService {
  public async create(payload: ILabelRequest) {
    const label = await labelRepository.findBy({ name: payload.name });
    if (label) {
      return errorMessageResponse(MESSAGES.LABEL_EXISTED);
    }
    const createdLabel = await labelRepository.create({
      name: payload.name,
      brand_id: payload.brand_id,
      parent_id: payload.parent_id,
    });
    return successResponse({ data: createdLabel });
  }

  public async getList(brand_id: string) {
    const labels = await labelRepository.getAllBy({ brand_id });
    return successResponse({
      data: toNestLabels(labels),
    });
  }

  public async update(id: string, payload: UpdateLabelRequest) {
    const label = await labelRepository.find(id);
    if (!label) {
      return errorMessageResponse(MESSAGES.LABEL_NOTFOUND);
    }
    await labelRepository.update(id, { name: payload.name });
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async delete(id: string) {
    const label = await labelRepository.find(id);
    if (!label) {
      return errorMessageResponse(MESSAGES.LABEL_NOTFOUND);
    }
    if (label.parent_id) {
      await labelRepository.delete(id);
    } else {
      await labelRepository.deleteBy({ parent_id: id });
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export default new LabelService();
