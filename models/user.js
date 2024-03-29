const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const _ =require('lodash');
const bcrypt=require('bcryptjs');


//User collection model

var UserSchema=new mongoose.Schema({
          username:{
                   type:String,
                   required:true,
                   unique:true,
                   minlength:3
          },
          password:{
          	type:String,
          	required:true,
          	minlength:3
          },
          tokens:[{
          	access:{
          		type:String,
          		required:true
          	},
          	token:{
          		type:String,
          		required:true
          	}
          }],
          following:[{
          	username:{
          		type:String,
          		required:true
          	},
          	uid:{
          		type:mongoose.Schema.Types.ObjectId,
    		    required:true
          	}
          }]
     


});

//To send only selected data of a user.

UserSchema.methods.toJSON=function(){
	var user=this;
	var userObject=user.toObject();
	return _.pick(userObject,['_id','username','following']);

}

//To generate a Authentication token
UserSchema.methods.generateAuthToken=function(){
	var user=this;
	var access='auth';
	var token=jwt.sign({_id:user._id.toHexString(),access},'ironman').toString();
	user.tokens.push({access,token});
	return user.save().then(()=>{return token});
};


//To Follow a user method
UserSchema.methods.followuser=function(username,uid){
	var user=this;
	user.following.push({username:username,uid:uid});
	return user.save();
};


//To unfollow a user method
UserSchema.methods.unfollowuser=function(username){
	var user=this;
	return user.updateOne({
		$pull:{
			following:{username:username}
		}
	},function(err,data){});
};

//To Remove a authentication token from database

UserSchema.methods.removeToken=function(token){
	var user=this;
	return user.updateOne({
		$pull:{
			tokens:{token}
		}
	});
};

//To Remove all Authentication token from database
UserSchema.methods.removeTokenAll=function(){
	var user=this;
	return user.updateOne({
		$pull:{
			tokens:{}
		}
	});
};


//To find a user with given token
UserSchema.statics.findByToken=function(token){
	var user=this;
	
	var decoded;
	try{
		decoded=jwt.verify(token,'ironman');
	}catch(e){
		return Promise.reject();
	}	    
	return User.findOne({
		'_id':decoded._id,
		'tokens.token':token,
		'tokens.access':'auth'
	});
};

//To find a user with given username and password from database.
UserSchema.statics.findByCredentials=function(username,password){
	var User=this;
	return User.findOne({username}).then((user)=>{
		if(!user){
			return Promise.reject('This User does not exists');
		}
		return new Promise((resolve,reject)=>{
			bcrypt.compare(password,user.password,(err,res)=>{
				if(res){
					resolve(user);
				}
				else{
					reject('password does not match');
				}
			});
		});
	});
};



//Before saving a user in database the password must be hashed.

UserSchema.pre('save',function(next){
	var user=this;	
	if(user.isModified('password')){
		bcrypt.genSalt(10,(err,salt)=>{
			bcrypt.hash(user.password,salt,(err,hash)=>{
				user.password=hash;

				next();
			});
		});

	}
	else{
		next();
	}
});



var User=mongoose.model('User',UserSchema);
module.exports={User};