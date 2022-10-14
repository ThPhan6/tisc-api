const moment = require("moment");
const uuid = require("uuid").v4;
const templates = require("./jsons/template.json");

const seed = async (db) => {
  const collection = await db.collection("templates");
  const createAndSeed = async (model) => {
    await model.create();
    await model.get();
    const data = templates.reduce((res, template, currentIndex) => {
      const now = moment(); /// 2022-09-08 08:00:00;
      res.push({
        id: uuid(),
        ...template,
        sequence: currentIndex + 1,
        created_at: now,
        updated_at: now,
      })
      return res;
    }, []);

    data.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "templates",
        },
      });
    });
    console.log("success seed tisc template data");
  };
  try {
    await createAndSeed(collection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await collection.drop();
      await createAndSeed(collection);
    }
  }
};

module.exports = {
  seed,
};
