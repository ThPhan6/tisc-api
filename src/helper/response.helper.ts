import * as Joi from "joi";

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

export const errorMessageResponse = Joi.object({
  statusCode: Joi.number(),
  message: Joi.string(),
  error: Joi.string(),
}) as any;

export const defaultRouteOptionResponseStatus = {
  400: validationMessageResponse,
  401: errorMessageResponse,
  500: errorMessageResponse,
};

export const statuses = Joi.array().items({
  key: Joi.string(),
  value: Joi.number(),
});
