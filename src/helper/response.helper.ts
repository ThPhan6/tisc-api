import Joi from "joi";

export const validationMessageResponse = Joi.object({
  statusCode: Joi.number(),
  message: Joi.string(),
  errors: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      message: Joi.string(),
    })
  ),
  error: Joi.any(),
  validation: Joi.any(),
}) as any;

export const generalMessageResponse = Joi.object({
  statusCode: Joi.number(),
  message: Joi.string(),
}) as any;

export const ErrorMessageResponse = Joi.object({
  statusCode: Joi.number(),
  message: Joi.string(),
  error: Joi.string(),
}) as any;

export const defaultRouteOptionResponseStatus = {
  400: validationMessageResponse,
  401: ErrorMessageResponse,
  500: ErrorMessageResponse,
};

export const statuses = Joi.array().items({
  key: Joi.string(),
  value: Joi.number(),
});

export const errorMessageResponse = (
  message: string = '',
  statusCode: 400 | 401 | 403 | 404 = 400,
) => {
  return { message, statusCode };
}
export const successMessageResponse = ( message: string = '' ) => {
  return { message, statusCode: 200 };
}
export const successResponse = (res: {[key: string]: any} = {}) => {
  return { ...res, statusCode: 200 };
}
