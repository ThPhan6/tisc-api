import { MESSAGES } from "@/constants";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import { locationRepository } from "@/repositories/location.repository";
import {
  CustomResourcePayload,
  UserAttributes,
  UserType,
  CustomResouceAttribute,
  CustomResouceType,
} from "@/types";
import { isEqual, pick } from "lodash";
import { locationService } from "../location/location.service";
import { customResourceRepository } from "./custom_resources.repository";

class CustomProductService {
  public getListProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
  public createProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
  public updateProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };
  public deleteProduct = (_user: UserAttributes, _payload: any) => {
    return successMessageResponse(MESSAGES.GENERAL.SUCCESS);
  };

  public createResource = async (
    user: UserAttributes,
    payload: CustomResourcePayload
  ) => {
    if (user.type !== UserType.Designer) {
      return errorMessageResponse(MESSAGES.JUST_DESIGNER_CAN_CREATE);
    }

    // Check bussiness name exist
    const existedResource = await customResourceRepository.checkResourceExisted(
      payload.type,
      payload.business_name
    );

    if (existedResource) {
      return errorMessageResponse(MESSAGES.customResource.existed);
    }

    const { error, location } = await locationService.upsertLocation({
      business_name: payload.business_name,
      city_id: payload.city_id,
      state_id: payload.state_id,
      country_id: payload.country_id,
      address: payload.address,
      postal_code: payload.postal_code,
      general_phone: payload.general_phone,
      general_email: payload.general_email,
    });

    if (error) {
      return error;
    }

    const result = await customResourceRepository.create({
      type: payload.type,
      website_uri: payload.website_uri,
      associate_resource_ids: payload.associate_resource_ids,
      contacts: payload.contacts,
      location_id: location.id,
      design_id: user.relation_id,
    });

    if (!result) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    await customResourceRepository.updateAssociateResources(
      result.id,
      payload.type,
      payload.associate_resource_ids
    );

    return successResponse({ data: result });
  };

  public updateResource = async (
    id: string,
    user: UserAttributes,
    payload: CustomResourcePayload
  ) => {
    if (user.type !== UserType.Designer) {
      return errorMessageResponse(MESSAGES.JUST_DESIGNER_CAN_CREATE);
    }

    const customResource = await locationRepository.getOneWithLocation<
      Omit<CustomResouceAttribute, "type">
    >("custom_resources", id);

    if (!customResource) {
      return errorMessageResponse(MESSAGES.customResource.notFound, 404);
    }

    // Check bussiness name exist
    if (customResource.business_name !== payload.business_name) {
      const existedResource =
        await customResourceRepository.checkResourceExisted(
          payload.type,
          payload.business_name
        );

      if (existedResource) {
        return errorMessageResponse(MESSAGES.customResource.existed);
      }
    }

    const locationFields = [
      "country_id",
      "state_id",
      "city_id",
      "business_name",
      "address",
      "postal_code",
      "general_phone",
      "general_email",
    ];
    const locationHaveUpdated =
      isEqual(
        pick(payload, locationFields),
        pick(customResource, locationFields)
      ) === false;

    const {
      country_id,
      city_id,
      state_id,
      business_name,
      address,
      postal_code,
      general_phone,
      general_email,
      ...customPayload
    } = payload;

    if (locationHaveUpdated) {
      const { error } = await locationService.upsertLocation(
        {
          business_name,
          city_id,
          state_id,
          country_id,
          address,
          postal_code,
          general_phone,
          general_email,
        },
        customResource.location_id
      );

      if (error) {
        return error;
      }
    }

    const result = await customResourceRepository.update(id, customPayload);

    if (!result) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    if (
      isEqual(
        payload.associate_resource_ids,
        customResource.associate_resource_ids
      ) === false
    ) {
      const updateResult =
        await customResourceRepository.updateAssociateResources(
          id,
          payload.type,
          payload.associate_resource_ids
        );

      if (!updateResult) {
        // handling more here like delete record location & custom resource
        return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
      }
    }

    return successResponse({ data: result });
  };

  public deleteResource = async (id: string, user: UserAttributes) => {
    const customResource = await customResourceRepository.getOne(id);

    if (!customResource) {
      return errorMessageResponse(MESSAGES.customResource.notFound, 404);
    }

    if (
      user.type === UserType.Designer &&
      user.relation_id !== customResource.design_id
    ) {
      return errorMessageResponse(MESSAGES.JUST_OWNER_CAN_GET);
    }

    if (customResource.type === CustomResouceType.Brand) {
      const brandHaveProduct =
        await customResourceRepository.checkBrandHaveProduct(id);
      if (brandHaveProduct) {
        return errorMessageResponse(MESSAGES.customResource.haveProduct);
      }
    }

    const result = await customResourceRepository.delete(id);

    if (!result) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    const updateAssociateResult =
      await customResourceRepository.updateAssociateResources(
        id,
        customResource.type,
        customResource.associate_resource_ids
      );

    if (!updateAssociateResult) {
      // handling more here like delete record location & custom resource
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    return successResponse({ data: result });
  };
}

export const customProductService = new CustomProductService();
export default CustomProductService;
