
const Joi = require('@hapi/joi');


module.exports.RegisterValidation = (request)=>{


 const schema = Joi.object({
	name : Joi.string().min(6).required(),
	email : Joi.string().min(6).required().email(),
	password : Joi.string().min(6).required()
  })
  return schema.validate(request)

}


module.exports.LoginValidation = (request)=>{


 const schema = Joi.object({
	email : Joi.string().min(6).required().email(),
	password : Joi.string().min(6).required()
  })
  return schema.validate(request)

}
