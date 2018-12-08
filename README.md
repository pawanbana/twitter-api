# Twitter API
This is an Api which let you signup a user with unique username and a password and then it gives you functionalities similar to Twitter backend Api. like,

- Follow/Unfollow
- Create/read/delete tweets
- Like/Unlike a tweet
- Reply to a tweet


**Prerequisites**
* [NodeJs](https://nodejs.org/en/) - NodeJs required.

**First install all dependencies** 

`npm install`


**Setting Database**

In db folder there are two files development.js and test.js In these files fill the database link inside mongoose.connect as per order of environment.Database to be of form mongodb.

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
- `/tweets/reply/:id`   =>  Post Route to reply of a tweet with given id and provide text in body.




## Built With

* [ExpressJs](http://expressjs.com/) - The Framework used
* [bcryptJs](https://www.npmjs.com/package/bcryptjs) - For password hashing
* [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - To generate Authentication tokens
* [Lodash](https://lodash.com/) - To pick selected data from request
* [Mocha](https://mochajs.org/) - For TEST
* [Expect](https://www.npmjs.com/package/expect) - For Test results
* [Supertest](https://www.npmjs.com/package/supertest) - For Test requests
* [Chai](https://www.chaijs.com/) - For Test


