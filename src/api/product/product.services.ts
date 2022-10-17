import {
  ATTRIBUTE_TYPES,
  BASIS_TYPES,
  COMMON_TYPES,
  MESSAGES,
} from "@/constants";
import { getFileURI } from "@/helper/image.helper";
import {
  errorMessageResponse,
  successMessageResponse,
  successResponse,
} from "@/helper/response.helper";
import AttributeRepository from "@/repositories/attribute.repository";
import BasisRepository from "@/repositories/basis.repository";
import BrandRepository from "@/repositories/brand.repository";
import { commonTypeRepository } from "@/repositories/common_type.repository";
import ProductRepository from "@/repositories/product.repository";
import ProductFavouriteRepository from "@/repositories/product_favourite.repository";
import { userRepository } from "@/repositories/user.repository";
import CountryStateCityService from "@/service/country_state_city_v1.service";
import {
  uploadImagesProduct,
  validateImageType,
} from "@/service/image.service";
import MailService from "@/service/mail.service";
import { BasisConversion } from "@/types/basis.type";
import { difference } from "lodash";
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
  IProductAssignToProject,
  IProductOptionAttribute,
  IProductRequest,
  IUpdateProductRequest,
  ShareProductBodyRequest,
} from "./product.type";
class ProductService {
  private countryStateCityService: CountryStateCityService;
  private mailService: MailService;

  private brandRepository: BrandRepository;
  private productFavouriteRepository: ProductFavouriteRepository;

  constructor() {
    this.countryStateCityService = new CountryStateCityService();
    this.mailService = new MailService();
    this.brandRepository = new BrandRepository();
    this.productFavouriteRepository = new ProductFavouriteRepository();
  }

  private getAllBasisConversion = async () => {
    const allBasisConversion = await BasisRepository.getAllBy({
      type: BASIS_TYPES.CONVERSION,
    });
    return allBasisConversion.reduce((pre, cur) => {
      return pre.concat(cur.subs);
    }, []);
  };

