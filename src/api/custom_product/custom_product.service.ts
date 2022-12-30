import {
  COMMON_TYPES,
  DefaultLogo,
  DefaultProductImage,
  ImageSize,
  MESSAGES,
  VALID_IMAGE_TYPES,
} from "@/constants";
import { getFileTypeFromBase64, randomName } from "@/helper/common.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import collectionRepository from "@/repositories/collection.repository";
import { locationRepository } from "@/repositories/location.repository";
import {
  splitImageByType,
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
import { isEqual } from "lodash";
import { v4 } from "uuid";
import { ShareProductBodyRequest } from "../product/product.type";
import { customProductRepository } from "./custom_product.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { mailService } from "@/service/mail.service";
import { getCustomProductSharedUrl } from "@/helper/product.helper";
import { getFileURI, toWebp } from "@/helper/image.helper";
import { projectProductRepository } from "../project_product/project_product.repository";

class CustomProductService {
  private mappingProductOptions = async (
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
      const optId = opt.id || v4();
      if (!opt.use_image) {
        return {
          ...opt,
          id: optId,
          items: opt.items.map((el) => ({
            ...el,
            id: el.id || v4(),
          })),
        };
      }

      const mappingItemPromises = opt.items.map(async (item) => {
        const itemId = item.id || v4();
        if (!item.image || item.image.includes("/custom-product/option")) {
          return { ...item, id: itemId };
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
          buffer: await toWebp(
            Buffer.from(item.image, "base64"),
            ImageSize.small
          ),
          path,
          mime_type: "image/webp",
        });
        return { ...item, id: itemId, image: path };
      });

      const items = await Promise.all(mappingItemPromises);
      return { ...opt, id: optId, items };
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

    const { isValidImage, mappingOptions, validUploadImages } =
      await this.mappingProductOptions(user.relation_id, payload.options);

    if (!isValidImage) {
      return errorMessageResponse("An option omage is invalid");
    }
    await uploadImage(validUploadImages);

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

    const brand = await locationRepository.getOneWithLocation<
      Omit<CustomResouceAttributes, "type">
    >("custom_resources", payload.company_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
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

    // Check changing collection exist
    if (product.collection_id !== payload.collection_id) {
      const collection = await collectionRepository.findBy({
        id: payload.collection_id,
        relation_id: payload.company_id,
        relation_type: CollectionRelationType.CustomProduct,
      });
      if (!collection) {
        return errorMessageResponse(MESSAGES.COLLECTION_NOT_FOUND);
      }
    }

    let images = product.images;
    // Upload images if have changes
    if (isEqual(product.images, payload.images) === false) {
      const { imageBase64, imagePath } = await splitImageByType(payload.images);
      if (imageBase64.length && !(await validateImageType(imageBase64))) {
        return errorMessageResponse(MESSAGES.IMAGE_INVALID);
      }
      const newImages = imageBase64.length
        ? await uploadImagesProduct(
            imageBase64,
            [],
            brand.business_name,
            brand.id
          )
        : [];
      images = imagePath.concat(newImages);
    }

    let options = product.options;
    if (isEqual(product.options, payload.options) === false) {
      const { isValidImage, mappingOptions, validUploadImages } =
        await this.mappingProductOptions(user.relation_id, payload.options);

      options = mappingOptions;
      if (!isValidImage) {
        return errorMessageResponse("An option image is invalid");
      }
      const uploadOptionImages = await uploadImage(validUploadImages);
      console.log("uploadOptionImages", uploadOptionImages);
    }

    const result = await customProductRepository.update(id, {
      ...payload,
      images,
      options,
    });

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
    const projectProduct = await projectProductRepository.findBy({
      product_id: product.id,
    });

    if (projectProduct) {
      return errorMessageResponse(MESSAGES.PRODUCT.WAS_USED_IN_PROJECT);
    }
    //
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
    if (user.type !== UserType.Designer) {
      return errorMessageResponse(MESSAGES.JUST_SHARE_IN_DESIGN_FIRM);
    }
    const sharedUrl = getCustomProductSharedUrl(user, {
      id: product.id,
    });

    const sent = await mailService.sendShareProductViaEmail(
      payload.to_email,
      user.email,
      payload.title,
      payload.message,
      getFileURI(product.images[0] || DefaultProductImage),
      product.design.name,
      getFileURI(product.design.logo || DefaultLogo),
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
