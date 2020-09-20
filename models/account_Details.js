const mongoose  = require('mongoose');

const accountSchema = new mongoose.Schema({
	AccountId:{
		type:Number,
		required:true,
		unique:true,
		 min: 1000,
         max: 999999999
	},
	AccountType:{
		type:String,
		required:true,
		min:6,
		max:255
	},
	UserName:{
		type:String,
		required:true,
		default:'',
	},
	Amount:{
		type:Number,
		required:true,
		default:0,
	

	},
	date:{
		type:Date,
		default: Date.now
	}
	

});

module.exports = mongoose.model('Account',accountSchema)