  public async create(user_id: string, payload: IProductRequest) {
    const product = await ProductRepository.findBy({
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

    const brand = await this.brandRepository.find(payload.brand_id);
    if (!brand) {
      return errorMessageResponse(MESSAGES.BRAND_NOT_FOUND);
    }

    const uploadedImages = await uploadImagesProduct(
      payload.images,
      payload.keywords,
      brand.name,
      brand.id
    );

    const createdProduct = await ProductRepository.create({
      brand_id: payload.brand_id,
      collection_id: payload.collection_id,
      category_ids: payload.category_ids,
      name: payload.name,
      code: "random",
      description: payload.description,
      general_attribute_groups: saveGeneralAttributeGroups,
      feature_attribute_groups: saveFeatureAttributeGroups,
      specification_attribute_groups: saveSpecificationAttributeGroups,
      created_by: user_id,
      images: uploadedImages,
      keywords: payload.keywords,
    });
    if (!createdProduct) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return await this.get(createdProduct.id, user_id);
  }

  public async duplicate(id: string, user_id: string) {
    const product = await ProductRepository.find(id);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const created = await ProductRepository.create({
      ...product,
      name: product.name + " - copy",
    });
    if (!created) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return successResponse(await this.get(created.id, user_id));
  }

  public async update(
    id: string,
    payload: IUpdateProductRequest,
    userId: string
  ) {
    const product = await ProductRepository.findWithRelationData(id, userId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const duplicatedProduct = await ProductRepository.getDuplicatedProduct(
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

    const updatedProduct = await ProductRepository.update(id, {
      ...payload,
      general_attribute_groups: saveGeneralAttributeGroups,
      feature_attribute_groups: saveFeatureAttributeGroups,
      specification_attribute_groups: saveSpecificationAttributeGroups,
      images: imagePaths,
    });
    if (!updatedProduct) {
      return errorMessageResponse(MESSAGES.SOMETHING_WRONG_CREATE);
    }
    return await this.get(id, userId);
  }

  public async get(id: string, userId: string) {
    const product = await ProductRepository.findWithRelationData(id, userId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    const officialWebsites = await Promise.all(
      product.brand.official_websites.map(async (officialWebsite) => {
        const country = await this.countryStateCityService.getCountryDetail(
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
      ATTRIBUTE_TYPES.FEATURE
    );
    const allFeatureAttribute: any[] = mappingAttributeOrBasis(
      allFeatureAttributeGroup
    );

    const allGeneralAttributeGroup = await AttributeRepository.getByType(
      ATTRIBUTE_TYPES.GENERAL
    );
    const allGeneralAttribute: any[] = mappingAttributeOrBasis(
      allGeneralAttributeGroup
    );
    const allSpecificationAttributeGroup = await AttributeRepository.getByType(
      ATTRIBUTE_TYPES.SPECIFICATION
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
    const products = await ProductRepository.getProductBy(undefined, brandId);
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
    userId: string,
    brandId: string,
    categoryId?: string,
    collectionId?: string,
    keyword?: string,
    sortName?: string,
    orderBy: "ASC" | "DESC" = "ASC"
  ) => {
    let products = await ProductRepository.getProductBy(
      userId,
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
        data: returnedProducts,
        brand: await this.brandRepository.find(brandId),
      },
    });
  };

  public getListDesignerBrandProducts = async (
    userId: string,
    brandId?: string,
    categoryId?: string,
    keyword?: string,
    sortName?: string,
    orderBy: "ASC" | "DESC" = "ASC"
  ) => {
    const products = await ProductRepository.getProductBy(
      userId,
      brandId,
      categoryId,
      undefined,
      keyword,
      sortName,
      orderBy
    );
    if (categoryId || !brandId) {
      return successResponse({
        data: mappingByBrand(products),
      });
    }
    if (brandId) {
      const variants = getTotalVariantOfProducts(products);
      const brand = await this.brandRepository.find(brandId);
      const collections = getUniqueCollections(products);
      return successResponse({
        data: mappingByCollections(products),
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
    const product = await ProductRepository.find(productId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }

    // const consideredProduct = await this.consideredProductModel.findBy({
    //   product_id: product.id,
    // });
    // if (consideredProduct) {
    //   return errorMessageResponse(MESSAGES.PRODUCT_WAS_CONSIDERED);
    // }
    // const specifiedProduct = await this.specifiedProductModel.findBy({
    //   product_id: product.id,
    // });
    // if (specifiedProduct) {
    //   return errorMessageResponse(MESSAGES.PRODUCT_WAS_SPECIFIED);
    // }

    const isDeleted = await ProductRepository.delete(product.id);
    if (isDeleted) {
      return successMessageResponse(MESSAGES.SUCCESS);
    }
    return errorMessageResponse(MESSAGES.SOMETHING_WRONG_DELETE);
  };

  public getListRestCollectionProduct = async (productId: string) => {
    const product = await ProductRepository.findWithRelationData(productId);
    if (!product) {
      return errorMessageResponse(MESSAGES.PRODUCT_NOT_FOUND, 404);
    }
    const products = await ProductRepository.getRelatedCollection(
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

  public likeOrUnlike = async (productId: string, userId: string) => {
    const favourite = await this.productFavouriteRepository.findBy({
      product_id: productId,
      user_id: userId,
    });
    if (!favourite) {
      await this.productFavouriteRepository.like(productId, userId);
    } else {
      await this.productFavouriteRepository.unlike(productId, userId);
    }
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  /* Getting the product options for a product. */
  public getProductOptions = async (productId: string, attributeId: string) => {
    const product = await ProductRepository.find(productId);
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
    const result = attribute.basis_options?.map((item) => {
      const foundValue = optionValues.find((el: any) => el.id === item.id);
      return {
        id: item.id,
        option_code: item.option_code,
        name: foundValue.value_1 + " - " + foundValue.value_2,
        value_1: foundValue.value_1,
        value_2: foundValue.value_2,
        image: foundValue.image,
      };
    });
    return successResponse({ data: result ?? [] });
  };

  public assign = (_userId: string, _payload: IProductAssignToProject) => {
    return successMessageResponse(MESSAGES.SUCCESS);
  };

  public getFavoriteProductSummary = async (userId: string) => {
    const products = await ProductRepository.getFavouriteProducts(userId);
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
    userId: string,
    order: "ASC" | "DESC" = "ASC",
    brandId?: string,
    categoryId?: string
  ) => {
    const products = await ProductRepository.getFavouriteProducts(
      userId,
      brandId,
      order
    );
    if (categoryId) {
      return successResponse({
        data: mappingByCategory(products),
      });
    }
    /// default group by brand
    return successResponse({
      data: mappingByBrand(products),
    });
  };

  public shareByEmail = async (
    payload: ShareProductBodyRequest,
    userId: string
  ) => {
    const user = await userRepository.find(userId);
    if (!user) {
      return errorMessageResponse(MESSAGES.ACCOUNT_NOT_EXIST);
    }
    const product = await ProductRepository.findWithRelationData(
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

    const sent = await this.mailService.sendShareProductViaEmail(
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
      ""
    );
    if (!sent) {
      return errorMessageResponse(MESSAGES.SEND_EMAIL_WRONG);
    }
    return successMessageResponse(MESSAGES.EMAIL_SENT);
  };

  public getSharingGroups = async (userId: string) => {
    const user = await userRepository.find(userId);
    if (!user) {
      return successResponse({ data: [] });
    }
    return successResponse({
      data: await commonTypeRepository.getAllByRelationAndType(
        user.relation_id,
        COMMON_TYPES.SHARING_GROUP
      ),
    });
  };
  public getSharingPurposes = async (userId: string) => {
    const user = await userRepository.find(userId);
    if (!user) {
      return successResponse({ data: [] });
    }
    return successResponse({
      data: await commonTypeRepository.getAllByRelationAndType(
        user.relation_id,
        COMMON_TYPES.SHARING_PURPOSE
      ),
    });
  };
}

export const productService = new ProductService();

export default ProductService;
