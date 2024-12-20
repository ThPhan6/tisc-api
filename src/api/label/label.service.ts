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
    let paramsToFind: any = { name: payload.name, brand_id: payload.brand_id };
    const parent_id = payload.parent_id ?? null;
    paramsToFind = {
      ...paramsToFind,
      parent_id: parent_id,
    };

    const label = await labelRepository.findBy(paramsToFind);
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
    const sortedLabels = labels.sort((a, b) => a.name.localeCompare(b.name));
    return successResponse({
      data: toNestLabels(sortedLabels),
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
    if (!label.parent_id) {
      await labelRepository.deleteBy({ parent_id: id });
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  }

  public async moveSubLabelToLabel(
    main_label_id: string,
    sub_label_id: string
  ) {
    const subLabel = await labelRepository.find(sub_label_id);

    if (!subLabel) return errorMessageResponse(MESSAGES.SUB_LABEL_NOTFOUND);

    if (subLabel.parent_id === main_label_id)
      return errorMessageResponse(MESSAGES.CANNOT_MOVE_TO_PARENT);

    const targetLabel = await labelRepository.find(main_label_id);
    if (!targetLabel) return errorMessageResponse(MESSAGES.LABEL_NOTFOUND);

    await labelRepository.update(sub_label_id, { parent_id: main_label_id });

    return successMessageResponse(MESSAGES.SUCCESS);
  }
}

export default new LabelService();
