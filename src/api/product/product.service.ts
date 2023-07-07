import {
  BASIS_TYPES,
  COMMON_TYPES,
  MESSAGES,
  DefaultLogo,
  DefaultProductImage,
} from "@/constants";
import { getProductSharedUrl } from "@/helpers/product.helper";
import { getFileURI } from "@/helpers/image.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helpers/response.helper";
import AttributeRepository from "@/repositories/attribute.repository";
import BasisRepository from "@/repositories/basis.repository";
import { brandRepository } from "@/repositories/brand.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { productRepository } from "@/repositories/product.repository";
import { productFavouriteRepository } from "@/repositories/product_favourite.repository";
import { projectProductRepository } from "@/api/project_product/project_product.repository";
import { countryStateCityService } from "@/services/country_state_city.service";
import { userRepository } from "@/repositories/user.repository";
import {
  splitImageByType,
  uploadImagesProduct,
  updateProductImageNames,
  validateImageType,
} from "@/services/image.service";
import { mailService } from "@/services/mail.service";
import { isEqual, sortBy } from "lodash";
import {
  getTotalVariantOfProducts,
  getUniqueBrands,
  getUniqueCollections,
  getUniqueProductCategories,
  mappingAttribute,
  mappingAttributeGroups,
  mappingAttributeOrBasis,
  mappingByBrand,
  mappingByCategory,
  mappingByCollections,
  mappingProductID,
} from "./product.mapping";
import {
  IProductOptionAttribute,
  IProductRequest,
  IUpdateProductRequest,
  ShareProductBodyRequest,
} from "./product.type";
import { SortOrder, UserAttributes, BasisConversion } from "@/types";
import { mappingDimensionAndWeight } from "@/api/attribute/attribute.mapping";
import { sortObjectArray, pagination } from "@/helpers/common.helper";
import { colorDetectionQueue } from "@/queues/color_detection.queue";
import { categoryRepository } from "@/repositories/category.repository";

