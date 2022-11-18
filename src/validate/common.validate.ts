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

const getDefaultGetListQueryCustom = (value: any) => ({
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
    ...getDefaultGetListQueryCustom(value),
    ...options?.custom?.(value, helpers),
  })),
});

export const getOneValidation = {
  params: {
    id: Joi.string().required().error(errorMessage("Id can not be empty")),
  },
};

export const requireStringValidation = (fieldName: string, full?: "full") =>
  Joi.string()
    .trim()
    .required()
    .error(
      errorMessage(full === "full" ? fieldName : `${fieldName} is required`)
    );
export const stringValidation = () => Joi.string().trim();
export const numberValidation = () => Joi.number();

export const requireEmailValidation = (fieldName: string = "Email") =>
  Joi.string()
    .required()
    .error(errorMessage(`${fieldName} is required`))
    .email()
    .error(errorMessage(`${fieldName} is invalid`));

const regexPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#^()+=~`{}|/:;‘“<>[,.-])[A-Za-z\d@$!%*?&_#^()+=~`{}|/:;’“<>[,.-]{8,}$/;

export const requirePasswordValidation = Joi.string()
  .required()
  .regex(regexPassword)
  .error(errorMessage("Password is required and valid"));

export const requireNumberValidation = (fieldName: string, full?: "full") =>
  Joi.number()
    .required()
    .error(
      errorMessage(full === "full" ? fieldName : `${fieldName} is required`)
    );

export const requireBooleanValidation = (fieldName: string, full?: "full") =>
  Joi.boolean()
    .required()
    .error(
      errorMessage(full === "full" ? fieldName : `${fieldName} is required`)
    );

export const requireBookingDateValidation = (minDate: number, maxDate: number) =>
  Joi.date()
    .max(moment().add(maxDate, "days").format('YYYY-MM-DD'))
    .min(moment().add(minDate, "days").format('YYYY-MM-DD'))
    .required()
    .error(
      errorMessage(`A date must be have format YYYY-MM-DD and between ${minDate == 0 ? 'today' : minDate} with ${maxDate} next days`)
    );


