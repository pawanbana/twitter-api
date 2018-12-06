//==================================
//All Dependencies are here 
//==================================

const express=require('express');
const bodyparser=require('body-parser');
const _=require('lodash');
const cookieParser=require('cookie-parser');
const {ObjectID}=require('mongodb');
var {User}=require('./models/user.js');
var {Tweet}=require('./models/tweet.js');
var {authenticate}=require('./middleware/authenticate');

//setting node environment
//linux & mac: export NODE_ENV=production
//windows: set NODE_ENV=production
var env=process.env.NODE_ENV||'development';
console.log(env);
var {mongoose}=require(`./db/${env}`);


const port=process.env.PORT||3000;
var app=express();
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));



//===============================
//User Routes
//===============================
      
 

       //Route to post/signup a user

     app.post('/users',(req,res)=>{
             var body=_.pick(req.body,['username','password']);
             var user=new User(body);
             user.save().then(()=>{           
             	return user.generateAuthToken();
             }).then((token)=>{
             	res.cookie('x-auth-access',token);
             	res.status(201).send(user);
             }).catch((e)=>{
              
             	res.status(400).send('This user already exists');
             })
     });

   //Route to  Login a user

     app.post('/users/login',(req,res)=>{
     	var body=_.pick(req.body,['username','password']);
     	User.findByCredentials(body.username,body.password).then((user)=>{
        return user.removeTokenAll().then(()=>{         
          return user.generateAuthToken()});     		
     	}).then((token)=>{      
            res.cookie('x-auth-access',token);
         		res.status(200).send('You are Logged in');
     	}).catch((e)=>{
     		res.status(404).send(e);
     	});
     });

     //Route to delete a token

     app.delete('/users/me/token',authenticate,(req,res)=>{
     	req.user.removeToken(req.token).then(()=>{
     		res.cookie('x-auth-access','');
     		res.status(200).send("Token is succesfully removed");
     	},()=>{
     		res.status(400).send("There is a problem in removing the token");
     	});
     });

  




//=====================================
//Follow/unfollow routes
//=====================================
        
               
         //Route to follow a user with username given in url

          app.post('/users/follow/:username',authenticate,(req,res)=>{
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

        app.post('/users/unfollow/:username',authenticate,(req,res)=>{
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



//=====================================
//tweet routes
//=====================================
            
            //To Create a tweet

            app.post('/tweets/new',authenticate,(req,res)=>{
                   var body=_.pick(req.body,['text']);
                   User.findByToken(req.token).then((user)=>{
                   	  var tweet=new Tweet({
                   	  	text:body.text,
                   	  	authorId:user._id,
                   	  	username:user.username
                   	  });
                   	tweet.save().then((doc)=>{
                   		res.status(201).send(doc);
                   	});

                   }).catch((e)=>{
                   	console.log('There was an error in creating the tweet');
                   });

            });


            //To read all tweet

            app.get('/tweets',authenticate,(req,res)=>{
              Tweet.find().then((tweets)=>{
                if(tweets.length==0){
                        return res.status(404).send('There are no tweets');
                 }
                return res.status(200).send({tweets});
              }).catch((e)=>{
                res.status(500).send('There was an error in getting the tweets');
              });
            });

 
           //To Read a Tweet with given id

            app.get('/tweets/:id',authenticate,(req,res)=>{
                      var id=req.params.id;
                      if(!ObjectID.isValid(id)){

                   return res.status(404).send("id is not valid");

                   }
                      Tweet.findOne({_id:id}).then((tweet)=>{
                        if(!tweet){
                          return res.send('No tweet with this id exists');
                        }
                        return res.status(200).send(tweet);
                      }).catch((e)=>{
                          res.send('No tweet with this id exists');
                      })
            });



          //To read tweets of one user only

           app.get('/tweets/user/:username',authenticate,(req,res)=>{
                    var username=req.params.username;
                    
                    Tweet.find({username:username}).then((tweets)=>{
                      
                      if(tweets.length==0){
                        return res.status(404).send('This user has no tweets');
                      }
                      res.status(200).send({tweets});
                    }).catch((e)=>{
                      res.status(500).send('There was an error getting the tweets');
                    });
           });

          
          //To delete a Tweet with id given

          app.delete('/tweets/delete/:id',authenticate,(req,res)=>{
                   var id=req.params.id;
                  if(!ObjectID.isValid(id)){
                   return res.status(404).send("id is not valid");
                   }                 
                   Tweet.findOneAndDelete({
                    _id:id,
                    authorId:req.user._id
                   }).then((tweet)=>{
                      if(!tweet){
                        return res.status(400).send("Either This tweet does not exists or you are not authorised to delete this tweet");
                      }
                      res.status(200).send({tweet});                     
                   }).catch((e)=>{
                    res.status(400).send(e);
                  });
          });



            
          


//============================
//server listen 
//============================

app.listen(port,()=>{
              console.log(`server is started at Port : ${port}`);
});


module.exports={app};