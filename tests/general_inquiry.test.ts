import { insertTempData, removeByKeys } from "./helpers/database.helper";
import { signJwtToken } from "../src/helper/jwt.helper";
import {
  brandData,
  brandLocationData,
  userBrandData,
  brandDistributorData,
} from "./temp-data/brand";
import { productData } from "./temp-data/product";
import {
  generalData,
  featureData,
  specificationData,
} from "./temp-data/attribute";
import { optionData, conversionData } from "./temp-data/basis";
import { categoryData } from "./temp-data/category";
import { collectionData } from "./temp-data/collection";
import { projectData, zonesData } from "./temp-data/project";
import {
  designFirmData,
  designFirmLocationData,
  userDesignFirmData,
} from "./temp-data/design-firm";
import { apiService } from "./helpers/api.helper";

describe("General Inquiry", () => {
  let generalInquiry: any;
  let brand = {
    company: {},
    location: {},
    distributor: {},
    user: {},
    token: "",
  } as any;
  let design = {
    company: {},
    location: {},
    user: {},
    token: "",
  } as any;
  let product = {
    data: {},
    category: {},
    collection: {},
    attribute: {
      general: {},
      feature: {},
      specification: {},
    },
    basis: {
      option: {},
      conversion: {},
    },
  } as any;
  let project = {
    data: {},
    zones: {},
  } as any;

  before(async () => {
    /// = BRAND
    brand.company = await insertTempData("brands", brandData);
    brand.location = await insertTempData("locations", brandLocationData);
    brand.distributor = await insertTempData(
      "distributors",
      brandDistributorData
    );
    brand.user = await insertTempData("users", userBrandData);
    brand.token = signJwtToken(brand.user.id);
    /// DESIGN FIRM
    design.company = await insertTempData("designers", designFirmData);
    design.location = await insertTempData("locations", designFirmLocationData);
    design.user = await insertTempData("users", userDesignFirmData);
    design.token = signJwtToken(design.user.id);
    /// PRODUCT
    product.data = await insertTempData("products", productData);
    product.category = await insertTempData("categories", categoryData);
    product.collection = await insertTempData("collections", collectionData);
    product.attribute.general = await insertTempData("attributes", generalData);
    product.attribute.feature = await insertTempData("attributes", featureData);
    product.attribute.specification = await insertTempData(
      "attributes",
      specificationData
    );
    product.basis.option = await insertTempData("bases", optionData);
    product.basis.conversion = await insertTempData("bases", conversionData);
    // PROJECT
    project.data = await insertTempData("projects", projectData);
    project.zones = await insertTempData("project_zones", zonesData);
    //
  });

  after(async () => {
    ///
    await removeByKeys("brands", [brand.company._key]);
    await removeByKeys("designers", [design.company._key]);
    await removeByKeys("distributors", [brand.distributor._key]);
    ///
    await removeByKeys("locations", [
      brand.location._key,
      design.location._key,
    ]);
    await removeByKeys("users", [brand.user._key, design.user._key]);

    await removeByKeys("products", [product.data._key]);
    await removeByKeys("categories", [product.category._key]);
    await removeByKeys("collections", [product.collection._key]);
    await removeByKeys("attributes", [
      product.attribute.general._key,
      product.attribute.feature._key,
      product.attribute.specification._key,
    ]);
    await removeByKeys("bases", [
      product.basis.option._key,
      product.basis.conversion._key,
    ]);
    await removeByKeys("projects", [project.data._key]);
    await removeByKeys("project_zones", [project.zones._key]);
  });

  describe("General Inquiry", () => {
    describe("Create project request", () => {
      it("Incorrect payload inputs", async () => {
        (
          await apiService
            .getInstance()
            .setToken(design.token)
            .post(`/project-tracking/request/create`, {
              title: "TISC",
              message: "TISC",
              request_for_ids: ["request_for"],
            })
        ).shouldError();
      });
      it("Correct payload inputs", async () => {
        const response = await apiService
          .getInstance()
          .setToken(design.token)
          .post(`/project-tracking/request/create`, {
            product_id: product.data.id,
            project_id: project.data.id,
            title: "TISC",
            message: "TISC",
            request_for_ids: ["request_for"],
          });
        // inquiry = response.get();
        response.shouldSuccess();
      });
    });
  });
});
