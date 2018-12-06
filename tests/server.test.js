const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');
const {app}=require('./../app');
const {Tweet}=require('./../models/tweet.js');
const {User}=require('./../models/user.js');
const{tweets,populatetweets,users,populateusers}=require('./seed/seed.js');



before(populatetweets);                
before(populateusers);
//====================================
// Tests for Users 
//====================================


        //These are test for signing up a user

        describe('POST/users/signup',()=>{
               
               //Test for Creating a user
                it('Should create user',(done)=>{
                	var username='rick';
                	var password='anything';
                	request(app)
                	.post('/users')
                	.send({username,password})
                	.expect(201)
                	.expect((res)=>{
                		expect(res.body._id).toBeTruthy();
                		expect(res.body.username).toBe(username);
                	})
                       .end(done);
                	
                	
                });

                //Test for not Creating a user if username taken
                it('should not create user if username is in use ',(done)=>{
                	var username='rick';
                        var password='anything';
                        request(app)
                        .post('/users')
                        .send({username,password})
                        .expect(400)
                        .end(done);
                });
              
        });


        // This test is for user login

        describe('POST/user/login',()=>{
         
         //Test to Login a user with right credentials
            it('Should login user ',(done)=>{
                    var username='rick';
                    var password='anything';
                  request(app)
                  .post('/users/login')
                  .send({username:username,password:password})
                  .expect(200)
                  .expect((res)=>{
                    expect(res.text).toBe('You are Logged in');
                    
                  })
                  .end(done);

            });

        //Test for login if user not exists    
             it('should not login user who does not exists',(done)=>{
                var username='anything';
                var password='anything';
                request(app)
                  .post('/users/login')
                  .send({username:username,password:password})
                  .expect(404)
                  .expect((res)=>{
                    expect(res.text).toBe('This User does not exists');
                    
                  })
                  .end(done);
             });
        //Test if user entered the wrong password
            it('should not login user with wrong password',(done)=>{
                var username='rick';
                var password='anything1';
                request(app)
                  .post('/users/login')
                  .send({username:username,password:password})
                  .expect(404)
                  .expect((res)=>{
                    expect(res.text).toBe('password does not match');
                    
                  })
                  .end(done);
            });


        });

      //This test is for deleteing a token

      describe('DELETE/Token',()=>{
        //Test for deleting a token of user         
         it('Should delete a token',(done)=>{
          var username=users[1].username;
             var token=users[1].tokens[0].token;
             request(app)
             .delete('/users/me/token')
             .set('Cookie',`x-auth-access=${token}`)
             .expect(200)
             .end((err,res)=>{
              if(err){
                  return done(err);
              }
              User.findOne({username:username}).then((user2)=>{         
                  expect(user2.tokens.length).toBe(0);
                  done();
              })
              .catch((e)=>done(e));
             })                   
         });
      });



