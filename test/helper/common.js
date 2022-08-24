const dotenv = require("dotenv");
dotenv.config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const should = chai.should();
chai.use(chaiHttp);
const HOST_URL = process.env.API_URL;
function designBrandLogin(email, password) {
  return new Promise((resolve) => {
    chai
      .request(HOST_URL)
      .post("/auth/brand-design/login")
      .send({
        email: email,
        password: password,
      })
      .end((_err, res) => {
        resolve(res.body.token);
      });
  });
}

module.exports = {
  designBrandLogin,
};
