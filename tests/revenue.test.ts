import { connection } from "@/Database/Connections/ArangoConnection";
import { signJwtToken } from "@/helper/jwt.helper";
import { imageTest_4 } from "./temp-files/image.test";

import {
  brandData,
  brandLocationData,
  userBrandData,
  brandDistributorData,
} from "./temp-data/brand";
import { tiscAdminData } from "./temp-data/user";
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
import {
  ProductConsiderStatus,
  ProductSpecifyStatus,
} from "../src/api/project_product/project_product.type";

import { expect } from "chai";

describe("Revenue", () => {
  let tiscAdmin = {
    user: {},
    token: "",
  };
  let locationId = "";
  let teamProfileId = "";
  let materialCodeId = "";
  let projectProductId = "";
  let template_id = "";
  let trackingConsiderNotification = "";
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
    tiscAdmin.user = await connection.insert("users", tiscAdminData);
    tiscAdmin.token = signJwtToken(tiscAdminData.id);
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

  describe("Revene", () => {
    describe("Create revenue", () => {
      it("Incorrect payload", async () => {
        (
          await apiService
            .getInstance()
            .setToken(tiscAdmin.token)
            .post(`/api/invoice`, {
              service_type_id: "string",
              brand_id: "string",
              ordered_by: "string",
              unit_rate: 0,
              quantity: 0,
              tax: 0,
              remark: "string",
            })
        ).shouldError();
      });
      it("Correct payload", async () => {
        (
          await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .post(`/api/invoice`, {
            service_type_id: "string",
            brand_id: brand.company.id,
            ordered_by: brand.user.id,
            unit_rate: 1,
            quantity: 1,
            tax: 0,
            remark: "string",
          })
        ).shouldSuccess();
      });
     
    });
  });

  
});
