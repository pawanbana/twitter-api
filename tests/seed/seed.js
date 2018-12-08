const {ObjectID}=require('mongodb');
const {Tweet}=require('./../../models/tweet.js');
const {User} =require('./../../models/user.js');
const jwt= require('jsonwebtoken');
//==========================================
//Seeding hte data base with test data 
//==========================================


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
	text:'New tweet 1',
	authorId:useroneid,
	username:useronename,
	reply:false
},
{
	_id:new ObjectID(),
	text:'New tweet 2',
	authorId:usertwoid,
	username:usertwoname,
	reply:false
}];


const populatetweets =function(done){
	this.enableTimeouts(false);
	Tweet.deleteMany({}).then(()=>{
	Tweet.insertMany(tweets);
	}).then(()=>done());
    
};


const populateusers=function(done){
	this.enableTimeouts(false);
	User.deleteMany({}).then(function(){
		var userone=new User(users[0]).save();
		var usertwo=new User(users[1]).save();
		}).then(()=>done())
	.catch(done);
};

module.exports={
	tweets,populatetweets,users,populateusers
}