import { COMMON_TYPES, DESIGN_STORE, MESSAGES } from "@/constants";
import { pagination } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { designerRepository } from "@/repositories/designer.repository";
import { uploadLogoOfficeProfile } from "@/service/image.service";
import { DesignerAttributes, SummaryInfo } from "@/types";
import { sumBy } from "lodash";
import { v4 } from "uuid";
import { settingService } from "../setting/setting.service";

class DesignerService {
  public async getList(
    limit: number,
    offset: number,
    filter: any,
    sort: string,
    order: "ASC" | "DESC"
  ) {
    const dataDesigners = await designerRepository.getListDesignerCustom(
      limit,
      offset,
      sort,
      order
    );

    const totalDesigner = await designerRepository.getModel().count();

    return successResponse({
      data: {
        designers: dataDesigners,
        pagination: pagination(limit, offset, totalDesigner),
      },
    });
  }

  public async getOne(id: string) {
    const designer = await designerRepository.getOne(id);

    if (!designer) {
      return errorMessageResponse(MESSAGES.DESIGNER.DESIGN_NOT_FOUND);
    }

    return successResponse({
      data: designer,
    });
  }

  public async getAllDesignSummary() {
    const designFirmSummary = await designerRepository.getOverallSummary();
    const results: SummaryInfo[] = [
      {
        id: v4(),
        quantity: designFirmSummary.designFirm.total,
        label: "DESIGN FIRMS",
        subs: [
          {
            id: v4(),
            quantity: designFirmSummary.designFirm.totalLocation,
            label: "Locations",
          },
          {
            id: v4(),
            quantity: designFirmSummary.designFirm.totalUser,
            label: "Designers",
          },
        ],
      },
      {
        id: v4(),
        quantity: sumBy(designFirmSummary.countries.summary, "count"),
        label: "COUNTRIES",
        subs: designFirmSummary.countries.regions.map((region) => ({
          id: v4(),
          quantity:
            designFirmSummary.countries.summary.find(
              (el) => el.region === region
            )?.count || 0,
          label: region,
        })),
      },
      {
        id: v4(),
        quantity: designFirmSummary.project.total,
        label: "PROJECTS",
        subs: [
          {
            id: v4(),
            quantity: designFirmSummary.project.live,
            label: "Live",
          },
          {
            id: v4(),
            quantity: designFirmSummary.project.onHold,
            label: "On Hold",
          },
          {
            id: v4(),
            quantity: designFirmSummary.project.archived,
            label: "Archived",
          },
        ],
      },
    ];

    return successResponse({ data: results });
  }

  public async updateDesign(
    designId: string,
    payload: Partial<DesignerAttributes>,
    userRealtionId: string
  ) {
    if (designId !== userRealtionId) {
      return errorMessageResponse(MESSAGES.GENERAL.JUST_OWNER_CAN_UPDATE);
    }

    const designer = await designerRepository.find(designId);

    if (!designer) {
      return errorMessageResponse(MESSAGES.DESIGNER.DESIGN_NOT_FOUND);
    }

    if (payload.status) {
      await designerRepository.update(designId, {
        status: payload.status,
      });

      return successMessageResponse(MESSAGES.SUCCESS);
    } else {
      let logoPath = await uploadLogoOfficeProfile(
        payload.logo || `/${DESIGN_STORE}`,
        designer.logo || `/${DESIGN_STORE}`
      );

      if (typeof logoPath == "object") {
        return errorMessageResponse(logoPath.message);
      }

      payload.capabilities = await settingService.findOrCreateList(
        payload.capabilities || [],
        designer.id,
        COMMON_TYPES.CAPABILITIES
      );

      return successResponse({
        data: await designerRepository.update(designId, {
          ...payload,
          logo: `/${logoPath}`,
        }),
      });
    }
  }
}

export const designerService = new DesignerService();
export default DesignerService;
