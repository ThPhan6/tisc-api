import moment from "moment";
import { v4 as uuid } from "uuid";
import CategoryService from "../../api/category/category.service";
import {
  ATTRIBUTE_TYPES,
  BASIS_TYPES,
  CONSIDERED_PRODUCT_STATUS,
  MESSAGES,
  VALID_IMAGE_TYPES,
  COMMON_TYPES,
} from "../../constant/common.constant";
import {
  getDistinctArray,
  getFileTypeFromBase64,
  removeSpecialChars,
} from "../../helper/common.helper";
import { toWebp, getFileURI } from "../../helper/image.helper";
import BrandModel from "../../model/brand.model";
import CollectionModel from "../../model/collection.model";
import UserModel from "../../model/user.model";
import CommonTypeModel, {DEFAULT_COMMON_TYPE} from "../../model/common_type.model";
import ProductModel, {
  IProductAttributes,
  ProductWithCollectionAndBrand,
  PRODUCT_NULL_ATTRIBUTES,
} from "../../model/product.model";
import { deleteFile, isExists, upload } from "../../service/aws.service";
import { IMessageResponse } from "../../type/common.type";
import { getBufferFile } from "./../../service/aws.service";
import {
  IBrandProductSummary,
  IDesignerProductsResponse,
  IProductAssignToProject,
  IProductOptionAttribute,
  IProductOptionResponse,
  IProductRequest,
  IProductResponse,
  IProductsResponse,
  IRestCollectionProductsResponse,
  IUpdateProductRequest,
  FavouriteProductSummaryResponse,
  FavouriteProductsResponse,
  ShareProductBodyRequest,
  CommonTypeResponse,
} from "./product.type";
import BasisService from "../../api/basis/basis.service";
import CountryStateCityService from "../../service/country_state_city_v1.service";
import BasisModel from "../../model/basis.model";
import AttributeModel from "../../model/attribute.model";
import ProjectModel from "../../model/project.model";
import ConsideredProductModel, {
  CONSIDERED_PRODUCT_NULL_ATTRIBUTES,
} from "../../model/considered_product.model";
import SpecifiedProductModel, {
  SPECIFIED_PRODUCT_NULL_ATTRIBUTES,
} from "../../model/specified_product.model";
import MailService from "../../service/mail.service";

export default class ProductService {
  private productModel: ProductModel;
  private brandModel: BrandModel;
  private collectionModel: CollectionModel;
  private categoryService: CategoryService;
  private basisService: BasisService;
  private countryStateCityService: CountryStateCityService;
  private basisModel: BasisModel;
  private projectModel: ProjectModel;
  private attributeModel: AttributeModel;
  private consideredProductModel: ConsideredProductModel;
  private specifiedProductModel: SpecifiedProductModel;
  private mailService: MailService;
  private userModel: UserModel;
  private commonTypeModel: CommonTypeModel;

  constructor() {
    this.productModel = new ProductModel();
    this.brandModel = new BrandModel();
    this.collectionModel = new CollectionModel();
    this.categoryService = new CategoryService();
    this.basisService = new BasisService();
    this.countryStateCityService = new CountryStateCityService();
    this.basisModel = new BasisModel();
    this.projectModel = new ProjectModel();
    this.attributeModel = new AttributeModel();
    this.consideredProductModel = new ConsideredProductModel();
    this.specifiedProductModel = new SpecifiedProductModel();
    this.mailService = new MailService();
    this.userModel = new UserModel();
    this.commonTypeModel = new CommonTypeModel();
  }

  private getTotalVariantOfProducts = (
    products: IProductAttributes[] | ProductWithCollectionAndBrand[] = []
  ) => {
    return [...products].reduce(
      (pre: string[], cur
    ) => {
      let temp: any = [];
      cur.specification_attribute_groups.forEach((group) => {
        group.attributes.forEach((attribute) => {
          attribute.basis_options?.forEach((basis_option) => {
            temp.push(basis_option);
          });
        });
      });
      return pre.concat(temp);
    }, []);
  };

  private getTotalCategoryOfProducts = (products: IProductAttributes[]) => {
    const rawCategoryIds = products.reduce((pre: string[], cur) => {
      return pre.concat(cur.category_ids || []);
    }, []);
    return getDistinctArray(rawCategoryIds);
  };

  private getUniqueBrands = (products: ProductWithCollectionAndBrand[]) => {
    return products.reduce((res: ProductWithCollectionAndBrand['brand'][], cur) => {
      if (!res.find((brand) => brand.id === cur.brand.id)) {
        res = res.concat(cur.brand);
      }
      return res;
    }, []);
  }
  private getUniqueCollections = (products: ProductWithCollectionAndBrand[]) => {
    return products.reduce((res: ProductWithCollectionAndBrand['collection'][], cur) => {
      if (!res.find((collection) => collection.id === cur.collection.id)) {
        res = res.concat(cur.collection);
      }
      return res;
    }, []);
  }

