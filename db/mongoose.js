var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://writer:123abc@ds123844.mlab.com:23844/twitter-api',{useNewUrlParser:true});

module.exports={
	mongoose
};