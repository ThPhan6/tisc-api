import { apiService } from "./helpers/api.helper";

import moment from "moment";

describe("Booking", () => {
  let bookingId = "";
  const bookingDate = moment().add(37, 'days').startOf('week').add(1, 'days').format('YYYY-MM-DD');
  describe("Get available schedule", () => {
    it("Date is weekend", async () => {
      (
        await apiService
          .getInstance()
          .get(
            `/api/booking/available-schedule?date=2022-12-12&timezone=America/Chicago`
          )
      ).shouldSuccess();
    });
    it("Normal date", async () => {
      (
        await apiService
          .getInstance()
          .get(
            `/api/booking/available-schedule?date=2022-12-12&timezone=America/Chicago`
          )
      ).shouldSuccess();
    });
  });
  describe("Create", () => {
    it("Incorrect payload", async () => {
      const response = await apiService
        .getInstance()
        .post(`/api/booking/create`, {
          brand_name: "string",
          website: "string",
          name: "string",
          date: "",
          email: "string",
          slot: "EightToNine",
          timezone: "",
        });
      response.shouldError();
    });
    it("Correct payload", async () => {
      const response = await apiService
        .getInstance()
        .post(`/api/booking/create`, {
          brand_name: "brand testing 1",
          website: "https://abc11.com",
          name: "brand testing 1",
          date: bookingDate,
          email: "string11@yopmail.com",
          slot: 5,
          timezone: "America/Chicago",
        });
      bookingId = response.get("id");
      response.shouldSuccess();
    });
  });

  describe("Get one", () => {
    it("Incorrect id", async () => {
      (
        await apiService.getInstance().get(`/api/booking/${bookingId}-123`)
      ).shouldError(404);
    });
    it("Correct id", async () => {
      (
        await apiService.getInstance().get(`/api/booking/${bookingId}`)
      ).shouldSuccess();
    });
  });
  describe("Update", () => {
    it("Incorrect payload", async () => {
      const response = await apiService
        .getInstance()
        .patch(`/api/booking/${bookingId}/re-schedule`, {
          brand_name: "string",
          website: "string",
          name: "string",
          date: "",
          email: "string",
          slot: "EightToNine",
          timezone: "",
        });
      response.shouldError();
    });
    it("Correct payload", async () => {
      const response = await apiService
        .getInstance()
        .patch(`/api/booking/${bookingId}/re-schedule`, {
          brand_name: "brand testing 1",
          website: "https://abc11.com",
          name: "brand testing 1",
          date: bookingDate,
          email: "string11@yopmail.com",
          slot: 5,
          timezone: "America/Chicago",
        });
      response.shouldSuccess();
    });
  });
  describe("Cancel", () => {
    it("Incorrect id", async () => {
      (
        await apiService
          .getInstance()
          .delete(`/api/booking/${bookingId}-123/cancel`)
      ).shouldError(404);
    });
    it("Correct id", async () => {
      (
        await apiService
          .getInstance()
          .delete(`/api/booking/${bookingId}/cancel`)
      ).shouldSuccess();
    });
  });
});
