const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
const tiscAdminToken = process.env.TEST_TISC_ADMIN_TOKEN;
const designToken = process.env.TEST_DESIGN_TOKEN;
const brandToken = process.env.TEST_BRAND_TOKEN;
const { Database } = require("arangojs");
const db = new Database({
  url: process.env.DATABASE_HOSTNAME,
});
db.useDatabase(process.env.DATABASE_NAME || "");
db.useBasicAuth(process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD);
const Jwt = require("@hapi/jwt");
const chaiResponse = (
  res,
  done,
  status = 400,
  properties = ["error", "message"],
  keys = [],
  callback
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
};

const insertTempData = async (collection, data) => {
  const response = await db.collection(collection).save(data, {waitForSync: true, returnNew: true});
  return response.new;
}

const removeByKeys = (collection, keys) => {
  return db.collection(collection).removeByKeys(keys, {waitForSync: true, returnNew: true})
}

const signJwtToken = (user_id) => {
  return Jwt.token.generate(
    {
      aud: "urn:audience:test",
      iss: "urn:issuer:test",
      user_id,
    },
    {
      key: "aU7h3GiHb2o8H!q!ndwSqYqh&K$LCeyI",
      algorithm: "HS512",
    },
    {
      ttlSec: 2592000,
    }
  );
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
  designToken,
  brandToken,
  insertTempData,
  removeByKeys,
  signJwtToken,
};
