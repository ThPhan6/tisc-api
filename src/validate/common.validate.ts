import * as Joi from "joi";

export const customFilter = (value: any, helpers: any) => {
  try {
    const filter = JSON.parse(decodeURIComponent(value));
    if (typeof filter === "object") {
      return filter;
    }
    return helpers.error("any.invalid");
  } catch (error) {
    return helpers.error("any.invalid");
  }
};

export const commonFailValidatedMessageFunction = (message: string) => {
  return new Error(message);
};

export const orderValidation = Joi.string().valid("ASC", "DESC");

const defaultGetListQueryValidation: Joi.PartialSchemaMap<any> = {
  filter: Joi.string()
    .custom((value, helpers) => {
      return customFilter(value, helpers);
    }, "custom filter validation")
    .error(commonFailValidatedMessageFunction("Invalid filter")),
};

const defaultGetListWithSortingQueryValidation: Joi.PartialSchemaMap<any> = {
  ...defaultGetListQueryValidation,
  sort: Joi.string(),
  order: Joi.string().valid("ASC", "DESC"),
};

const getDefaultGetListQueryCustom = (value: any) => ({
  filter: value.filter,
  sort: value.sort || "created_at",
  order: value.order || "DESC",
});

export const getAllValidation = (
  query?: Joi.PartialSchemaMap<any>,
  custom?: Joi.CustomValidator<any>
) => ({
  query: Joi.object({
    ...defaultGetListWithSortingQueryValidation,
    ...query,
  }).custom((value, helpers) => ({
    ...getDefaultGetListQueryCustom(value),
    ...custom?.(value, helpers),
  })),
});

export const getListValidation = (options?: {
  query?: Joi.PartialSchemaMap<any>;
  custom?: Joi.CustomValidator<any>;
  noSorting?: boolean;
}) => ({
  query: Joi.object({
    page: Joi.number()
      .min(1)
      .custom((value, helpers) => {
        if (!Number.isInteger(value)) return helpers.error("any.invalid");
        return value;
      })
      .error(commonFailValidatedMessageFunction("Page must be an integer")),
    pageSize: Joi.number()
      .min(1)
      .custom((value, helpers) => {
        if (!Number.isInteger(value)) return helpers.error("any.invalid");
        return value;
      })
      .error(
        commonFailValidatedMessageFunction("Page Size must be an integer")
      ),

    ...(options?.noSorting
      ? defaultGetListQueryValidation
      : defaultGetListWithSortingQueryValidation),

    ...options?.query,
  }).custom((value, helpers) => ({
    ...value,
    limit: !value.page || !value.pageSize ? 10 : value.pageSize,
    offset:
      !value.page || !value.pageSize ? 0 : (value.page - 1) * value.pageSize,
    ...getDefaultGetListQueryCustom(value),
    ...options?.custom?.(value, helpers),
  })),
});

export const getOneValidation = {
  params: {
    id: Joi.string()
      .required()
      .error(commonFailValidatedMessageFunction("Id can not be empty")),
  },
};

export const requireStringValidation = (fieldName: string, full?: "full") =>
  Joi.string()
    .trim()
    .required()
    .error(
      commonFailValidatedMessageFunction(
        full === "full" ? fieldName : `${fieldName} is required`
      )
    );

export const requireEmailValidation = (fieldName: string = "Email") =>
  Joi.string()
    .email()
    .required()
    .error(commonFailValidatedMessageFunction(`${fieldName} is required`));

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()+=~`{}|/:;‘“<>[,.-])[A-Za-z\d@$!%*?&_#^()+=~`{}|/:;’“<>[,.-]{8,}$/;

export const requirePasswordValidation = Joi.string()
  .required()
  .regex(regexPassword)
  .error(commonFailValidatedMessageFunction("Password is required and valid"));

export const requireNumberValidation = (fieldName: string, full?: "full") =>
  Joi.number()
    .required()
    .error(
      commonFailValidatedMessageFunction(
        full === "full" ? fieldName : `${fieldName} is required`
      )
    );

export const requireBooleanValidation = (fieldName: string, full?: "full") =>
  Joi.boolean()
    .required()
    .error(
      commonFailValidatedMessageFunction(
        full === "full" ? fieldName : `${fieldName} is required`
      )
    );
