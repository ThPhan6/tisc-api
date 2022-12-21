import { connection } from "@/Database/Connections/ArangoConnection";
import { signJwtToken } from "@/helper/jwt.helper";
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
import { ROUTES } from "@/constants/route.constant";
import { ActionTaskStatus } from "@/types";

describe("Project Tracking", () => {
  let productRequest: any;
  let productRequestTask: any;
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
    brand.company = await connection.insert("brands", brandData);
    brand.location = await connection.insert("locations", brandLocationData);
    brand.distributor = await connection.insert(
      "distributors",
      brandDistributorData
    );
    brand.user = await connection.insert("users", userBrandData);
    brand.token = signJwtToken(brand.user.id);
    /// DESIGN FIRM
    design.company = await connection.insert("designers", designFirmData);
    design.location = await connection.insert(
      "locations",
      designFirmLocationData
    );
    design.user = await connection.insert("users", userDesignFirmData);
    design.token = signJwtToken(design.user.id);
    /// PRODUCT
    product.data = await connection.insert("products", productData);
    product.category = await connection.insert("categories", categoryData);
    product.collection = await connection.insert("collections", collectionData);
    product.attribute.general = await connection.insert(
      "attributes",
      generalData
    );
    product.attribute.feature = await connection.insert(
      "attributes",
      featureData
    );
    product.attribute.specification = await connection.insert(
      "attributes",
      specificationData
    );
    product.basis.option = await connection.insert("bases", optionData);
    product.basis.conversion = await connection.insert("bases", conversionData);
    // PROJECT
    project.data = await connection.insert("projects", projectData);
    project.zones = await connection.insert("project_zones", zonesData);
    //
  });

  after(async () => {
    ///
    await connection.removeByKeys("brands", [brand.company._key]);
    await connection.removeByKeys("designers", [design.company._key]);
    await connection.removeByKeys("distributors", [brand.distributor._key]);
    ///
    await connection.removeByKeys("locations", [
      brand.location._key,
      design.location._key,
    ]);
    await connection.removeByKeys("users", [brand.user._key, design.user._key]);

    await connection.removeByKeys("products", [product.data._key]);
    await connection.removeByKeys("categories", [product.category._key]);
    await connection.removeByKeys("collections", [product.collection._key]);
    await connection.removeByKeys("attributes", [
      product.attribute.general._key,
      product.attribute.feature._key,
      product.attribute.specification._key,
    ]);
    await connection.removeByKeys("bases", [
      product.basis.option._key,
      product.basis.conversion._key,
    ]);
    await connection.removeByKeys("projects", [project.data._key]);
    await connection.removeByKeys("project_zones", [project.zones._key]);
  });

  describe("Create project request", () => {
    it("Incorrect payload inputs", async () => {
      (
        await apiService
          .getInstance()
          .setToken(design.token)
          .post(ROUTES.PROJECT_TRACKING.CREATE, {
            title: "TISC",
            message: "TISC",
            request_for_ids: ["Some purpose"],
          })
      ).shouldError();
    });
    it("Correct payload inputs", async () => {
      const response = await apiService
        .getInstance()
        .setToken(design.token)
        .post(ROUTES.PROJECT_TRACKING.CREATE, {
          product_id: product.data.id,
          project_id: project.data.id,
          title: "TISC",
          message: "TISC",
          request_for_ids: ["Some purpose"],
        });
      productRequest = response.get();
      response.shouldSuccess();
    });
  });

  describe("Get list project tracking", () => {
    it("Get list with parameter", async () => {
      (
        await apiService
          .getInstance()
          .setToken(design.token)
          .get(
            `${ROUTES.PROJECT_TRACKING.GET_LIST}?page=1&pageSize=10&sort=project_name&order=DESC`
          )
      ).shouldSuccess();
    });
    it("Get list without parameter", async () => {
      const response = await apiService
        .getInstance()
        .setToken(design.token)
        .get(`${ROUTES.PROJECT_TRACKING.GET_LIST}`);

      response.shouldSuccess();
    });
  });

  describe("Get project tracking detail", () => {
    it("Incorrect project tracking id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.PROJECT_TRACKING.GET_ONE.replace(
              "{id}",
              productRequest.project_tracking_id + "-123"
            )
          )
      ).shouldError(404);
    });
    it("Correct project tracking id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .get(
            ROUTES.PROJECT_TRACKING.GET_ONE.replace(
              "{id}",
              productRequest.project_tracking_id
            )
          )
      ).shouldSuccess();
    });
  });

  describe("Get project tracking summary", () => {
    it("Correct data response", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .get(ROUTES.PROJECT_TRACKING.GET_SUMMARY)
      ).shouldSuccess();
    });
  });

  describe("Update project tracking", () => {
    it("Incorrect project tracking id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.PROJECT_TRACKING.UPDATE.replace(
              "{id}",
              productRequest.project_tracking_id + "_123"
            ),
            {
              priority: 0,
              assigned_teams: ["string"],
              read_by: ["string"],
            }
          )
      ).shouldError();
    });
    it("Correct project tracking id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.PROJECT_TRACKING.UPDATE.replace(
              "{id}",
              productRequest.project_tracking_id
            ),
            {
              priority: 1,
              assigned_teams: ["string"],
              read_by: ["string"],
            }
          )
      ).shouldSuccess();
    });
    it("Incorrect payload inputs", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.PROJECT_TRACKING.UPDATE.replace(
              "{id}",
              productRequest.project_tracking_id
            ),
            {
              read_by: [1],
            }
          )
      ).shouldError();
    });
    it("Correct payload inputs", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.PROJECT_TRACKING.UPDATE.replace(
              "{id}",
              productRequest.project_tracking_id
            ),
            {
              priority: 1,
              assigned_teams: ["string"],
              read_by: ["string"],
            }
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
          model_id: productRequest.id,
          model_name: "request",
        });
      productRequestTask = response.get();
      response.shouldSuccess(true);
    });
  });

  describe("Update action task status", () => {
    it("Incorrect action task id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.PROJECT_TRACKING.UPDATE.replace(
              "{id}",
              productRequestTask.id + "_123"
            ),
            { status: ActionTaskStatus["In Progress"] }
          )
      ).shouldError();
    });
    it("Correct action task id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(brand.token)
          .patch(
            ROUTES.ACTION_TASK.UPDATE.replace("{id}", productRequestTask.id),
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
            ROUTES.ACTION_TASK.UPDATE.replace("{id}", productRequestTask.id),
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
            ROUTES.ACTION_TASK.UPDATE.replace("{id}", productRequestTask.id),
            { status: ActionTaskStatus["In Progress"] }
          )
      ).shouldSuccess();
    });
  });
});
