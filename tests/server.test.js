const expect=require('expect');
const request=require('supertest');
const {ObjectID}=require('mongodb');
const {app}=require('./../app');
const {Tweet}=require('./../models/tweet.js');
const {User}=require('./../models/user.js');
const{tweets,populatetweets,users,populateusers}=require('./seed/seed.js');

beforeEach(populateusers);

beforeEach(populatetweets);

