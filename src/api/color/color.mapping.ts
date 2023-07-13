import _ from "lodash";

export const toRecommendCollections = (collections: any) => {
  return _.uniqBy(collections, "id").map((collection: any) => {
    return {
      id: collection.id,
      name: collection.name,
    };
  });
};
