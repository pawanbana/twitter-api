const {User}=require('./../models/user');


//This middleware check whether a user is authenticated or not.
var authenticate=(req,res,next)=>{

    var token=req.cookies.sessionId;
    
	User.findByToken(token).then((user)=>{
		if(!user){
			return Promise.reject();
		}   		   		  
        req.user=user;
        req.token=token;
        next();

	}).catch((e)=>{
		res.status(401).send('Authentication failed! User not Found');
	});
};


module.exports={authenticate};