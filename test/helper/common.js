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

// async function insertCollection(brandId) {
//   return new Promise(resolve => {
//     const collection = await db.query({
//       query: `INSERT ({
//                   id : "${uuid()}",
//                   name: "Collection",
//                   brand_id: "${brandId}"
//                 }) INTO @@model RETURN NEW`,
//       bindVars: {
//         "@model": "collections",
//       },
//     });
//      resolve( collection._result[0].id);
//   })
// }

// (async function getBrandId() {
//   const brand = await db.query({
//     query: `FOR data in @@model return data`,
//     bindVars: {
//       "@model": "brands",
//     },
//   });
//   brandId = brand._result[0].id;
//   insertCollection(brandId);
//   return true;
// })();

module.exports = {
  designBrandLogin,
};
