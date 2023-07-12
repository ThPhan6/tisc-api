export const toRecommendCollections = (collections: any) => {
  return collections.map((collection: any) => {
    return {
      id: collection.id,
      name: collection.name,
    };
  });
};