class ProductService {
  private getAllBasisConversion = async () => {
    const allBasisConversion = await BasisRepository.getAllBy({
      type: BASIS_TYPES.CONVERSION,
    });
    return allBasisConversion.reduce((pre, cur) => {
      return pre.concat(cur.subs);
    }, []);
  };
  public checkSupportedColorDetection = async (categoryIds: string[]) => {
    const categories: any = await categoryRepository.getManyConcatName(
      categoryIds
    );
    if (!categories) {
      return false;
    }
    const found = categories.find(
      (item: string) =>
        item.toLowerCase().search("stone") !== -1 ||
        item.toLowerCase().search("wood") !== -1
    );
    if (found) {
      return true;
    }
    return false;
  };
  private addQueueToDetectColor = async (
    categoryIds: string[],
    productId: string,
    images: string[]
  ) => {
    const isSupportedColorDetection = await this.checkSupportedColorDetection(
      categoryIds
    );
    if (isSupportedColorDetection) {
      colorDetectionQueue.add({
        product_id: productId,
        images,
      });
    }
  };
  public async create(user: UserAttributes, payload: IProductRequest) {
    const product = await productRepository.findBy({
      name: payload.name,
      brand_id: payload.brand_id,
    });
    if (product) {
      return errorMessageResponse(MESSAGES.PRODUCT_EXISTED);
    }

    const allConversion: BasisConversion[] = await this.getAllBasisConversion();

    const saveGeneralAttributeGroups = await Promise.all(
      payload.general_attribute_groups.map((generalAttributeGroup) =>
        mappingAttribute(generalAttributeGroup, allConversion)
      )
    );
    const saveFeatureAttributeGroups = await Promise.all(
      payload.feature_attribute_groups.map((featureAttributeGroup) =>
        mappingAttribute(featureAttributeGroup, allConversion)
      )
    );
    const saveSpecificationAttributeGroups = await Promise.all(
      payload.specification_attribute_groups.map(
        (specificationAttributeGroup) =>
          mappingAttribute(specificationAttributeGroup, allConversion)
      )
    );

    if (!(await validateImageType(payload.images))) {
      return errorMessageResponse(MESSAGES.IMAGE_INVALID);
    }

    const brand = await brandRepository.find(payload.brand_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const uploadedImages = await uploadImagesProduct(
      payload.images,
      payload.keywords,
      brand.name,
      brand.id
    );

    const createdProduct = await productRepository.create({
      brand_id: payload.brand_id,
      collection_ids: payload.collection_ids,
      category_ids: payload.category_ids,
      name: payload.name,
      code: "random",
      description: payload.description,
      general_attribute_groups: saveGeneralAttributeGroups,
      feature_attribute_groups: saveFeatureAttributeGroups,
      specification_attribute_groups: saveSpecificationAttributeGroups,
      created_by: user.id,
      images: uploadedImages,
      keywords: payload.keywords,
      tips: payload.tips,
      downloads: payload.downloads,
      catelogue_downloads: payload.catelogue_downloads,
      dimension_and_weight: payload.dimension_and_weight,
    });
    if (!createdProduct) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    // Detect color if product has supported category
    this.addQueueToDetectColor(
      payload.category_ids,
      createdProduct.id,
      uploadedImages
    );
    return this.get(createdProduct.id, user);
  }

  public async duplicate(id: string, user: UserAttributes) {
    const product = await productRepository.find(id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const created = await productRepository.create({
      ...product,
      name: product.name + " - copy",
    });
    if (!created) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return successResponse(await this.get(created.id, user));
  }

  public async update(
    id: string,
    payload: IUpdateProductRequest,
    user: UserAttributes
  ) {
    const product = await productRepository.findWithRelationData(id, user.id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const duplicatedProduct = await productRepository.getDuplicatedProduct(
      id,
      payload.name,
      product.brand_id
    );
    if (duplicatedProduct) {
      return errorMessageResponse(MESSAGES.PRODUCT_DUPLICATED);
    }

    const brand = await brandRepository.find(payload.brand_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const allConversion: BasisConversion[] = await this.getAllBasisConversion();

    const saveGeneralAttributeGroups = await Promise.all(
      payload.general_attribute_groups.map((generalAttributeGroup) =>
        mappingAttribute(generalAttributeGroup, allConversion)
      )
    );
    const saveFeatureAttributeGroups = await Promise.all(
      payload.feature_attribute_groups.map((featureAttributeGroup) =>
        mappingAttribute(featureAttributeGroup, allConversion)
      )
    );
    const saveSpecificationAttributeGroups = await Promise.all(
      payload.specification_attribute_groups.map(
        (specificationAttributeGroup) =>
          mappingAttribute(specificationAttributeGroup, allConversion)
      )
    );

    let images = product.images;
    // Upload images if have changes
    if (isEqual(product.images, payload.images) === false) {
      const { imageBase64 } = await splitImageByType(payload.images);
      if (imageBase64.length && !(await validateImageType(imageBase64))) {
        return errorMessageResponse(MESSAGES.IMAGE_INVALID);
      }
      const newImages = await uploadImagesProduct(
        payload.images,
        payload.keywords,
        brand.name,
        brand.id
      );

      images = newImages;
      // Detect color if product has supported category
      this.addQueueToDetectColor(payload.category_ids, product.id, images);
    }
    if (!isEqual(payload.keywords, product.keywords)) {
      images = await updateProductImageNames(
        images,
        payload.keywords,
        brand.name,
        brand.id
      );
    }
    const updatedProduct = await productRepository.update(id, {
      ...payload,
      general_attribute_groups: saveGeneralAttributeGroups,
      feature_attribute_groups: saveFeatureAttributeGroups,
      specification_attribute_groups: saveSpecificationAttributeGroups,
      images,
    });
    if (!updatedProduct) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return this.get(id, user);
  }

  public async get(id: string, user: UserAttributes) {
    const product = await productRepository.findWithRelationData(id, user.id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const countryIds = product.brand.official_websites.map(
      (ow) => ow.country_id
    );
    const countries = await countryStateCityService.getCountries(countryIds);
    const officialWebsites = product.brand.official_websites.map(
      (officialWebsite) => {
        let countryName = "Global";
        if (countries) {
          const country = countries.find(
            (c) => c.id === officialWebsite.country_id
          );
          if (country) {
            countryName = country.name;
          }
        }
        return {
          ...officialWebsite,
          country_name: countryName,
        };
      }
    );
    //
    const attributeGroups = await AttributeRepository.getAll();
    const flatAttributeGroups = mappingAttributeOrBasis(attributeGroups);
    //
    const basisGroups = await BasisRepository.getAll();
    const flatBasisGroups = mappingAttributeOrBasis(basisGroups);
    //
    const newSpecificationGroups = mappingAttributeGroups(
      product.specification_attribute_groups,
      flatAttributeGroups,
      flatBasisGroups,
      flatBasisGroups
    );

    const productID = mappingProductID(newSpecificationGroups);
    const newGeneralGroups = mappingAttributeGroups(
      product.general_attribute_groups,
      flatAttributeGroups,
      flatBasisGroups,
      flatBasisGroups
    );

    const newFeatureGroups = mappingAttributeGroups(
      product.feature_attribute_groups,
      flatAttributeGroups,
      flatBasisGroups,
      flatBasisGroups
    );

    return successResponse({
      data: {
        ...product,
        code: productID,
        brand: {
          ...product.brand,
          official_websites: officialWebsites,
        },
        general_attribute_groups: newGeneralGroups,
        feature_attribute_groups: newFeatureGroups,
        specification_attribute_groups: newSpecificationGroups,
        dimension_and_weight: mappingDimensionAndWeight(
          product.dimension_and_weight
        ),
      },
    });
  }

  public getBrandProductSummary = async (brandId: string) => {
    const products = await productRepository.getProductBy(undefined, brandId);
    const collections = sortObjectArray(
      getUniqueCollections(products),
      "name",
      "ASC"
    );
    const categories = sortObjectArray(
      getUniqueProductCategories(products),
      "name",
      "ASC"
    );
    const variants = getTotalVariantOfProducts(products);
    return successResponse({
      data: {
        categories,
        collections,
        category_count: categories.length,
        collection_count: collections.length,
        card_count: products.length,
        product_count: variants.length,
      },
    });
  };
  public getList = async (
    user: UserAttributes,
    brandId: string,
    categoryId?: string,
    collectionId?: string,
    keyword?: string,
    sortName?: string,
    orderBy?: "ASC" | "DESC"
  ) => {
    let products = await productRepository.getProductBy(
      user.id,
      brandId,
      categoryId === "all" ? undefined : categoryId,
      collectionId === "all" ? undefined : collectionId,
      keyword,
      sortName,
      orderBy
    );
    let returnedProducts;
    if (categoryId) {
      if (categoryId !== "all") {
        products = products.map((product) => {
          return {
            ...product,
            category_ids: [categoryId],
            categories: product.categories.filter(
              (category) => category.id === categoryId
            ),
          };
        });
      }
      returnedProducts = mappingByCategory(products);
    } else if (collectionId) {
      returnedProducts = mappingByCollections(products, collectionId === "all" ? undefined : collectionId);
    } else {
      returnedProducts = mappingByBrand(products);
    }
    return successResponse({
      data: {
        data: sortObjectArray(returnedProducts, "name", "ASC"),
        brand: await brandRepository.find(brandId),
      },
    });
  };

  public getListDesignerBrandProducts = async (
    user: UserAttributes,
    brandId?: string,
    categoryId?: string,
    keyword?: string,
    sortName?: string,
    orderBy?: "ASC" | "DESC",
    limit?: number,
    offset?: number
  ) => {
    const products = await productRepository.getProductBy(
      user.id,
      brandId,
      categoryId,
      undefined,
      keyword,
      sortName,
      orderBy,
      false,
      limit,
      offset
    );
    if (brandId) {
      const variants = getTotalVariantOfProducts(products);
      const brand = await brandRepository.find(brandId);
      const collections = getUniqueCollections(products);
      return successResponse({
        data: sortBy(mappingByCollections(products), "name"),
        brand_summary: {
          brand_name: brand?.name ?? "",
          brand_logo: brand?.logo ?? "",
          collection_count: collections.length,
          card_count: products.length,
          product_count: variants.length,
        },
      });
    }

    if (categoryId) {
      return successResponse({
        data: sortBy(mappingByBrand(products), "name"),
      });
    }
    const total = await productRepository.countProductBy(
      user.id,
      brandId,
      categoryId,
      undefined,
      keyword,
      sortName,
      orderBy,
      false
    );
    return successResponse({
      allProducts: products,
      pagination: pagination(limit || 0, offset || 0, total[0]),
    });
  };

  public delete = async (productId: string) => {
    const product = await productRepository.find(productId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const projectProduct = await projectProductRepository.findBy({
      product_id: product.id,
    });

    if (projectProduct) {
      return errorMessageResponse(MESSAGES.PRODUCT.WAS_USED_IN_PROJECT);
    }
    //
    const isDeleted = await productRepository.delete(product.id);
    if (isDeleted) {
      return successMessageResponse(MESSAGES.SUCCESS);
    }
    return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
  };

  public getListRestCollectionProduct = async (productId: string) => {
    const product = await productRepository.findWithRelationData(productId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const products = await productRepository.getRelatedCollection(
      product.id,
      product.collection_ids
    );
    return successResponse({
      data: products.map((item) => {
        return {
          id: item.id,
          collection_ids: item.collection_ids,
          name: item.name,
          images: item.images,
          created_at: item.created_at,
        };
      }),
    });
  };

  public likeOrUnlike = async (productId: string, user: UserAttributes) => {
    const favourite = await productFavouriteRepository.findBy({
      product_id: productId,
      created_by: user.id,
    });
    if (!favourite) {
      await productFavouriteRepository.like(productId, user.id);
    } else {
      await productFavouriteRepository.unlike(productId, user.id);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  /* Getting the product options for a product. */
  public getProductOptions = async (productId: string, attributeId: string) => {
    const product = await productRepository.find(productId);
    if (!product) {
      return successResponse({ data: [] });
    }
    let attributes: IProductOptionAttribute[] = [];
    product.specification_attribute_groups.forEach((item) => {
      attributes = attributes.concat(item.attributes);
    });
    const attribute = attributes.find((item) => item.id === attributeId);
    if (!attribute) {
      return successResponse({ data: [] });
    }
    //
    const optionGroups = await BasisRepository.getAllBy({
      type: BASIS_TYPES.OPTION,
    });

    //
    const options = optionGroups.reduce((pre: any, cur: any) => {
      return pre.concat(cur.subs);
    }, []);

    const optionValues = options.reduce((pre: any, cur: any) => {
      return pre.concat(cur.subs);
    }, []);
    const result = attribute.basis_options?.reduce((final, item) => {
      const foundValue = optionValues.find((el: any) => el.id === item.id);
      if (foundValue) {
        final.push({
          id: item.id,
          option_code: item.option_code,
          name: foundValue.value_1 + " - " + foundValue.value_2,
          value_1: foundValue.value_1,
          value_2: foundValue.value_2,
          image: foundValue.image,
        });
      }
      return final;
    }, [] as any);
    return successResponse({ data: result ?? [] });
  };

  public getFavoriteProductSummary = async (user: UserAttributes) => {
    const products = await productRepository.getFavouriteProducts(user.id);
    const categories = sortObjectArray(
      getUniqueProductCategories(products),
      "name",
      "ASC"
    );
    const brands = sortObjectArray(getUniqueBrands(products), "name", "ASC");
    return successResponse({
      data: {
        categories,
        brands,
        category_count: categories.length,
        brand_count: brands.length,
        card_count: products.length,
      },
    });
  };

  public getFavouriteList = async (
    user: UserAttributes,
    brandId?: string,
    categoryId?: string,
    order?: SortOrder
  ) => {
    const products = await productRepository.getFavouriteProducts(
      user.id,
      brandId,
      categoryId,
      order
    );
    const mappingFunction = categoryId ? mappingByCategory : mappingByBrand;
    return successResponse({
      data: sortBy(mappingFunction(products), "name"),
    });
  };

  public shareByEmail = async (
    payload: ShareProductBodyRequest,
    user: UserAttributes
  ) => {
    const product = await productRepository.findWithRelationData(
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
    const sharedUrl = getProductSharedUrl(user, receiver, product);
    const sent = await mailService.sendShareProductViaEmail(
      payload.to_email,
      user.email,
      payload.title,
      payload.message,
      getFileURI(product.images[0] || DefaultProductImage),
      product.brand.name,
      getFileURI(product.brand.logo || DefaultLogo),
      product.collections.map((item) => item.name).join(", ") || "N/A",
      product.name || "N/A",
      `${user.firstname || ""} ${user.lastname || ""}`,
      sharedUrl
    );
    if (!sent) {
      return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
    }
    return successMessageResponse(MESSAGES.EMAIL_SENT);
  };
}

export const productService = new ProductService();

export default ProductService;
