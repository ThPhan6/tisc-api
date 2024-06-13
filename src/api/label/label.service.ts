import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import labelRepository from "@/repositories/label.repository";
import { ILabelRequest, UpdateLabelRequest } from "./label.type";

class LabelService {
  public async create(payload: ILabelRequest) {
    const label = await labelRepository.findBy({ name: payload.name });
    if (label) {
      return errorMessageResponse(MESSAGES.LABEL_EXISTED);
    }
    const createdLabel = await labelRepository.create({
      name: payload.name,
    });
    return successResponse({ data: createdLabel });
  }

  public async getList() {
    const labels = await labelRepository.getAll();
    return successResponse({
      data: labels,
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
    await labelRepository.delete(id);
    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export default new LabelService();
