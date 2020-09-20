const express   = require('express');
const app       = express() //.Router();
const mongoose  = require('mongoose');
var bodyParser  = require('body-parser')
const  moneytransfer   = require('./routers/MoneyTransfer')

const Account     = require('./models/account_Details');

 
const db = require('./db_connection/key').mongooseURI;
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.json())
 
mongoose
  .connect(db,{useUnifiedTopology: true,
useNewUrlParser: true,})
  .then(()=>console.log('mongodb Connected..'))
  .catch(err=>console.log(err));


app.get('/',async(req,resp)=>{


     	try{
        let account   = await Account.find({});
        //console.log(account)
        // resp.status(200).send(account)
        	resp.render('home',{
	         	title:'Home Page',
	         	data:account,
	         	error:null,

	        })
        }catch(err){

		   resp.status(404).send(err)
		    

       	}


})

app.post('/',async(req,resp)=>{
	console.log(req.body)

		const account  = new Account({
				AccountId: req.body.AccountIds,
				AccountType: req.body.AccountType,
				UserName : req.body.username,
				Amount:req.body.Amount
     	});
     	let error = []
     	try{
         let save   = await account.save();
         let data   = await Account.find({});
        // resp.status(200).send(account)
        	resp.render('home',{
	         	title:'Home Page',
	         	data:data,
	         	error:null,

	        })
        
        }catch(err){

		 let data   = await Account.find({});
         //resp.status(200).send(account)
        	resp.render('home',{
	         	title:'Home Page',
	         	data:data,
	         	error:err,

	        })

	}

})

app.get('/delete/',async(req,resp)=>{
	console.log(req.query.id)
	const id = req.query.id;
	try{

	
      let flage = await Account.findOneAndRemove({_id:id})

	  let data   = await Account.find({});
         //resp.status(200).send(account)
        	resp.render('home',{
	         	title:'Home Page',
	         	data:data,
	         	error:'',

	        })

	}catch(err){
		 resp.send(err)
	}
})

//app.use('/api/user',userRegister);
app.use('/api/moneytransfer/',moneytransfer)

//=>{//
//	resp.status(200).send('Verified//')
//});


 const port  = process.env.PORT || 90;



app.get('*', function(req, res) { res.send('Page Not Found') });

app.listen(port,()=>console.log(`server running at port  ${port}`))