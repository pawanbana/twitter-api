const {ObjectID}=require('mongodb');
const {Tweet}=require('./../../models/tweet.js');
const {User} =require('./../../models/user.js');
const jwt= require('jsonwebtoken');


const useroneid=new ObjectID();
const usertwoid=new ObjectID();
const useronename='userone';
const usertwoname='usertwo';
const useronepassword='abc123def';
const usertwopassword='def123abc';


const users=[{
	_id:useroneid,
	username:useronename,
	password:useronepassword,
	tokens:[{
		access:'auth',
		token:jwt.sign({_id:useroneid,access:'auth'},'ironman').toString()
	}]
},
{
	_id:usertwoid,
	username:usertwoname,
	password:usertwopassword,
	tokens:[{
		access:'auth',
		token:jwt.sign({_id:usertwoid,access:'auth'},'ironman').toString()
	}]
}];

const tweets=[{
	_id:new ObjectID(),
	text:'hi there',
	authorId:useroneid,
	username:useronename
},
{
	_id:new ObjectID(),
	text:'hello there',
	authorId:usertwoid,
	username:usertwoname
}];


const populatetweets =function(done){
	this.enableTimeouts(false);
	Tweet.remove({}).then(()=>{
	Tweet.insertMany(tweets);
	}).then(()=>done());
    
};


const populateusers=function(done){
	this.enableTimeouts(false);
	User.remove({}).then(function(){
		var userone=new User(users[0]).save();
		var usertwo=new User(users[1]).save();
		}).then(()=>done())
	.catch(done);
};

module.exports={
	tweets,populatetweets,users,populateusers
}