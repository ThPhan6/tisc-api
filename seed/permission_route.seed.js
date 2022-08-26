const ROUTES = require("./constant").ROUTES;

const seed = async (db) => {
  const routeCollection = await db.collection("permission_routes");
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();

    const keys = Object.keys(ROUTES);
    const records = keys.map((key, index) => {
      return {
        id: (index + 1).toString(),
        route: ROUTES[key],
      };
    });

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "permission_routes",
        },
      });
    });
    console.log("success seed permission route data");
  };
  try {
    await createAndSeed(routeCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await routeCollection.drop();
      await createAndSeed(routeCollection);
    }
  }
};

module.exports = {
  seed,
};