  public create = (
    user_id: string,
    payload: IProductRequest
  ): Promise<IMessageResponse | IProductResponse> => {
    return new Promise(async (resolve) => {
      const product = await this.productModel.findBy({
        name: payload.name,
        brand_id: payload.brand_id,
      });
      if (product) {
        return resolve({
          message: MESSAGES.PRODUCT_EXISTED,
          statusCode: 400,
        });
      }
      const mapAttributeFunction = async (item: any) => {
        const newAttributes = await Promise.all(
          item.attributes.map(async (attribute: any) => {
            if (attribute.type === "Conversions") {
              const conversion = await this.basisService.getConversion(
                attribute.basis_id
              );
              const value1 = parseFloat(attribute.conversion_value_1 || "0");
              const value2 = value1 / parseFloat(conversion?.formula_1 || "1");
              return {
                ...attribute,
                conversion_value_1: value1.toFixed(2),
                conversion_value_2: value2.toFixed(2),
              };
            }
            return attribute;
          })
        );
        return {
          ...item,
          id: uuid(),
          attributes: newAttributes,
        };
      };
      const saveGeneralAttributeGroups = await Promise.all(
        payload.general_attribute_groups.map(mapAttributeFunction)
      );
      const saveFeatureAttributeGroups = await Promise.all(
        payload.feature_attribute_groups.map(mapAttributeFunction)
      );
      const saveSpecificationAttributeGroups = await Promise.all(
        payload.specification_attribute_groups.map(mapAttributeFunction)
      );

      let isValidImage = true;
      for (const image of payload.images) {
        const fileType = await getFileTypeFromBase64(image);
        if (
          !fileType ||
          !VALID_IMAGE_TYPES.find((validType) => validType === fileType.mime)
        ) {
          isValidImage = false;
        }
      }
      if (!isValidImage) {
        return resolve({
          message: MESSAGES.IMAGE_INVALID,
          statusCode: 400,
        });
      }

      const createdProduct = await this.productModel.create({
        ...PRODUCT_NULL_ATTRIBUTES,
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
        images: [],
        keywords: payload.keywords,
        brand_location_id: payload.brand_location_id,
        distributor_location_id: payload.distributor_location_id,
      });
      if (!createdProduct) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      const brand = await this.brandModel.find(payload.brand_id);
      const brandName = removeSpecialChars(
        brand?.name
          .trim()
          .toLowerCase()
          .split(" ")
          .join("-")
          .replace(/ /g, "-") || ""
      );
      const imagePaths = await Promise.all(
        payload.images.map(async (image, index) => {
          const mediumBuffer = await toWebp(
            Buffer.from(image, "base64"),
            "medium"
          );
          const keywords = payload.keywords.map((item) => {
            return item.trim().replace(/ /g, "-");
          });
          let fileName = `${brandName}-${keywords.join(
            "-"
          )}-${moment.now()}${index}`;
          await upload(
            mediumBuffer,
            `product/${createdProduct.id}/${fileName}_medium.webp`,
            "image/webp"
          );
          return `/product/${createdProduct.id}/${fileName}_medium.webp`;
        })
      );
      await this.productModel.update(createdProduct.id, {
        images: imagePaths,
      });
      return resolve(await this.get(createdProduct.id, user_id));
    });
  };
  public duplicate = (
    id: string,
    user_id: string
  ): Promise<IMessageResponse | IProductResponse> =>
    new Promise(async (resolve) => {
      const product = await this.productModel.find(id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const brand = await this.brandModel.find(product.brand_id);
      const brandName = removeSpecialChars(
        brand?.name
          .trim()
          .toLowerCase()
          .split(" ")
          .join("-")
          .replace(/ /g, "-") || ""
      );
      const imageBuffers = await Promise.all(
        product.images.map(
          async (image: string) => await getBufferFile(image.slice(1))
        )
      );
      const imagePaths = await Promise.all(
        imageBuffers.map(async (image, index) => {
          const mediumBuffer = await toWebp(image, "medium");
          const keywords = product.keywords.map((item) => {
            return item.trim().replace(/ /g, "-");
          });
          let fileName = `${brandName}-${keywords
            .concat(["copy"])
            .join("-")}-${moment.now()}${index}`;
          await upload(
            mediumBuffer,
            `product/${id}/${fileName}_medium.webp`,
            "image/webp"
          );
          return `/product/${id}/${fileName}_medium.webp`;
        })
      );
      const created = await this.productModel.create({
        ...product,
        name: product.name + " - copy",
        keywords: product.keywords.concat(["copy"]),
        images: imagePaths,
        favorites: [],
      });
      if (!created) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(created.id, user_id));
    });
  public update = (
    id: string,
    payload: IUpdateProductRequest,
    user_id: string
  ): Promise<IMessageResponse | IProductResponse> => {
    return new Promise(async (resolve) => {
      const product = await this.productModel.find(id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const brand = await this.brandModel.find(payload.brand_id);
      const duplicatedProduct = await this.productModel.getDuplicatedProduct(
        id,
        payload.name,
        payload.brand_id
      );
      if (duplicatedProduct) {
        return resolve({
          message: MESSAGES.PRODUCT_DUPLICATED,
          statusCode: 400,
        });
      }
      const mapAttributeFunction = async (item: any) => {
        const newAttributes = await Promise.all(
          item.attributes.map(async (attribute: any) => {
            if (attribute.type === "Conversions") {
              const conversion = await this.basisService.getConversion(
                attribute.basis_id
              );
              const value1 = parseFloat(attribute.conversion_value_1 || "0");
              const value2 = value1 / parseFloat(conversion?.formula_1 || "1");
              return {
                ...attribute,
                conversion_value_1: value1.toFixed(2),
                conversion_value_2: value2.toFixed(2),
              };
            }
            return attribute;
          })
        );
        if (item.id) {
          return {
            ...item,
            attributes: newAttributes,
          };
        }
        return {
          ...item,
          id: uuid(),
          attributes: newAttributes,
        };
      };
      const saveGeneralAttributeGroups = await Promise.all(
        payload.general_attribute_groups.map(mapAttributeFunction)
      );
      const saveFeatureAttributeGroups = await Promise.all(
        payload.feature_attribute_groups.map(mapAttributeFunction)
      );
      const saveSpecificationAttributeGroups = await Promise.all(
        payload.specification_attribute_groups.map(mapAttributeFunction)
      );

      let imagePaths: string[] = [];
      let isValidImage = true;
      let mediumBuffer: Buffer;
      if (
        payload.images.join("-") === product.images.join("-") &&
        payload.keywords.join("") === product.keywords.join("")
      ) {
        imagePaths = product.images;
      } else {
        const bufferImages = await Promise.all(
          payload.images.map(async (image) => {
            const fileType = await getFileTypeFromBase64(image);
            if (!fileType) {
              const isExisted = await isExists(image.slice(1));
              if (isExisted) {
                return await getBufferFile(image.slice(1));
              }
              isValidImage = false;
              return false;
            }
            if (
              !VALID_IMAGE_TYPES.find(
                (validType) => validType === fileType.mime
              )
            ) {
              isValidImage = false;
              return false;
            }
            return Buffer.from(image, "base64");
          })
        );
        if (!isValidImage) {
          return resolve({
            message: MESSAGES.IMAGE_INVALID,
            statusCode: 400,
          });
        }
        await Promise.all(
          product.images.map(async (item) => {
            await deleteFile(item.slice(1));
            return true;
          })
        );

        imagePaths = await Promise.all(
          bufferImages.map(async (image, index) => {
            mediumBuffer = await toWebp(image, "medium");

            const keywords = payload.keywords.map((item) => {
              return item.trim().replace(/ /g, "-");
            });
            const brandName = removeSpecialChars(
              brand?.name
                .trim()
                .toLowerCase()
                .split(" ")
                .join("-")
                .replace(/ /g, "-") || ""
            );
            let fileName = `${brandName}-${keywords.join(
              "-"
            )}-${moment.now()}${index}`;
            await upload(
              mediumBuffer,
              `product/${id}/${fileName}_medium.webp`,
              "image/webp"
            );
            return `/product/${id}/${fileName}_medium.webp`;
          })
        );
      }
      const updatedProduct = await this.productModel.update(id, {
        ...payload,
        general_attribute_groups: saveGeneralAttributeGroups,
        feature_attribute_groups: saveFeatureAttributeGroups,
        specification_attribute_groups: saveSpecificationAttributeGroups,
        images: imagePaths,
      });
      if (!updatedProduct) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_CREATE,
          statusCode: 400,
        });
      }
      return resolve(await this.get(id, user_id));
    });
  };
  public get = (
    id: string,
    user_id: string
  ): Promise<IMessageResponse | IProductResponse> =>
    new Promise(async (resolve) => {
      const product = await this.productModel.find(id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const foundBrand = await this.brandModel.find(product.brand_id);
      if (!foundBrand) {
        return resolve({
          message: MESSAGES.BRAND_NOT_FOUND,
          statusCode: 404,
        });
      }
      const officialWebsites = await Promise.all(
        foundBrand.official_websites.map(async (officialWebsite) => {
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

      const collection = await this.collectionModel.find(
        product.collection_id || ""
      );
      const categories: { id: string; name: string }[] =
        await this.categoryService.getCategoryValues(
          product.category_ids || []
        );
      const allFeatureAttributeGroup = await this.attributeModel.getAllBy({
        type: ATTRIBUTE_TYPES.FEATURE,
      });
      const allFeatureAttribute: any[] = allFeatureAttributeGroup.reduce(
        (pre: any, cur) => {
          return pre.concat(cur.subs);
        },
        []
      );
      const allGeneralAttributeGroup = await this.attributeModel.getAllBy({
        type: ATTRIBUTE_TYPES.GENERAL,
      });
      const allGeneralAttribute: any[] = allGeneralAttributeGroup.reduce(
        (pre: any, cur) => {
          return pre.concat(cur.subs);
        },
        []
      );
      const allSpecificationAttributeGroup = await this.attributeModel.getAllBy(
        {
          type: ATTRIBUTE_TYPES.SPECIFICATION,
        }
      );
      const allSpecificationAttribute: any[] =
        allSpecificationAttributeGroup.reduce((pre: any, cur) => {
          return pre.concat(cur.subs);
        }, []);

      const allBasisOptionGroup = await this.basisModel.getAllBy({
        type: BASIS_TYPES.OPTION,
      });
      const allBasisOption = allBasisOptionGroup.reduce((pre, cur) => {
        return pre.concat(cur.subs);
      }, []);

      const allBasisOptionValue: any[] = allBasisOption.reduce(
        (pre: any, cur: any) => {
          return pre.concat(cur.subs);
        },
        []
      );
      const allBasisConversionGroup = await this.basisModel.getAllBy({
        type: BASIS_TYPES.CONVERSION,
      });
      const allBasisConversion = allBasisConversionGroup.reduce((pre, cur) => {
        return pre.concat(cur.subs);
      }, []);
      const newSpecificationGroups = await Promise.all(
        product.specification_attribute_groups.map(async (group) => {
          const newAttributes = await Promise.all(
            group.attributes.map(async (attribute) => {
              const foundAttribute = allSpecificationAttribute.find(
                (item) => item.id === attribute.id
              );
              let newBasisOptions: any = attribute.basis_options;
              if (attribute.basis_options) {
                newBasisOptions = attribute.basis_options.map((basisOption) => {
                  const foundBasisOption = allBasisOptionValue.find(
                    (item) => item.id === basisOption.id
                  );
                  return {
                    ...basisOption,
                    value_1: foundBasisOption?.value_1,
                    value_2: foundBasisOption?.value_2,
                    unit_1: foundBasisOption?.unit_1,
                    unit_2: foundBasisOption?.unit_2,
                    image: foundBasisOption?.image,
                  };
                });
              }
              if (attribute.type === "Conversions") {
                const conversion = allBasisConversion.find(
                  (item: any) => item.id === attribute.basis_id
                );
                return {
                  ...attribute,
                  name: foundAttribute?.name,
                  basis_options: newBasisOptions,
                  conversion,
                };
              }
              return {
                ...attribute,
                name: foundAttribute?.name,
                basis_options: newBasisOptions,
              };
            })
          );
          return { ...group, attributes: newAttributes };
        })
      );
      const newGeneralGroups = await Promise.all(
        product.general_attribute_groups.map(async (group) => {
          const newAttributes = await Promise.all(
            group.attributes.map(async (attribute) => {
              const foundAttribute = allGeneralAttribute.find(
                (item) => item.id === attribute.id
              );
              if (attribute.type === "Conversions") {
                const conversion = allBasisConversion.find(
                  (item: any) => item.id === attribute.basis_id
                );
                return {
                  ...attribute,
                  name: foundAttribute?.name,
                  conversion,
                };
              }
              return {
                ...attribute,
                name: foundAttribute?.name,
              };
            })
          );
          return { ...group, attributes: newAttributes };
        })
      );
      const newFeatureGroups = await Promise.all(
        product.feature_attribute_groups.map(async (group) => {
          const newAttributes = await Promise.all(
            group.attributes.map(async (attribute) => {
              const foundAttribute = allFeatureAttribute.find(
                (item) => item.id === attribute.id
              );
              if (attribute.type === "Conversions") {
                const conversion = allBasisConversion.find(
                  (item: any) => item.id === attribute.basis_id
                );
                return {
                  ...attribute,
                  name: foundAttribute?.name,
                  conversion,
                };
              }
              return {
                ...attribute,
                name: foundAttribute?.name,
              };
            })
          );
          return { ...group, attributes: newAttributes };
        })
      );

      return resolve({
        data: {
          id: product.id,
          brand: {
            ...foundBrand,
            official_websites: officialWebsites,
          },
          collection: {
            id: collection?.id || "",
            name: collection?.name || "",
          },
          categories: categories,
          name: product.name,
          code: product.code,
          description: product.description,
          general_attribute_groups: newGeneralGroups,
          feature_attribute_groups: newFeatureGroups,
          specification_attribute_groups: newSpecificationGroups,
          created_at: product.created_at,
          created_by: product.created_by,
          favorites: product.favorites?.length || 0,
          images: product.images,
          keywords: product.keywords,
          brand_location_id: product.brand_location_id || "",
          distributor_location_id: product.distributor_location_id || "",
          is_liked: product.favorites.includes(user_id),
        },
        statusCode: 200,
      });
    });

  public getBrandProductSummary = (
    brand_id: string
  ): Promise<IBrandProductSummary> =>
    new Promise(async (resolve) => {
      const products = await this.productModel.getAllBrandProduct(brand_id);
      const collections = await this.collectionModel.getAllBy(
        { brand_id },
        ["id", "name"],
        "created_at",
        "ASC"
      );

      const variants = this.getTotalVariantOfProducts(products);
      const categoryIds = this.getTotalCategoryOfProducts(products);
      const categories = await this.categoryService.getCategoryValues(
        categoryIds
      );
      return resolve({
        data: {
          categories,
          collections,
          category_count: categories.length,
          collection_count: collections.length,
          card_count: products.length,
          product_count: variants.length,
        },
        statusCode: 200,
      });
    });

  public getList = (
    brand_id: string,
    category_id: any,
    collection_id: any,
    user_id: string
  ): Promise<IMessageResponse | IProductsResponse> => {
    return new Promise(async (resolve) => {
      let products: IProductAttributes[] = [];
      let returnData: any[] = [];
      if (!category_id && !collection_id) {
        collection_id = "all";
      }
      if (category_id) {
        if (category_id === "all") {
          products = await this.productModel.getAllBy({ brand_id });
          const categoryIds = this.getTotalCategoryOfProducts(products);
          const categories = await this.categoryService.getCategoryValues(
            categoryIds
          );
          returnData = categories.map((category) => {
            const categoryProducts = products.filter((item) =>
              item.category_ids.includes(category.id)
            );
            return {
              ...category,
              count: categoryProducts.length,
              products: categoryProducts,
            };
          });
        } else {
          products = await this.productModel.getAllByCategoryId(
            category_id,
            brand_id
          );
          const category = await this.categoryService.getCategoryValues([
            category_id,
          ]);

          returnData = [
            {
              id: category[0].id,
              name: category[0].name,
              count: products.length,
              products,
            },
          ];
        }
      }
      if (collection_id) {
        if (collection_id === "all") {
          products = await this.productModel.getAllBy({
            brand_id,
          });
          const collections = await this.collectionModel.getAllBy(
            { brand_id },
            ["id", "name"],
            "created_at",
            "ASC"
          );
          returnData = collections.map((collection) => {
            const collectionProducts = products.filter(
              (item) => item.collection_id === collection.id
            );
            return {
              ...collection,
              count: collectionProducts.length,
              products: collectionProducts,
            };
          });
        } else {
          products = await this.productModel.getAllBy({
            brand_id,
            collection_id,
          });
          const collection = await this.collectionModel.find(collection_id);
          returnData = [
            {
              id: collection?.id,
              name: collection?.name,
              count: products.length,
              products,
            },
          ];
        }
      }
      returnData = returnData.map((item) => {
        const returnProducts = item.products?.map((product: any) => {
          const { is_deleted, ...rest } = product;
          return {
            ...rest,
            favorites: product.favorites.length,
            is_liked: product.favorites.includes(user_id),
          };
        });
        return {
          ...item,
          products: returnProducts,
        };
      });
      return resolve({
        data: {
          data: returnData,
          brand: await this.brandModel.find(brand_id),
        },
        statusCode: 200,
      });
    });
  };

  public getListDesignerBrandProducts = (
    user_id: string,
    brand_id?: string,
    category_id?: string,
    keyword?: string,
    sort?: string,
    order: "ASC" | "DESC" = 'ASC'
  ): Promise<IMessageResponse | IDesignerProductsResponse> => {
    return new Promise(async (resolve) => {
      let returnData: IDesignerProductsResponse['data'] = [];
      const products = await this.productModel.getCustomList(
        keyword,
        sort,
        order,
        brand_id,
        category_id
      );
      const brands = this.getUniqueBrands(products);
      const collections = this.getUniqueCollections(products);
      if (category_id || !brand_id) {
        returnData = brands.map((brand) => {
          const brandProducts = products.filter((item) => item.brand_id === brand.id);
          const { logo, ...rest } = brand;
          return {
            ...rest,
            brand_logo: logo,
            count: brandProducts.length,
            products: brandProducts.map((product) => {
              const { is_deleted, ...rest } = product;
              return {
                ...rest,
                brand_name: product.brand.name,
                favorites: product.favorites?.length ?? 0,
                is_liked: product.favorites?.includes(user_id) ?? false,
              }
            }),
          };
        });
      }

      if (brand_id) {
        returnData = collections.map((collection) => {
          const collectionProducts = products.filter(
            (item) => item.collection_id === collection.id
          );
          return {
            ...collection,
            count: collectionProducts.length,
            products: collectionProducts.map((product) => {
              const { is_deleted, ...rest } = product;
              return {
                ...rest,
                brand_name: product.brand.name,
                favorites: product.favorites?.length ?? 0,
                is_liked: product.favorites?.includes(user_id) ?? false,
              }
            }),
          };
        });
      }
      const response: IDesignerProductsResponse = {
        data: returnData
          .filter((item) => item.products.length !== 0),
        statusCode: 200,
      }

      if (brand_id) { /// brand summary
        const variants = this.getTotalVariantOfProducts(products);
        const brand = await this.brandModel.find(brand_id);
        if (brand) {
          response.brand_summary =  {
            brand_name: brand.name,
            brand_logo: brand.logo ?? '',
            collection_count: collections.length,
            card_count: products.length,
            product_count: variants.length,
          };
        }
      }
      return resolve(response);
    });
  };


  public delete = async (id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const product = await this.productModel.find(id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      await this.productModel.update(id, { is_deleted: true });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  };
  public getListRestCollectionProduct = (
    productId: string
  ): Promise<IMessageResponse | IRestCollectionProductsResponse> => {
    return new Promise(async (resolve) => {
      const foundProduct = await this.productModel.find(productId);
      if (!foundProduct) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      if (!foundProduct.collection_id) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const foundCollection = await this.collectionModel.find(
        foundProduct.collection_id
      );
      if (!foundCollection) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const restCollectionProducts =
        await this.productModel.getListRestCollectionProduct(
          foundProduct.collection_id,
          productId
        );

      const result = restCollectionProducts.map((item: IProductAttributes) => {
        return {
          id: item.id,
          collection_id: item.collection_id,
          name: item.name,
          images: item.images,
          created_at: item.created_at,
        };
      });
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };
  public likeOrUnlike = (
    id: string,
    user_id: string
  ): Promise<IMessageResponse> =>
    new Promise(async (resolve) => {
      const product = await this.productModel.find(id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 404,
        });
      }
      const foundUserId = product.favorites.find((item) => item === user_id);
      let newFavorites: string[] = [];
      if (foundUserId) {
        newFavorites = product.favorites.filter((item) => item !== foundUserId);
      } else {
        newFavorites = product.favorites;
        newFavorites.push(user_id);
      }
      await this.productModel.update(id, {
        favorites: newFavorites,
      });
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });
  /* Getting the product options for a product. */
  public getProductOptions = (
    product_id: string,
    attribute_id: string
  ): Promise<IProductOptionResponse> =>
    new Promise(async (resolve) => {
      const product = await this.productModel.find(product_id);
      if (!product) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      let attributes: IProductOptionAttribute[] = [];
      product.specification_attribute_groups.forEach((item) => {
        attributes = attributes.concat(item.attributes);
      });
      const attribute = attributes.find((item) => item.id === attribute_id);
      if (!attribute) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const optionGroups = await this.basisModel.getAllBy({
        type: BASIS_TYPES.OPTION,
      });
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
      return resolve({
        data: result || [],
        statusCode: 200,
      });
    });
  public assign = (
    user_id: string,
    payload: IProductAssignToProject
  ): Promise<IMessageResponse> =>
    new Promise(async (resolve) => {
      if (!payload.is_entire && !payload.project_zone_ids.length) {
        return resolve({
          message: MESSAGES.PROJECT_ZONE_MISSING,
          statusCode: 400,
        });
      }
      const product = await this.productModel.find(payload.product_id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 400,
        });
      }
      const project = await this.projectModel.find(payload.project_id);
      if (!project) {
        return resolve({
          message: MESSAGES.PROJECT_NOT_FOUND,
          statusCode: 400,
        });
      }

      const consideredRecord = await this.consideredProductModel.findBy({
        product_id: payload.product_id,
        project_id: payload.project_id,
      });
      if (payload.is_entire) {
        if (consideredRecord?.is_entire) {
          // skip
          return resolve({
            message: MESSAGES.SUCCESS,
            statusCode: 200,
          });
        }

        // create one
        const createdConsideredProduct =
          await this.consideredProductModel.create({
            ...CONSIDERED_PRODUCT_NULL_ATTRIBUTES,
            product_id: payload.product_id,
            project_id: payload.project_id,
            assigned_by: user_id,
            is_entire: true,
            status: CONSIDERED_PRODUCT_STATUS.CONSIDERED,
          });

        // DELETE records
        const consideredRecords = await this.consideredProductModel.getAllBy({
          product_id: payload.product_id,
          project_id: payload.project_id,
          is_entire: false,
        });

        const consideredIds = consideredRecords.map(
          (consideredRecord) => consideredRecord.id
        );
        const deleteConsideredPromise = consideredIds.map(
          async (consideredId) => {
            await this.consideredProductModel.update(consideredId, {
              is_deleted: true,
            });

            const foundSpecifiedProduct =
              await this.specifiedProductModel.findBy({
                considered_product_id: consideredId,
              });

            if (!foundSpecifiedProduct) {
              return;
            }

            if (
              payload.considered_product_id &&
              consideredId === payload.considered_product_id &&
              createdConsideredProduct
            ) {
              await this.specifiedProductModel.update(
                foundSpecifiedProduct.id,
                {
                  considered_product_id: createdConsideredProduct.id,
                }
              );
            } else {
              await this.specifiedProductModel.update(
                foundSpecifiedProduct.id,
                {
                  is_deleted: true,
                }
              );
            }
          }
        );
        await Promise.all(deleteConsideredPromise);
      } else {
        //payload.is_entire = false
        if (consideredRecord?.is_entire === false) {
          // CREATE / DELETE / UPDATE records
          // payload.zone_ids => [1,4,5]
          // find By product_id + project_id ([1,2,3])
          // FIND CREATE = 4 + 5
          // FIND DELETE = 2 + 3
          // FIND UPDATE = 1
          const consideredRecords = await this.consideredProductModel.getAllBy({
            product_id: payload.product_id,
            project_id: payload.project_id,
          });

          const projectZoneIds = consideredRecords.map(
            (consideredRecord) => consideredRecord.project_zone_id
          );
          const createIds = payload.project_zone_ids.filter(
            (value) => !projectZoneIds.includes(value || "")
          );
          if (createIds.length) {
            const createPromises = createIds.map(async (foundCreateId) =>
              this.consideredProductModel.create({
                ...CONSIDERED_PRODUCT_NULL_ATTRIBUTES,
                product_id: payload.product_id,
                project_id: payload.project_id,
                assigned_by: user_id,
                is_entire: false,
                project_zone_id: foundCreateId,
                status: CONSIDERED_PRODUCT_STATUS.CONSIDERED,
              })
            );
            await Promise.all(createPromises);
          }

          const UpdateIndices: any = [];
          const UpdateIds: any = [];
          payload.project_zone_ids.forEach((value, index) => {
            if (projectZoneIds.includes(value || "")) {
              UpdateIndices.push(index);
              UpdateIds.push(value);
            }
          });
          if (UpdateIndices.length) {
            const updatePromises = UpdateIds.map(
              async (updateId: any, index: any) =>
                this.consideredProductModel.update(
                  consideredRecords[index].id,
                  {
                    product_id: payload.product_id,
                    project_id: payload.project_id,
                    is_entire: false,
                    project_zone_id: updateId,
                  }
                )
            );
            await Promise.all(updatePromises);
          }
          const deleteIndices: any = [];
          const deleteIds: any = [];

          projectZoneIds.forEach((value, index) => {
            if (!payload.project_zone_ids.includes(value || "")) {
              deleteIndices.push(index);
              deleteIds.push(value);
            }
          });

          if (deleteIndices.length) {
            Promise.all(
              deleteIndices.map(async (index: any) => {
                const recordDelete = consideredRecords[index];
                const foundSpecifiedProductDelete =
                  await this.specifiedProductModel.findBy({
                    considered_product_id: recordDelete.id,
                  });
                await this.specifiedProductModel.update(
                  foundSpecifiedProductDelete?.id || "",
                  { is_deleted: true }
                );
                await this.consideredProductModel.update(recordDelete.id, {
                  is_deleted: true,
                });
              })
            );
          }
        } else {
          //consideredRecord?.is_entire === true
          // CREATE records with project_zone_id
          const createConsiderPromises = payload.project_zone_ids.map(
            async (project_zone_id) =>
              await this.consideredProductModel.create({
                ...CONSIDERED_PRODUCT_NULL_ATTRIBUTES,
                product_id: payload.product_id,
                project_id: payload.project_id,
                assigned_by: user_id,
                is_entire: false,
                project_zone_id,
                status: CONSIDERED_PRODUCT_STATUS.CONSIDERED,
              })
          );
          const createdConsiders = await Promise.all(createConsiderPromises);
          // Delete record is_entire: consideredRecord
          //DELETE specify by consideredRecord.id
          const foundSpecifiedProduct = await this.specifiedProductModel.findBy(
            { considered_product_id: consideredRecord?.id }
          );

          if (
            payload.considered_product_id &&
            foundSpecifiedProduct &&
            createdConsiders
          ) {
            const { id, is_deleted, created_at, ...restSpecifiedProduct } =
              foundSpecifiedProduct;

            const cloneSpecifyPromises = createdConsiders.map((consider) =>
              consider
                ? this.specifiedProductModel.create({
                    ...SPECIFIED_PRODUCT_NULL_ATTRIBUTES,
                    ...restSpecifiedProduct,
                    considered_product_id: consider.id,
                    project_zone_id: consider.project_zone_id || "",
                  })
                : undefined
            );
            await Promise.all(cloneSpecifyPromises);
          }

          await this.specifiedProductModel.update(
            foundSpecifiedProduct?.id || "",
            { is_deleted: true }
          );
          await this.consideredProductModel.update(consideredRecord?.id || "", {
            is_deleted: true,
          });
        }
      }

      const newProductIds = project.product_ids
        ? project.product_ids.concat([payload.product_id])
        : [payload.product_id];
      const updated = await this.projectModel.update(project.id, {
        product_ids: getDistinctArray(newProductIds),
      });
      if (!updated) {
        return resolve({
          message: MESSAGES.SOMETHING_WRONG_UPDATE,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.SUCCESS,
        statusCode: 200,
      });
    });

  public getFavoriteProductSummary = (
    userId: string
  ): Promise<FavouriteProductSummaryResponse> =>
    new Promise(async (resolve) => {
      const products = await this.productModel.getUserFavouriteProducts(userId);
      const categoryIds = this.getTotalCategoryOfProducts(products);
      const brands = this.getUniqueBrands(products);
      const categories = await this.categoryService.getCategoryValues(
        categoryIds
      );
      return resolve({
        data: {
          categories,
          brands,
          category_count: categories.length,
          brand_count: brands.length,
          card_count: products.length,
        },
        statusCode: 200,
      });
    });

  public getFavouriteList = (
    userId: string,
    order: "ASC" | "DESC" = "ASC",
    brandId?: string,
    categoryId?: string
  ): Promise<IMessageResponse | FavouriteProductsResponse> => {
    return new Promise(async (resolve) => {
      const products = await this.productModel.getUserFavouriteProducts(
        userId,
        order,
        brandId,
        categoryId
      );
      /// category
      let categoryIds = this.getTotalCategoryOfProducts(products);
      if (categoryId) {
        categoryIds = [categoryId];
      }
      const categories = await this.categoryService.getCategoryValues(
        categoryIds
      );
      /// brand
      const result = await Promise.all(
        categories.map(async (category) => {
          let categoryProducts = products.filter(
            (item) => item.category_ids.includes(category.id)
          );

          /// format product data
          const responseProducts = await Promise.all(
            categoryProducts.map(async (product) => {
              const {
                is_deleted,
                collection_id,
                brand_id,
                category_ids,
                ...rest
              } = product;
              const productCategories: { id: string; name: string }[] = [];
              category_ids.forEach((categoryId) => {
                const category = categories.find(
                  (cat) => cat.id === categoryId
                );
                if (category) {
                  productCategories.push(category);
                }
              });
              return {
                ...rest,
                favorites: product.favorites.length,
                is_liked: true,
                categories: productCategories,
              };
            })
          );
          //// grouped by collection
          return {
            ...category,
            count: categoryProducts.length,
            products: responseProducts,
          };
        })
      );
      return resolve({
        data: result,
        statusCode: 200,
      });
    });
  };

  public shareByEmail = (payload: ShareProductBodyRequest, user_id: string): Promise<IMessageResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      // const toUser = await this.userModel.findBy({
      //   email: payload.to_email,
      // })
      if (!user) {
        return resolve({
          statusCode: 404,
          message: MESSAGES.ACCOUNT_NOT_EXIST,
        });
      }
      const product = await this.productModel.find(payload.product_id);
      if (!product) {
        return resolve({
          message: MESSAGES.PRODUCT_NOT_FOUND,
          statusCode: 400,
        });
      }

      // save common types
      const sharingGroup = await this.commonTypeModel.findByNameOrId(
        payload.sharing_group,
        user.relation_id || "",
        COMMON_TYPES.SHARING_GROUP
      );
      if (!sharingGroup) {
        await this.commonTypeModel.create({
          ...DEFAULT_COMMON_TYPE,
          name: payload.sharing_group,
          type: COMMON_TYPES.SHARING_GROUP,
          relation_id: user.relation_id || "",
        });
      }
      const sharingPurpose = await this.commonTypeModel.findByNameOrId(
        payload.sharing_purpose,
        user.relation_id || "",
        COMMON_TYPES.SHARING_PURPOSE
      );
      if (!sharingPurpose) {
        await this.commonTypeModel.create({
          ...DEFAULT_COMMON_TYPE,
          name: payload.sharing_purpose,
          type: COMMON_TYPES.SHARING_PURPOSE,
          relation_id: user.relation_id || "",
        });
      }
      // end save common types

      const brand = await this.brandModel.find(product.brand_id);
      const collection = await this.collectionModel.find(product.collection_id ?? '');
      const sent = await this.mailService.sendShareProductViaEmail(
        payload.to_email,
        user.email,
        payload.title,
        payload.message,
        getFileURI(product.images[0]) ?? '',
        brand?.name ?? 'N/A',
        getFileURI(brand?.logo) ?? '',
        collection?.name ?? 'N/A',
        product.name ?? 'N/A',
        `${user.firstname ?? ''} ${user.lastname ?? ''}`,
        ''
      );
      if (!sent) {
        return resolve({
          message: MESSAGES.SEND_EMAIL_WRONG,
          statusCode: 400,
        });
      }
      return resolve({
        message: MESSAGES.EMAIL_SENT,
        statusCode: 200,
      });
    });
  }

  public getSharingGroups = (
    user_id: string
  ): Promise<CommonTypeResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const sharingGroups = await this.commonTypeModel.getAllByRelationAndType(
        user.relation_id ?? '',
        COMMON_TYPES.SHARING_GROUP
      );
      return resolve({
        data: sharingGroups,
        statusCode: 200,
      });
    });
  };
  public getSharingPurposes = (
    user_id: string
  ): Promise<CommonTypeResponse> => {
    return new Promise(async (resolve) => {
      const user = await this.userModel.find(user_id);
      if (!user) {
        return resolve({
          data: [],
          statusCode: 200,
        });
      }
      const sharingPurposes = await this.commonTypeModel.getAllByRelationAndType(
        user.relation_id ?? '',
        COMMON_TYPES.SHARING_PURPOSE
      );
      return resolve({
        data: sharingPurposes,
        statusCode: 200,
      });
    });
  };
}
