const router   = require('express').Router();

const Account     = require('../models/account_Details');

router.get('/',(req,resp)=>{
     resp.render('transfer',{title:'Transfer Pages'})
})
router.post('/',async(req,resp)=>{

	const { fromAccountId,
        SeAccountType,
		    toAccountId,
         ReAccountType,
		     amount,
	    } = req.body
     console.log(req.body)
	     if(fromAccountId==toAccountId){
	       	return resp.status(404).send({errorCode:101,errorMessage : 'Amount Canot be transfer in Same account'})
	     }

        // validation for user account
        const SenAccountExit  = await Account.findOne({AccountId:fromAccountId, AccountType: SeAccountType})
        if(!SenAccountExit) return resp.status(404).send({errorCode:102,errorMessage : 'Invalid Sender Account'})

        //validate receiver Account
         const RecAccountExit =  await Account.findOne({AccountId:toAccountId,AccountType: ReAccountType})
         if(!RecAccountExit) return resp.status(404).send({errorCode:103,errorMessage : 'Invalid Receiver Account'})
        
	      
       
       if(SenAccountExit.Amount<amount){
       	 return resp.status(404).send({errorCode:104,errorMessage : 'Transaction Amount should be less then Account Balance'})
       }

       let SenAmount  =  parseFloat(SenAccountExit.Amount) - parseFloat(amount);
       let ReAmount   =  parseFloat(RecAccountExit.Amount) + parseFloat(amount);
              //console.log(SenAmount)
              console.log(ReAmount)

       if(RecAccountExit.AccountType==='BasicSavings' && ReAmount >50000){
         return resp.status(404).send({errorCode:105,errorMessage : ' BasicSavings amount not be exceeded 50,000 Rs'})

       }
      
            // Find the document that describes "legos"
            let query = { AccountId:fromAccountId,AccountType: SeAccountType };
            // Set some fields in that document
            let update = {
              "$set": {
                Amount: SenAmount,
               }
            };
            // Return the updated document instead of the original document
            let options = { returnNewDocument: true };

            Account.findOneAndUpdate(query, update, options)
               .then(updatedDocument => {
                if(updatedDocument) {
                //s  console.log(`Successfully updated document: ${updatedDocument}.`)
                } else {
                  console.log("No document matches the provided query.")
                }
               // return updatedDocument
              })                       
              .catch((err)=>{
                return resp.status(404).send({errorCode:106,errorMessage : ' Transaction Failed due to internal error1',err:err})
 
              })

    
            
            let query2 = { AccountId:toAccountId,AccountType: ReAccountType };
            // Set some fields in that document
            let update2 = {
              "$set": {
                  Amount: ReAmount,
               }
            };
            // Return the updated document instead of the original document
             let options2 = { returnNewDocument: true };
             Account.findOneAndUpdate(query2, update2, options2)
              .then(updatedDocument => {
                if(updatedDocument) {
                 // console.log(`Successfully updated document: ${updatedDocument}.`)
                } else {
                 // console.log("No document matches the provided query.")
                }
               // return updatedDocument
              })       
             .catch((err)=>{
               return resp.status(404).send({errorCode:107,errorMessage : ' Transaction Failed due to internal error'})
     
            })
        
                 const agg =await  Account.aggregate([{ $group: { _id: "$AccountId", total: { $sum: "$Amount" } } }]);
                 console.log(agg)
                const data =  agg.findIndex(x => x._id ==toAccountId);
                let Sum = agg[data].total
                 
       
           
       return resp.status(200).send({'newSrcBalance':SenAmount,'totalDestBalance':Sum,timestamp:new Date()})

    
})

router.post('/insert',async(req,resp)=>{
	   
       //console.log('this inserting')
		const account  = new Account({
				AccountId: req.body.AccountId,
				AccountType: req.body.AccountType,
				Amount:req.body.Amount
     	});
     	try{
        let save   = await account.save();
        resp.status(200).send({account_id:account})
        }catch(err){

		resp.status(404).send(err)

	}


})


router.get('/fetch',async(req,resp)=>{
	   
     
     	try{
        let account   = await Account.find({});
        resp.status(200).send(account)
        }catch(err){

		   resp.status(404).send(err)

       	}


})


module.exports = router