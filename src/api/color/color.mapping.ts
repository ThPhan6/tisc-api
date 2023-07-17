import _ from "lodash";

export const toRecommendCollections = (collections: any) => {
  return _.uniqBy(collections, "id")
    .filter((item) => {
      if (_.isEmpty(item)) return false;
      else return true;
    })
    .map((collection: any) => {
      return {
        id: collection?.id,
        name: collection?.name,
      };
    });
};
