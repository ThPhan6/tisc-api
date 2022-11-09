import { BASIS_TYPES, COMMON_TYPES, MESSAGES } from "@/constants";
import { getProductSharedUrl } from "@/helper/product.helper";
import { getFileURI } from "@/helper/image.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import AttributeRepository from "@/repositories/attribute.repository";
import BasisRepository from "@/repositories/basis.repository";
import { brandRepository } from "@/repositories/brand.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import { productRepository } from "@/repositories/product.repository";
import { productFavouriteRepository } from "@/repositories/product_favourite.repository";
import { projectProductRepository } from "@/api/project_product/project_product.repository";
import { countryStateCityService } from "@/service/country_state_city.service";
import { userRepository } from "@/repositories/user.repository";
import {
  uploadImagesProduct,
  validateImageType,
} from "@/service/image.service";
import { mailService } from "@/service/mail.service";
import { difference, sortBy } from "lodash";
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
} from "./product.mapping";
import {
  IProductOptionAttribute,
  IProductRequest,
  IUpdateProductRequest,
  ShareProductBodyRequest,
} from "./product.type";
import {
  AttributeType,
  SortOrder,
  UserAttributes,
  BasisConversion,
} from "@/types";

class ProductService {
  private getAllBasisConversion = async () => {
    const allBasisConversion = await BasisRepository.getAllBy({
      type: BASIS_TYPES.CONVERSION,
    });
    return allBasisConversion.reduce((pre, cur) => {
      return pre.concat(cur.subs);
    }, []);
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
      collection_id: payload.collection_id,
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
    });
    if (!createdProduct) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
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

    const newPaths = difference(payload.images, product.images);
    if (!(await validateImageType(newPaths))) {
      return errorMessageResponse(MESSAGES.IMAGE_INVALID);
    }
    const imagePaths = !newPaths[0]
      ? product.images
      : await uploadImagesProduct(
          newPaths,
          payload.keywords,
          product.brand.name,
          product.brand_id
        );

    const updatedProduct = await productRepository.update(id, {
      ...payload,
      general_attribute_groups: saveGeneralAttributeGroups,
      feature_attribute_groups: saveFeatureAttributeGroups,
      specification_attribute_groups: saveSpecificationAttributeGroups,
      images: imagePaths,
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

    const officialWebsites = await Promise.all(
      product.brand.official_websites.map(async (officialWebsite) => {
        const country = await countryStateCityService.getCountryDetail(
          officialWebsite.country_id
        );
        return {
          ...officialWebsite,
          country_name:
            officialWebsite.country_id === "-1" ? "Global" : country.name,
        };
      })
    );

    const allFeatureAttributeGroup = await AttributeRepository.getByType(
      AttributeType.Feature
    );
    const allFeatureAttribute: any[] = mappingAttributeOrBasis(
      allFeatureAttributeGroup
    );

    const allGeneralAttributeGroup = await AttributeRepository.getByType(
      AttributeType.General
    );
    const allGeneralAttribute: any[] = mappingAttributeOrBasis(
      allGeneralAttributeGroup
    );
    const allSpecificationAttributeGroup = await AttributeRepository.getByType(
      AttributeType.Specification
    );
    const allSpecificationAttribute: any[] = mappingAttributeOrBasis(
      allSpecificationAttributeGroup
    );

    const allBasisOptionGroup = await BasisRepository.getAllBy({
      type: BASIS_TYPES.OPTION,
    });

    const allBasisOptionValue: any[] =
      mappingAttributeOrBasis(allBasisOptionGroup);

    const allBasisConversionGroup = await BasisRepository.getAllBy({
      type: BASIS_TYPES.CONVERSION,
    });
    const allBasisConversion = mappingAttributeOrBasis(allBasisConversionGroup);

    const newSpecificationGroups = await Promise.all(
      mappingAttributeGroups(
        product.specification_attribute_groups,
        allSpecificationAttribute,
        allBasisConversion,
        allBasisOptionValue
      )
    );

    const newGeneralGroups = await Promise.all(
      mappingAttributeGroups(
        product.general_attribute_groups,
        allGeneralAttribute,
        allBasisConversion
      )
    );

    const newFeatureGroups = await Promise.all(
      mappingAttributeGroups(
        product.feature_attribute_groups,
        allFeatureAttribute,
        allBasisConversion
      )
    );

    return successResponse({
      data: {
        ...product,
        brand: {
          ...product.brand,
          official_websites: officialWebsites,
        },
        general_attribute_groups: newGeneralGroups,
        feature_attribute_groups: newFeatureGroups,
        specification_attribute_groups: newSpecificationGroups,
      },
    });
  }

  public getBrandProductSummary = async (brandId: string) => {
    const products = await productRepository.getProductBy(undefined, brandId);
    const collections = getUniqueCollections(products);
    const categories = getUniqueProductCategories(products);
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
      returnedProducts = mappingByCollections(products);
    } else {
      returnedProducts = mappingByBrand(products);
    }
    return successResponse({
      data: {
        data: sortBy(returnedProducts, "name"),
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
    orderBy?: "ASC" | "DESC"
  ) => {
    const products = await productRepository.getProductBy(
      user.id,
      brandId,
      categoryId,
      undefined,
      keyword,
      sortName,
      orderBy
    );
    if (categoryId || !brandId) {
      return successResponse({
        data: sortBy(mappingByBrand(products), "name"),
      });
    }
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
      product.collection_id
    );
    return successResponse({
      data: products.map((item) => {
        return {
          id: item.id,
          collection_id: item.collection_id,
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
      user_id: user.id,
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
        })
      }
      return final;
    }, [] as any);
    return successResponse({ data: result ?? [] });
  };

  public getFavoriteProductSummary = async (user: UserAttributes) => {
    const products = await productRepository.getFavouriteProducts(user.id);
    const categories = getUniqueProductCategories(products);
    const brands = getUniqueBrands(products);
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
      getFileURI(product.images[0]) ?? "",
      product.brand.name,
      getFileURI(product.brand.logo) ?? "",
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

export const productService = new ProductService();

export default ProductService;
