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
import { ROUTES } from "../src/constants/route.constant";
import { ActionTaskStatus } from "../src/types/action_task.type";

describe("General Inquiry", () => {
  let inquiry: any;
  let inquiryTask: any;
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

  describe("Create Inquiry request", () => {
    it("Incorrect payload inputs", async () => {
      (
        await apiService
          .getInstance()
          .setToken(design.token)
          .post(ROUTES.GENERAL_INQUIRY.CREATE, {
            "product_id": "ABC",
            "title":"What is this product for ?",
            "message":"Hello Enable",
            "inquiry_for_ids":["ABC"]
          })
      ).shouldError(404);
    });
    it("Correct payload inputs", async () => {
      const response = await apiService
        .getInstance()
        .setToken(design.token)
        .post(ROUTES.GENERAL_INQUIRY.CREATE, {
          "product_id": product.data.id,
          "title":"What is this product for ?",
          "message":"Hello Enable",
          "inquiry_for_ids":["ABC"]
        });
      inquiry = response.get();
      response.shouldSuccess();
    });
  });

  describe("Get List Inquiry request", () => {
    it("Get List Without pagination", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .get(ROUTES.GENERAL_INQUIRY.GET_LIST)
      ).shouldSuccess();
    });
    it("Get List pagination", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .get(`${ROUTES.GENERAL_INQUIRY.GET_LIST}?page=1&pageSize=10`)
      ).shouldSuccess();
    });
  });
  describe("Get Inquiry Summary", () => {
    it("Get Inquiry Summary", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .get(ROUTES.GENERAL_INQUIRY.SUMMARY)
      ).shouldSuccess();
    });
    it("Get List pagination", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .get(`${ROUTES.GENERAL_INQUIRY.GET_LIST}?page=1&pageSize=10`)
      ).shouldSuccess();
    });
  });

  describe("Get Inquiry request detail", () => {
    it("Incorrect ID", async () => {
      (await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.GENERAL_INQUIRY.GET_ONE.replace(
              "{id}",
              inquiry.id + "_123"
            )
          )
      ).shouldError(404);
    });
    it("Correct ID", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.GENERAL_INQUIRY.GET_ONE.replace(
              "{id}",
              inquiry.id
            )
          )
      ).shouldSuccess();
    });
  });

  describe("Create action task for an inquiry request", () => {
    it("Incorrect payload inputs", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .post(ROUTES.ACTION_TASK.CREATE, {
            common_type_ids: ["Some action"],
          })
      ).shouldError();
    });
    it("Correct payload inputs", async () => {
      const response = await apiService
        .getInstance()
        .setToken(brand.token)
        .post(ROUTES.ACTION_TASK.CREATE, {
          common_type_ids: ["Some action"],
          model_id: inquiry.id,
          model_name: "inquiry",
        });
      inquiryTask = response.get();
      response.shouldSuccess();
    });
  });

  describe("Update action task status", () => {
    it("Incorrect action task id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.ACTION_TASK.UPDATE.replace(
              "{id}",
              inquiryTask.id + "_123"
            ),
            { status: ActionTaskStatus["In Progress"] }
          )
      ).shouldError(404);
    });
    it("Correct action task id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.ACTION_TASK.UPDATE.replace("{id}", inquiryTask.id),
            { status: ActionTaskStatus["In Progress"] }
          )
      ).shouldSuccess();
    });
    it("Incorrect payload inputs", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.ACTION_TASK.UPDATE.replace("{id}", inquiryTask.id),
            { status: 99 }
          )
      ).shouldError();
    });
    it("Correct payload inputs", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.ACTION_TASK.UPDATE.replace("{id}", inquiryTask.id),
            { status: ActionTaskStatus["In Progress"] }
          )
      ).shouldSuccess();
    });
  });

  describe("Get list action task", () => {
    it("Correct data response", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .get(`${ROUTES.ACTION_TASK.GET_LIST}?model_id=${inquiryTask.id}&model_name=inquiry`)
      ).shouldSuccess();
    });
  });

});
