export const isDuplicatedString = (values: string[]) => {
  const check = values.some(function (item, idx) {
    return values.indexOf(item) != idx;
  });
  return check;
};

export const sortObjectArray = (
  values: any[],
  field: string,
  order: "ASC" | "DESC"
) => {
  if (order === "ASC") {
    return values.sort((a, b) =>
      a[field] > b[field] ? 1 : b[field] > a[field] ? -1 : 0
    );
  }
  return values.sort((a, b) =>
    a[field] > b[field] ? -1 : b[field] > a[field] ? 1 : 0
  );
};
