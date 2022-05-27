import * as HapiJoi from '@hapi/joi';
const Joi = HapiJoi.defaults(schema => schema.options({
    abortEarly: false,
}));

export default {
    login: Joi.object({
        token: Joi.string(),
        message: Joi.string(),
        statusCode: Joi.number(),
    }) as any,
    forgotPassword: Joi.object({
        reset_password_token: Joi.string(),
        message: Joi.string(),
        statusCode: Joi.number(),
    }) as any,
};
