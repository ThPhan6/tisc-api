const uuid = require("uuid").v4;
const moment = require("moment");
const FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES =
  require("./constant").FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES;

const seed = async (db) => {
  const finishScheduleForCollection = await db.collection(
    "finish_schedules_for"
  );
  const createAndSeed = async (collection) => {
    await collection.create();
    await collection.get();
    const records = [
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Base @ Celling + Floor",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Base @ Celling",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Base @ Floor",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Cabinet Carcass + Door",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Cabinet Carcass",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Cabinet Door",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Celling Surface",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Door Frame + Door Panel",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Door Frame",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Door Panel",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Floor Surface",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Wall Surface",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Wall-East",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Wall-South",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Wall-West",
        created_at: moment(),
        design_id: "",
      },
      {
        ...FINISH_SCHEDULE_FOR_NULL_ATTRIBUTES,
        id: uuid(),
        name: "Wall-North",
        created_at: moment(),
        design_id: "",
      },
    ];

    records.forEach(async (record) => {
      await db.query({
        query: `insert ${JSON.stringify(record)} into @@model`,
        bindVars: {
          "@model": "finish_schedules_for",
        },
      });
    });
    console.log("success seed finish schedule for data");
  };
  try {
    await createAndSeed(finishScheduleForCollection);
  } catch (error) {
    if (error.message === "duplicate name") {
      await finishScheduleForCollection.drop();
      await createAndSeed(finishScheduleForCollection);
    }
  }
};

module.exports = {
  seed,
};
