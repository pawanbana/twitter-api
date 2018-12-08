const mongoose=require('mongoose');
//Tweet collection model

    var TweetSchema=new mongoose.Schema({
    	text:{
    		type:String,
    		required:true,
    		minlength:3,
            maxlength:240
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
    	},
        likes:[{
            username:{
                type:String,
                required:true
            },
            uid:{
                type:mongoose.Schema.Types.ObjectId,
                required:true
            }
        }],
        reply:{
            type:Boolean,
            required:true
        },
        replies:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tweet'
        }]

    });

    //To like a tweet method
    TweetSchema.methods.likeTweet=function(username,uid){
    var tweet=this;


    tweet.likes.push({username:username,uid:uid});
    return tweet.save();
   };
   
   //To unlike a method
   TweetSchema.methods.unlikeTweet=function(username){
    var tweet=this;
    return tweet.updateOne({
        $pull:{
            likes:{username:username}
        }
    },function(err,data){});
   };

   //To reply a tweet
    TweetSchema.methods.replyTweet=function(reply){
    var tweet=this;

    tweet.replies.push({
        _id:reply._id
    });
    return tweet.save();
   };


var Tweet=mongoose.model('Tweet',TweetSchema);
module.exports={Tweet};