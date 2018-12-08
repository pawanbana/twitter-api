var express=require('express');
var router=express.Router();
var _=require('lodash');
var {ObjectID}=require('mongodb');
var {User}=require('../models/user');
var {Tweet}=require('../models/tweet');
var {authenticate}=require('../middleware/authenticate');

//=====================================
//tweet routes
//=====================================
            
            //To Create a tweet

            router.post('/',authenticate,(req,res)=>{
                   var body=_.pick(req.body,['text']);                 
                   	//create a tweet using Tweet model
                   	  var tweet=new Tweet({
                   	  	text:body.text,
                   	  	authorId:req.user._id,
                   	  	username:req.user.username,
                        reply:false
                   	  });
                   	 //Saving the Tweet. and sending the response to user. 
                   	tweet.save().then((doc)=>{
                   		res.status(201).send(doc);
                   	})
                   .catch((e)=>{
                   	console.log('There was an error in creating the tweet');
                   });
            });


            //To read all tweet

            router.get('/',authenticate,(req,res)=>{
              //find Tweets of all users.
              Tweet.find({reply:false}).populate({path:'replies',populate:{path:'replies'}}).then((tweets)=>{
                if(tweets.length==0){
                        return res.status(404).send('There are no tweets');
                 }
                return res.status(200).send({tweets});
              }).catch((e)=>{
                res.status(500).send('There was an error in getting the tweets');
              });
            });

 
           //To Read a Tweet with given id

            router.get('/:id',authenticate,(req,res)=>{
                      var id=req.params.id;

                      //verifying whether the given id is valid or not.
                      if(!ObjectID.isValid(id)){
                      return res.status(404).send("id is not valid");
                      }
                      //find tweet and sending it to user
                      Tweet.findOne({_id:id}).populate({path:'replies',populate:{path:'replies'}}).then((tweet)=>{
                        if(!tweet){
                          return res.send('No tweet with this id exists');
                        }
                        return res.status(200).send(tweet);
                      }).catch((e)=>{
                          res.send('No tweet with this id exists');
                      })
            });



          //To read tweets of one user only

           router.get('/user/:username',authenticate,(req,res)=>{
                    var username=req.params.username;
                    //Find tweets of a given user with username and sending those tweets in response.
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

          router.delete('/delete/:id',authenticate,(req,res)=>{
                   var id=req.params.id;
                   //verifying whether a given id is valid or not
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

  //++++++++++++++++++++++++++++++++++++++
  //Like/unlike Routes
  //++++++++++++++++++++++++++++++++++++++

          //Route to Like a tweet

            router.post('/like/:id',authenticate,(req,res)=>{                
                   var id=req.params.id;
                   //Verifying whether id is valid or not
                   if(!ObjectID.isValid(id)){
                   return res.status(404).send("id is not valid");
                   }  
                   //sending like to a tweet with the id.
                   
                    Tweet.findOne({_id:id}).then((tweet)=>{
                      if(!tweet){
                        return res.status(404).send('This Tweet does not exists');
                      }
                      var count=0;
                      tweet.likes.forEach(function(like){
                        if(like.username==req.user.username){
                          count++;
                        }
                      });
                      
                      if(count!=0){
                        return res.status(400).send('Already liked the tweet');
                      }

                      tweet.likeTweet(req.user.username,req.user._id);
                      return res.status(200).send('Liked the Tweet');

                    })
                   .catch((e)=>{
                    res.status(500).send(e);
                   });

            });


          //Route to unlike a test

          router.post('/unlike/:id',authenticate,(req,res)=>{
                   var id=req.params.id;
                   //Verifying whether id is valid or not             
                   if(!ObjectID.isValid(id)){
                   return res.status(404).send("id is not valid");
                   }  
                   //Finding the tweet and unliking it by removing user from likes
                   Tweet.findOne({_id:id}).then((tweet)=>{
                             var count=0;
                             tweet.likes.forEach(function(like){
                              if(like.username==req.user.username){
                                count++;
                              }
                             });
                             if(count==0){
                              return res.status(404).send("you havn't like this tweet");
                             }  
                             tweet.unlikeTweet(req.user.username);
                             return res.status(200).send('Unliked the Tweet');
                   }).catch((e)=>{
                    res.send(500).send(e);
                   });
          });


     //++++++++++++++++++++++++++++++++++++
     //Replies Routes
     //++++++++++++++++++++++++++++++++++++


        router.post('/reply/:id',authenticate,(req,res)=>{
                   var id=req.params.id;
                   //Verifying whether id is valid or not               
                   if(!ObjectID.isValid(id)){
                   return res.status(404).send("id is not valid");
                   }
                   var body=_.pick(req.body,['text']);
                   //Creating Reply as a new tweet
                      var tweet=new Tweet({
                        text:body.text,
                        authorId:req.user._id,
                        username:req.user.username,
                        reply:true
                      });
                     tweet.save().then((reply)=>{
                     	//Saving the reply by referencing it
                     Tweet.findOne({_id:id}).then((tweet2)=>{
                           if(!tweet2){
                            return res.status(404).send('Tweet not found');
                         }                   
                     tweet2.replyTweet(reply).then((tweet3)=>{
                      return res.status(200).send('Replied!');

                     });
                    });
              })
              .catch((e)=>{
                res.status(400).send(e);
              });
        });

module.exports=router;