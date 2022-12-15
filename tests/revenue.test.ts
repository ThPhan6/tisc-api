import { connection } from "@/Database/Connections/ArangoConnection";
import { signJwtToken } from "@/helper/jwt.helper";

import { brandData, brandLocationData, userBrandData } from "./temp-data/brand";
import { tiscAdminData } from "./temp-data/user";
import {
  outStandingInvoiceData,
  pendingInvoiceData,
} from "./temp-data/invoice";
import { apiService } from "./helpers/api.helper";

describe("Revenue", () => {
  let tiscAdmin = {
    user: {},
    token: "",
  } as any;
  let brand = {
    company: {},
    location: {},
    user: {},
    token: "",
  } as any;
  let notPendingInvoice = {} as any;
  let pendingInvoice = {} as any;
  let invoiceId = "";

  before(async () => {
    tiscAdmin.user = await connection.insert("users", tiscAdminData);
    tiscAdmin.token = signJwtToken(tiscAdminData.id);
    /// = BRAND
    brand.company = await connection.insert("brands", brandData);
    brand.location = await connection.insert("locations", brandLocationData);
    brand.user = await connection.insert("users", userBrandData);
    brand.token = signJwtToken(brand.user.id);

    notPendingInvoice = await connection.insert(
      "invoices",
      outStandingInvoiceData
    );
    pendingInvoice = await connection.insert("invoices", pendingInvoiceData);
  });

  after(async () => {
    ///
    await connection.removeByKeys("brands", [brand.company._key]);
    ///
    await connection.removeByKeys("locations", [brand.location._key]);
    await connection.removeByKeys("invoices", [notPendingInvoice._key]);
    await connection.removeByKeys("users", [
      brand.user._key,
      tiscAdmin.user._key,
    ]);
  });

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
      const response = await apiService
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
        });
      invoiceId = response.get("id");
      response.shouldSuccess();
    });
  });

  describe("Get one revenue", () => {
    it("Incorrect id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/invoice/${invoiceId}-123`)
      ).shouldError();
    });
    it("Incorrect id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/invoice/${invoiceId}`)
      ).shouldSuccess();
    });
  });
  describe("Get list revenue", () => {
    it("Get list without params", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/invoice`)
      ).shouldSuccess();
    });
    it("Get list with params", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/invoice?page=1&pageSize=10`)
      ).shouldSuccess();
    });
  });
  describe("Get summary", () => {
    it("Get summary", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .get(`/api/invoice/summary`)
      ).shouldSuccess();
    });
  });
  describe("Update revenue", () => {
    it("Incorrect payload", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .patch(`/api/invoice/${invoiceId}`, {
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
    it("Correct payload with pending status", async () => {
      const response = await apiService
        .getInstance()
        .setToken(tiscAdmin.token)
        .patch(`/api/invoice/${invoiceId}`, {
          service_type_id: "string",
          brand_id: brand.company.id,
          ordered_by: brand.user.id,
          unit_rate: 2,
          quantity: 1,
          tax: 0,
          remark: "string",
        });
      response.shouldSuccess();
    });
    it("Correct payload with not pending status", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .patch(`/api/invoice/${notPendingInvoice.id}`, {
            service_type_id: "string",
            brand_id: brand.company.id,
            ordered_by: brand.user.id,
            unit_rate: 2,
            quantity: 1,
            tax: 0,
            remark: "string",
          })
      ).shouldError();
    });
  });

  describe("Send bill to brand", () => {
    it("Incorrect id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .post(`/api/invoice/${invoiceId}-123/bill`)
      ).shouldError(404);
    });
    it("Correct id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .post(`/api/invoice/${invoiceId}/bill`)
      ).shouldSuccess();
    });
  });
  describe("Mark as paid", () => {
    it("Incorrect id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .post(`/api/invoice/${invoiceId}-123/paid`)
      ).shouldError(404);
    });
    it("Correct id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .post(`/api/invoice/${invoiceId}/paid`)
      ).shouldSuccess();
    });
  });

  describe("Delete revenue", () => {
    it("Incorrect id", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .delete(`/api/invoice/${invoiceId}-123/delete`)
      ).shouldError(404);
    });
    it("Correct id with pending status", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .delete(`/api/invoice/${pendingInvoice.id}/delete`)
      ).shouldSuccess();
    });
    it("Correct id with not pending status", async () => {
      (
        await apiService
          .getInstance()
          .setToken(tiscAdmin.token)
          .delete(`/api/invoice/${notPendingInvoice.id}/delete`)
      ).shouldError();
    });
  });
});
