const router   = require('express').Router();
const jwt      = require('jsonwebtoken');
const User     = require('../models/user');
const { RegisterValidation,
       LoginValidation } =  require('./validation');
const bcrypt   = require('bcryptjs')
const Joi      = require('@hapi/joi');

const schema   = Joi.object({
	name : Joi.string().min(6).required(),
	email : Joi.string().min(6).required().email(),
	password : Joi.string().min(6).required()
})

router.post('/register',async(req,resp)=>{
	//resp.send('User Register');

const {error}  = await RegisterValidation(req.body)
	// resp.send(error.details[0].message)
	if(error){
			return resp.status(404).send(error.details[0].message)

	}
     const emailExit  =await User.findOne({email:req.body.email})
     console.log
     if(emailExit) return resp.status(404).send('Email Alreday exit')
     
	try{
		const salt  = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.hash(req.body.password,salt);
		const user  = new User({
				name: req.body.name,
				email: req.body.email,
				password: hashPassword
     	});
        let save   = await user.save();
        resp.status(200).send({user:user._id})
	}catch(err){

		resp.status(404).send('Data aBase error')

	}
})

router.post('/login',async (req,resp)=>{
	const { error } = await LoginValidation(req.body)
	// resp.send(error.details[0].message)
	if(error){
			return resp.status(404).send(error.details[0].message)

	}
     const emailExit  =await User.findOne({email:req.body.email})
     console.log(emailExit);
     if(!emailExit)
     {
     	return resp.status(400).send('Email does not exit')
     } else{
     	//const salt  = await bcrypt.genSalt(10);
		const hashPassword = await bcrypt.compare(req.body.password,emailExit.password);

		if(!hashPassword) return resp.status(400).send('Wrong Password')
          
          const token = jwt.sign({_id:emailExit._id},'basdvjvwueyunzxmcnjhavsd');
        
		return resp.header('auth-token',token).status(200).send('Successfully Login'+token)
		
     }
    
})

module.exports = router