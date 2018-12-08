var mongoose=require('mongoose');
mongoose.Promise=global.Promise;

// Insert your Test database url in here.

mongoose.connect('mongodb://tester:123abc@ds127634.mlab.com:27634/twitter-api-test',{ useCreateIndex: true,useNewUrlParser:true});

module.exports={
	mongoose
};