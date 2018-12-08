var mongoose=require('mongoose');
mongoose.Promise=global.Promise;

// Insert your development database url in here .
mongoose.connect('mongodb://writer:123abc@ds123844.mlab.com:23844/twitter-api',{ useCreateIndex: true,useNewUrlParser:true}).then(()=>{
	console.log('Connected to Database');
}).catch((e)=>{
	console.log('Not connected to Database Either speed is slow or Check your internet');
});

module.exports={
	mongoose
};