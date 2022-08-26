const {
  chaiResponse, chai, chaiHttp,
  should, HOST_URL,
  Database, db,
} = require("./utils/utils");
const helperCommon = require("./helper/common");

describe("Landing Page Quotation & Policy", () => {

  it("Quotation", async () => {
    const res = await chai
      .request(HOST_URL)
      .get("/quotation/landing-page/get-list?page=1&pageSize=99999")
    chaiResponse(res, null, 200, ['data'], ['quotations', 'pagination']);
  });
  it("Policy & Cookie", async () => {
    const res = await chai
      .request(HOST_URL)
      .get("/documentation/get-list-policy")
    chaiResponse(res, null, 200, ['data'], []);
  });
});
