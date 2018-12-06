const {User}=require('./../models/user');


var authenticate=(req,res,next)=>{
	var cookie=req.headers.cookie;
	var token=cookie.replace(/(?:(?:^|.*;\s*)x-auth-access\s*\=\s*([^;]*).*$)|^.*$/, "$1");

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