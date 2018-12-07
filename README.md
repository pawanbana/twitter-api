# Twitter API
This is a Api which let you signup a user with unique username and a password and then it gives you functionalities similar to Twitter backend Api. like,

- Follow/Unfollow
- Create/read/delete tweets
- Like/Unlike a tweet
- Reply to a tweet


**First install all dependencies** 

`npm install`


**Setting Database**

In db folder there are two files development.js and test.js In these files fill the database link inside mongoose.connect as per order of environment

**Setting the Environment**

set node environment as per you need 
- linux & mac: export NODE_ENV=development||test
- windows: set NODE_ENV=development||test


**To get project running**

`npm start`

**To test the project** 

`npm test`



**Routes of user**
- `/users`         =>  Post Route provide username and password in body.
- `/users/login`   =>  Post Route provide username and password in body. 
- `/users/me/token` => Delete route to delete a generated token for authentication.

**Routes for Tweets**
- `/tweets`            =>    Post Route provide text in body to create a tweet.
- `/tweets`            =>    Get Route to get all tweets from database.
- `/tweets/:id`        =>    Get Route to get a tweet with given id.
- `/tweets/user/:username`=> Get Route to get tweet of a given user.
- `/tweets/delete/:id`  =>   Delete Route to delete a tweet with given id.
- `/tweets/like/:id`    =>   Post Route to Like a tweet with given id.
- `/tweets/unlike/:id`  =>   Post Route to unlike a tweet with given id.
- `/tweets/reply/:id`   =>  Post Route to reply of a tweet with given id.