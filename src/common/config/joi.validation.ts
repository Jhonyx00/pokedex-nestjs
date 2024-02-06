import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  MONGODB: Joi.required(),
  PORT: Joi.number().default(3005), // default is to set a default value
  DEFAULT_LIMIT: Joi.number().default(6), //if env variable does not exist, create one with value of 6
});
