//==================================
//All Dependencies are here 
//==================================

const express=require('express');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');
const {ObjectID}=require('mongodb');
var {User}=require('./models/user.js');
var {Tweet}=require('./models/tweet.js');


var userRoutes=require('./routes/user');
var tweetRoutes=require('./routes/tweet');

var env=process.env.NODE_ENV||'development';
console.log(`Current Environment is : ${env} `);
var {mongoose}=require(`./db/${env}`);


const port=process.env.PORT||3000;
var app=express();
app.use(cookieParser());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));


app.use('/users',userRoutes);
app.use('/tweets',tweetRoutes);


//============================
//server listen 
//============================

app.listen(port,()=>{
   console.log(`server is started at Port : ${port}`);
});


module.exports={app};