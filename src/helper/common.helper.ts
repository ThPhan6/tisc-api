export const isDuplicatedString = (values: string[]) => {
  return values.some(function (item, idx) {
    return values.indexOf(item) != idx;
  });
};

export const sortObjectArray = (
  values: any[],
  field: string,
  order: "ASC" | "DESC"
) => {
  const compare = (a: any, b: any) => {
    if (order === "ASC") {
      if (a[field] < b[field]) {
        return -1;
      }
      if (a[field] > b[field]) {
        return 1;
      }

      return 0;
    }
    if (a[field] < b[field]) {
      return 1;
    }
    if (a[field] > b[field]) {
      return -1;
    }
    return 0;
  };
  return values.sort(compare);
};
