import Joi from "joi";
import moment from "moment";

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

export const errorMessage = (message: string) => new Error(message);

export const orderValidation = Joi.string().valid("ASC", "DESC");

const defaultGetListQueryValidation: Joi.PartialSchemaMap<any> = {
  filter: Joi.string()
    .custom((value, helpers) => {
      return customFilter(value, helpers);
    }, "custom filter validation")
    .error(errorMessage("Invalid filter")),
};

const defaultGetListWithSortingQueryValidation: Joi.PartialSchemaMap<any> = {
  ...defaultGetListQueryValidation,
  sort: Joi.string(),
  order: Joi.string().valid("ASC", "DESC"),
};
const defaultSortCreatedAt = ["bill_services", "designer_brand_products"];
const getDefaultGetListQueryCustom = (value: any, list_type?: string) => ({
  sort:
    value.sort ||
    (list_type && defaultSortCreatedAt.includes(list_type)
      ? "created_at"
      : "name"),
  order:
    value.order ||
    (list_type && defaultSortCreatedAt.includes(list_type) ? "DESC" : "ASC"),
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
  params?: Joi.PartialSchemaMap<any>;
  custom?: Joi.CustomValidator<any>;
  noSorting?: boolean;
  listType?: string;
}) => ({
  query: Joi.object({
    page: Joi.number()
      .min(1)
      .custom((value, helpers) => {
        if (!Number.isInteger(value)) return helpers.error("any.invalid");
        return value;
      })
      .error(errorMessage("Page must be an integer")),
    pageSize: Joi.number()
      .min(1)
      .custom((value, helpers) => {
        if (!Number.isInteger(value)) return helpers.error("any.invalid");
        return value;
      })
      .error(errorMessage("Page Size must be an integer")),

    ...(options?.noSorting
      ? defaultGetListQueryValidation
      : defaultGetListWithSortingQueryValidation),

    ...options?.query,
  }).custom((value, helpers) => ({
    ...value,
    limit: !value.page || !value.pageSize ? 10 : value.pageSize,
    offset:
      !value.page || !value.pageSize ? 0 : (value.page - 1) * value.pageSize,
    ...getDefaultGetListQueryCustom(value, options?.listType),
    ...options?.custom?.(value, helpers),
  })),
  params: options?.params,
});

export const getOneValidation = {
  params: {
    id: Joi.string().required().error(errorMessage("Id can not be empty")),
  },
};

export const stringValidation = () => Joi.string().trim().allow("", null);
export const numberValidation = () => Joi.number().allow(null);

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()+=~`{}|/:;‘“<>[,.-])[A-Za-z\d@$!%*?&_#^()+=~`{}|/:;’“<>[,.-]{8,}$/;
const regexNormalCharacter = /^[A-Za-z0-9 ]+$/;

const getRegexMessage = (regex?: string) => {
  if (!regex) {
    return "is not valid";
  }
  if (regexNormalCharacter.toString() === regex) {
    return "is only allowed UPPERCASE, lowercase, spaces, and numbers";
  }
  return `does not match with pattern ${regex}`;
};

export const requirePasswordValidation = Joi.string()
  .required()
  .regex(regexPassword)
  .error(
    errorMessage(
      "Password must contain at least 8 characters, including UPPERCASE, lowercase, symbols and numbers"
    )
  );

// export const requireNumberValidation = (fieldName: string, full?: "full") =>
//   Joi.number()
//     .required()
//     .error(
//       errorMessage(full === "full" ? fieldName : `${fieldName} is required`)
//     );

export const requireBooleanValidation = (fieldName: string, full?: "full") =>
  Joi.boolean()
    .required()
    .error(
      errorMessage(full === "full" ? fieldName : `${fieldName} is required`)
    );

export const requireDateValidation = (minDate: number, maxDate: number) =>
  Joi.date()
    .max(moment().startOf("day").add(maxDate, "days").format("YYYY-MM-DD"))
    .min(moment().startOf("day").add(minDate, "days").format("YYYY-MM-DD"))
    .required()
    .error(
      errorMessage(
        `A date must be have format YYYY-MM-DD and between ${
          minDate == 0 ? "today" : minDate
        } with ${maxDate} next days`
      )
    )
    .custom((value) => {
      return moment(value).format("YYYY-MM-DD");
    });

type ErrorLocalState = {
  label: string;
  limit?: number;
  value?: number;
};
export const customErrorMessages = (local: any) => {
  const { label, regex } = local;
  return {
    "any.required": `${label} is required`,
    "string.base": `${label} is required`,
    "string.empty": `${label} is required`,
    "string.email": `${label} is invalid`,
    "string.domain": `${label} is invalid`,
    "string.uri": `${label} is invalid`,
    "string.guid": `${label} is invalid`,
    "string.pattern.base": `${label} ${getRegexMessage(regex?.toString())}`,
    "number.base": `${label} is required`,
    "number.positive": `${label} must be greater than or equal to zero`,
  } as Record<string, string>;
};
export const getCustomErrorMessage = (code: string, local: ErrorLocalState) =>
  customErrorMessages(local)?.[code];

export const requireStringValidation = (
  fieldName: string,
  customMessage?: string,
  isNormalCharacter: boolean = false
) => {
  let validation = Joi.string().trim().required();
  if (isNormalCharacter) {
    validation = validation.regex(regexNormalCharacter);
  }
  return validation.error((errors: any) => {
    errors[0].local.label = fieldName;
    const message =
      customMessage || getCustomErrorMessage(errors[0].code, errors[0].local);
    return message ? Error(message) : errors[0];
  });
};

export const requireEmailValidation = (
  fieldName: string = "Email",
  customMessage?: string
) => {
  return Joi.string()
    .trim()
    .required()
    .email()
    .lowercase()
    .error((errors: any) => {
      errors[0].local.label = fieldName;
      const message =
        customMessage || getCustomErrorMessage(errors[0].code, errors[0].local);
      return message ? Error(message) : errors[0];
    });
};

export const requireNumberValidation = (fieldName: string) => {
  return Joi.number()
    .required()
    .error((errors: any) => {
      errors[0].local.label = fieldName;
      const customMessage = getCustomErrorMessage(
        errors[0].code,
        errors[0].local
      );
      return customMessage ? Error(customMessage) : errors[0];
    });
};
