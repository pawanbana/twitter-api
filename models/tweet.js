const mongoose=require('mongoose');


    var TweetSchema=new mongoose.Schema({
    	text:{
    		type:String,
    		required:true,
    		minlength:3
    	},
    	createdAt:{
    		type:Date,
    		default:Date.now
    	},
    	authorId:{
    		type:mongoose.Schema.Types.ObjectId,
    		required:true
    	},
    	username:{
    		type:String,
    		required:true
    	}
    });

var Tweet=mongoose.model('Tweet',TweetSchema);
module.exports={Tweet};