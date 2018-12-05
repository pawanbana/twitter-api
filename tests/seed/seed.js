const {ObjectID}=require('mongodb');
const {Tweet}=require('./../../models/tweet.js');
const {User} =require('./../../models/user.js');
const jwt= require('jsonwebtoken');


const useroneid=new ObjectID();
const usertwoid=new ObjectID();
const useronename='userone';
const usertwoname='usertwo';


const users=[{
	_id:useroneid,
	username:useronename,
	password:'abc123def',
	tokens:[{
		access:'auth',
		token:jwt.sign({_id:useroneid,access:'auth'},'abc123').toString()
	}]
},
{
	_id:usertwoid,
	username:usertwoname,
	password:'def123abc',
	tokens:[{
		access:'auth',
		token:jwt.sign({_id:usertwoid,access:'auth'},'abc123').toString()
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


const populatetweets =(done)=>{
	
	Tweet.remove({}).then(()=>{
		return Tweet.insertMany(tweets);
	}).then(()=>done());
    
};


const populateusers=(done)=>{
	User.remove({}).then(()=>{
		var userone=new User(users[0]).save();
		var usertwo=new User(users[1]).save();

		return Promise.all([userone,usertwo])
	}).then(()=>done());
};

module.exports={
	tweets,populatetweets,users,populateusers
}