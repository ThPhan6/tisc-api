import { COMMON_TYPES, MESSAGES, VALID_IMAGE_TYPES } from "@/constants";
import { getFileTypeFromBase64, randomName } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import collectionRepository from "@/repositories/collection.repository";
import { locationRepository } from "@/repositories/location.repository";
import {
  uploadImage,
  uploadImagesProduct,
  validateImageType,
} from "@/service/image.service";
import {
  UserAttributes,
  UserType,
  CustomResouceAttributes,
  CustomProductPayload,
  CollectionRelationType,
} from "@/types";
import { v4 } from "uuid";
import { ShareProductBodyRequest } from "../product/product.type";
import { customProductRepository } from "./custom_product.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { userRepository } from "@/repositories/user.repository";
import { mailService } from "@/service/mail.service";
import {
  getCustomProductSharedUrl,
} from "@/helper/product.helper";
import { getFileURI } from "@/helper/image.helper";

class CustomProductService {
  private mappingCreatingOptions = async (
    designId: string,
    options: CustomProductPayload["options"]
  ) => {
    let isValidImage = true;
    const validUploadImages: {
      buffer: Buffer;
      path: string;
      mime_type: string;
    }[] = [];

    const mappingOptionPromises = options.map(async (opt) => {
      if (!opt.use_image) {
        return { ...opt, id: v4() };
      }

      const mappingItemPromises = opt.items.map(async (item) => {
        if (!item.image) {
          return { ...item, id: v4() };
        }

        const fileType = await getFileTypeFromBase64(item.image);
        if (
          !fileType ||
          !VALID_IMAGE_TYPES.find((validType) => validType === fileType.mime)
        ) {
          isValidImage = false;
        }

        const path = `/custom-product/option/${designId}/${randomName(8)}.${
          fileType.ext
        }`;
        validUploadImages.push({
          buffer: Buffer.from(item.image, "base64"),
          path,
          mime_type: fileType.mime,
        });
        return { ...item, id: v4(), image: path };
      });

      const items = await Promise.all(mappingItemPromises);
      return {
        ...opt,
        id: v4(),
        items,
      };
    });
    const mappingOptions = await Promise.all(mappingOptionPromises);

    return {
      isValidImage,
      validUploadImages,
      mappingOptions,
    };
  };

  public createProduct = async (
    user: UserAttributes,
    payload: CustomProductPayload
  ) => {
    if (user.type !== UserType.Designer) {
      return errorMessageResponse(MESSAGES.JUST_DESIGNER_CAN_CREATE);
    }

    const brand = await locationRepository.getOneWithLocation<
      Omit<CustomResouceAttributes, "type">
    >("custom_resources", payload.company_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    // Check product name exist
    const existedResource = await customProductRepository.checkExisted(
      user.relation_id,
      payload.name.trim()
    );
    if (existedResource) {
      return errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_EXISTED);
    }

    const collection = await collectionRepository.findBy({
      id: payload.collection_id,
      relation_id: payload.company_id,
      relation_type: CollectionRelationType.CustomProduct,
    });
    if (!collection) {
      return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND);
    }

    if (!(await validateImageType(payload.images))) {
      return errorMessageResponse(MESSAGES.IMAGE_INVALID);
    }

    const uploadedImages = await uploadImagesProduct(
      payload.images,
      [],
      brand.business_name,
      brand.id
    );
    console.log("uploadedImages", uploadedImages);

    const { isValidImage, mappingOptions, validUploadImages } =
      await this.mappingCreatingOptions(user.relation_id, payload.options);

    if (!isValidImage) {
      return errorMessageResponse("An option omage is invalid");
    }
    const uploadOptionImages = await uploadImage(validUploadImages);
    console.log("uploadOptionImages", uploadOptionImages);

    const createdProduct = await customProductRepository.create({
      ...payload,
      images: uploadedImages,
      options: mappingOptions || [],
      design_id: user.relation_id,
    });

    if (!createdProduct) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return successResponse({ data: createdProduct });
  };

  public updateProduct = async (
    id: string,
    payload: CustomProductPayload,
    user: UserAttributes
  ) => {
    if (user.type !== UserType.Designer) {
      return errorMessageResponse(MESSAGES.JUST_DESIGNER_CAN_UPDATE);
    }

    const product = await customProductRepository.find(id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_NOT_FOUND, 404);
    }

    if (user.relation_id !== product.design_id) {
      return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_PERFORM);
    }

    // Check product name exist
    if (product.name.trim() !== payload.name.trim()) {
      const existedResource = await customProductRepository.checkExisted(
        user.relation_id,
        payload.name.trim(),
        id
      );

      if (existedResource) {
        return errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_EXISTED);
      }
    }

    const result = await customProductRepository.update(id, payload);

    if (!result) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }

    return successResponse({ data: result });
  };

  public deleteProduct = async (id: string, user: UserAttributes) => {
    if (user.type !== UserType.Designer) {
      return errorMessageResponse(MESSAGES.JUST_DESIGNER_CAN_UPDATE);
    }

    const product = await customProductRepository.find(id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT.PRODUCT_NOT_FOUND, 404);
    }

    if (user.relation_id !== product.design_id) {
      return errorMessageResponse(MESSAGES.GENERAL.NOT_AUTHORIZED_TO_PERFORM);
    }

    // Check projects have this product here

    const result = await customProductRepository.delete(id);

    if (!result) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
    }

    return successResponse({ data: result });
  };

  public duplicate = async (id: string, user: UserAttributes) => {
    const product = await customProductRepository.find(id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    if (product.design_id !== user.relation_id) {
      return errorMessageResponse(MESSAGES.JUST_DESIGNER_CAN_CREATE);
    }

    const result = await customProductRepository.create({
      ...product,
      name: product.name + " - copy",
    });
    if (!result) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return successResponse({
      data: result,
    });
  };
  public shareByEmail = async (
    payload: ShareProductBodyRequest,
    user: UserAttributes
  ) => {
    const product = await customProductRepository.findWithRelationData(
      payload.product_id
    );
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND);
    }
    await commonTypeRepository.findOrCreate(
      payload.sharing_group,
      user.relation_id,
      COMMON_TYPES.SHARING_GROUP
    );

    await commonTypeRepository.findOrCreate(
      payload.sharing_purpose,
      user.relation_id,
      COMMON_TYPES.SHARING_PURPOSE
    );
    const receiver = await userRepository.findBy({ email: payload.to_email });
    const sharedUrl = getCustomProductSharedUrl(user, receiver, {
      id: product.id,
    });
    const sent = await mailService.sendShareProductViaEmail(
      payload.to_email,
      user.email,
      payload.title,
      payload.message,
      getFileURI(product.images[0]) ?? "",
      product.design.name,
      getFileURI(product.design.logo) ?? "",
      product.collection.name ?? "N/A",
      product.name ?? "N/A",
      `${user.firstname ?? ""} ${user.lastname ?? ""}`,
      sharedUrl
    );
    if (!sent) {
      return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
    }
    return successMessageResponse(MESSAGES.EMAIL_SENT);
  };
}

export const customProductService = new CustomProductService();
export default CustomProductService;