//===================================
//Test for Follow/Unfollow
//====================================



    //This test is to Follow a user


    describe('Post/FollowUser',()=>{
 
            //Case 1 follow user with given username
            it('Should Follow a User with given username',(done)=>{
               var username=users[0].username;
               var username2=users[1].username;
               var password=users[0].password;

                var token= users[0].tokens[0].token;

                request(app)
                .post(`/users/follow/${username2}`)
                .set('Cookie',`x-auth-access=${token}`)
                .expect(200)
                .expect((res)=>{
                  
                  expect(res.text).toBe(`${username2} is followed`)
                })
                .end(done);
            });   
             
            //case 2 Not follow user when user does not exists
            it('should not follow a user when user does not exists',(done)=>{
               var username=users[0].username;
               var username2='anyone';
               var password=users[0].password;               
               var token= users[0].tokens[0].token;

                request(app)
                .post(`/users/follow/${username2}`)
                .set('Cookie',`x-auth-access=${token}`)
                .expect(404)
                .expect((res)=>{                  
                  expect(res.text).toBe(`This user does not exists`)
                })
                .end(done);                                 
            }); 


            //case 3 Cannot follow yourself
           it('should not follow Yourself',(done)=>{
               var username=users[0].username;              
               var password=users[0].password;               
               var token= users[0].tokens[0].token;
                request(app)
                .post(`/users/follow/${username}`)
                .set('Cookie',`x-auth-access=${token}`)
                .expect(403)
                .expect((res)=>{                  
                  expect(res.text).toBe(`you can not follow yourself`)
                })
                .end(done);                            
            }); 


           //case 4 Not follow a user when already following
           it('should not follow user when already following him',(done)=>{
               var username=users[0].username; 
               var username2=users[1].username;                            
               var password=users[0].password;               
               var token= users[0].tokens[0].token;
                request(app)
                .post(`/users/follow/${username2}`)
                .set('Cookie',`x-auth-access=${token}`)
                .expect(400)
                .expect((res)=>{                  
                  expect(res.text).toBe(`Already following the user`)
                })
                .end(done);
               })                                     
     });

    describe('POST/Unfollow User',()=>{
                
                // Case 1 unfollow user when following
                it('Should Unfollow a user',(done)=>{                
                    var username=users[0].username; 
                    var username2=users[1].username;                            
                    var password=users[0].password;
                    var token= users[0].tokens[0].token;
                      request(app)
                      .post(`/users/unfollow/${username2}`)
                      .set('Cookie',`x-auth-access=${token}`)
                      .expect(200)
                      .expect((res)=>{                        
                        expect(res.text).toBe(`${username2} has been unfollowed`)
                      })
                      .end(done);                     
                      });
                 
                 //case 2 when user not following a user
                it('Should not Unfollow a user when not following him',(done)=>{
                     var username=users[0].username; 
                     var username2=users[1].username;                            
                     var password=users[0].password;
                     var token= users[0].tokens[0].token;
                      request(app)
                      .post(`/users/unfollow/${username2}`)
                      .set('Cookie',`x-auth-access=${token}`)
                      .expect(404)
                      .expect((res)=>{
                         expect(res.text).toBe(`You are not following this user`)
                      })
                      .end(done);

                     })
        });


 //==============================
 //  Test for Tweets
 //==============================   
       
           //Test to create a tweet
           describe('POST/Tweet',()=>{
                   
                   it('Should Create tweet',(done)=>{
                     var username=users[0].username; 
                     var text='This is a new tweet';
                      var token= users[0].tokens[0].token;
                      request(app)
                      .post(`/tweet/new`)
                      .set('Cookie',`x-auth-access=${token}`)
                      .send({text:text})
                      .expect(201)
                      .expect((res)=>{                        
                        expect(res.body.text).toBe(text);
                        expect(res.body._id).toBeTruthy();
                      })
                      .end((err,res)=>{
                        if(err){
                          return done(err);
                        }
                        Tweet.find({text}).then((tweet)=>{
                          expect(tweet.length).toBe(1);
                          expect(tweet[0].text).toBe(text);
                          done();
                        })
                        .catch((e)=>{
                          done(e);
                        });
                      });                      
                   });
           });

         //Test To  tweets

         describe('GET/Tweets',()=>{
                
                //Test to get all tweets
                it('Should get all tweets',(done)=>{
                     var username=users[0].username; 
                     var password=users[0].password;                    
                      var token= users[0].tokens[0].token;
                      request(app)
                      .get(`/tweets`)
                      .set('Cookie',`x-auth-access=${token}`)                      
                      .expect(200)
                      .expect((res)=>{                        
                        expect(res.body.tweets.length).toBe(3);                      
                      })
                      .end(done);
                   });

                //Test to get a tweet with id
                it('should get a tweet with id',(done)=>{
                  var id=tweets[0]._id;
                  var token= users[0].tokens[0].token;
                  request(app)
                  .get(`/tweets/${id}`)
                  .set('Cookie',`x-auth-access=${token}`)  
                  .expect(200)
                  .expect((res)=>{
                    expect(res.body.text).toBe(tweets[0].text);
                  })
                  .end(done);
                });
 
             //Test to Get Tweets of one user only
             it('should get tweets of a user',(done)=>{
                  var username=users[0].username;                  
                  var token= users[0].tokens[0].token;
                  request(app)
                  .get(`/tweets/user/${username}`)
                  .set('Cookie',`x-auth-access=${token}`)  
                  .expect(200)
                  .expect((res)=>{
                    expect(res.body.tweets.length).toBe(2);
                  })
                  .end(done);
                });
             //Test if there is no tweets of a user
              it('should show no tweets if user does not exist or have no tweets',(done)=>{
                  var username='noone';                  
                  var token= users[0].tokens[0].token;
                  request(app)
                  .get(`/tweets/user/${username}`)
                  .set('Cookie',`x-auth-access=${token}`)  
                  .expect(404)     
                  .end(done);
                });
         });  

        //Test to delete the tweet
         describe('DELETE/Tweet',()=>{

              //Test to delete tweet with given id
               it('should delete tweet',(done)=>{
                  var id=tweets[0]._id;
                  var token= users[0].tokens[0].token;
                  request(app)
                  .delete(`/tweet/delete/${id}`)
                  .set('Cookie',`x-auth-access=${token}`)  
                  .expect(200)
                  .expect((res)=>{                  
                    expect(res.body.tweet._id).toBe(id.toHexString());
                  })
                  .end((err,res)=>{
                    if(err){
                      return done(err);
                    }
                    Tweet.findOne({_id:id}).then((tweet)=>{
                      expect(tweet).toBeFalsy();
                      done();
                    })
                    .catch((e)=>{
                      done(e);
                    });
                  });

               });

            //Test to delete a tweet when other user try to delete it
            it('should not delete tweet when you are not authorised',(done)=>{
                  var id=tweets[1]._id;
                  var token= users[0].tokens[0].token;
                  request(app)
                  .delete(`/tweet/delete/${id}`)
                  .set('Cookie',`x-auth-access=${token}`)  
                  .expect(400)
                  .expect((res)=>{
                    expect(res.text).toBe('Either This tweet does not exists or you are not authorised to delete this tweet');                   
                  })
                  .end(done);
               });
         });  


