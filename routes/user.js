var express=require('express');
var router=express.Router();
var _=require('lodash');
var {ObjectID}=require('mongodb');
var {User}=require('../models/user');
var {authenticate}=require('../middleware/authenticate');


//===============================
//User Routes
//===============================
      
       //Route to post/signup a user

     router.post('/',(req,res)=>{
             var body=_.pick(req.body,['username','password']);
             var user=new User(body);
             user.save().then(()=>{           
             	return user.generateAuthToken();
             }).then((token)=>{
             	res.cookie('sessionId',token,{httpOnly:true ,ephemeral: true});
             	res.status(201).send(user);
             }).catch((e)=>{
              
             	res.status(400).send('This user already exists');
             })
     });

   //Route to  Login a user

     router.post('/login',(req,res)=>{
     	var body=_.pick(req.body,['username','password']);
     	User.findByCredentials(body.username,body.password).then((user)=>{
        return user.removeTokenAll().then(()=>{         
          return user.generateAuthToken()});     		
     	}).then((token)=>{      
            res.cookie('sessionId',token,{httpOnly:true ,ephemeral: true});
         		res.status(200).send('You are Logged in');
     	}).catch((e)=>{
     		res.status(404).send(e);
     	});
     });

     //Route to delete a token

     router.delete('/me/token',authenticate,(req,res)=>{
     	req.user.removeToken(req.token).then(()=>{
     		res.cookie('sessionId','');
     		res.status(200).send("Token is succesfully removed");
     	},()=>{
     		res.status(400).send("There is a problem in removing the token");
     	});
     });

  




//=====================================
//Follow/unfollow routes
//=====================================
        
               
         //Route to follow a user with username given in url

          router.post('/follow/:username',authenticate,(req,res)=>{
                     var username=req.params.username;                     
                     User.findByToken(req.token).then((user)=>{
                           
                           User.findOne({username}).then((user2)=>{
                           //case 1 when no such user exists 

                                      if(!user2){ 
                                       return caseuser=1;
                                        }
                           //case 2 when you are following yourself             
                                      if(user.username===username){
                                       return caseuser=2;
                                      }
                          //case 3 when you already followed the user            
                                      var count=0;                      
                                      user.following.forEach(function(fusername){
                                        if(fusername.username==username){
                                          count++;
                                        }
                                      });                      
                                      if(count!=0){
                                      return caseuser=3;
                                      }
                      //case 4 successfully followed the user
                                    user.followuser(username,user2._id);
                                    return caseuser=4;
                                    }).then((caseuser)=>{                                    
                                      if(caseuser==1){
                                        res.status(404).send('This user does not exists');

                                      }
                                      else if(caseuser==2){
                                        res.status(403).send('you can not follow yourself');
                                      }
                                      else if(caseuser==3){
                                        res.status(400).send('Already following the user');

                                      }
                                      else if(caseuser==4){
                                        res.status(200).send(`${username} is followed`);
                                      }
                                    })
                                   }).catch((e)=>{
                                      res.status(500).send("There was some error");
                                    });
            });


 //Route to unfollow a user with username given in url

        router.post('/unfollow/:username',authenticate,(req,res)=>{
              var username=req.params.username;
              User.findByToken(req.token).then((user)=>{
                 //case 1 when no such user exists in following list
                 
                                      var count=0;                      
                                      user.following.forEach(function(fusername){                          
                                        if(fusername.username==username){
                                          count++;
                                        }
                                      });  
                                                          
                                      if(count==0){
                                      return caseuser=1
                                      }
                  //case2 successfully unfollowed the user
                     user.unfollowuser(username);
                     return caseuser=2;
              }).then((caseuser)=>{
                if(caseuser==1){
                  res.status(404).send('You are not following this user');
                }
                else if(caseuser==2){
                res.status(200).send(`${username} has been unfollowed`);
                }
              }).catch((e)=>{
                res.status(400).send("There is some error");
              });
          });

module.exports=router;