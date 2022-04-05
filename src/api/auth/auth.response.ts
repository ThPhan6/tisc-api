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
        resetPasswordToken: Joi.string(),
        message: Joi.string(),
        statusCode: Joi.number(),
    }) as any,
};
