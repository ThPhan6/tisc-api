const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
const { Database } = require("arangojs");
const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);

const chaiResponse = (
  res,
  done,
  status = 400,
  properties = ['error', 'message'],
  keys = [],
  callback,
) => {
  res.should.have.status(status);
  res.should.be.json;
  res.body.should.be.a("object");
  res.body.should.have.property("statusCode", status);
  properties.forEach((item) => {
    res.body.should.have.property(item);
  });
  if (keys.length > 0) {
    res.body.data.should.have.keys(...keys);
  }
  if (callback) {
    callback();
  } else {
    if (done) {
      done();
    }
  }
}
module.exports = {
  chaiResponse,
  chai,
  chaiHttp,
  should,
  HOST_URL,
  tiscAdminToken,
  Database,
  db,
}
