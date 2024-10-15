const Joi = require("joi");
const validate = (user) => {
    const ValidationControl = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        repassword:Joi.string().required(),
    });
  
    return ValidationControl.validate(user);
};

module.exports = {  validate };