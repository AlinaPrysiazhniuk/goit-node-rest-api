import Joi from "joi";

export const registerSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});

export const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required(),
});
