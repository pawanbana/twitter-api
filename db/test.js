var mongoose=require('mongoose');
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://tester:123abc@ds127634.mlab.com:27634/twitter-api-test',{useNewUrlParser:true});

module.exports={
	mongoose
};