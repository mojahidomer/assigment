const router   = require('express').Router();
const jwt      = require('jsonwebtoken');

module.exports = {
	token_verification
}

function token_verification(req,resp,next){

  // const token_no = req.header
  //console.log(req.headers['auth-token']);
  const token = req.headers['auth-token'];
  if(!token) return resp.status(401).send('Access Denied')
  
  try {
        var decoded = jwt.verify(token, 'basdvjvwueyunzxmcnjhavsd');
        req.user    = decoded;
        next()
  }catch(err){
  	 return resp.status(401).send('Invalid Token')
  }
 
}