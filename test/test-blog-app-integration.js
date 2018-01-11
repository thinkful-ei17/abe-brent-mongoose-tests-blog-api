'use strict';
const chai = require('chai');
const should = require('chai').should();
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
chai.use(chaiHttp);

const {BlogPost} = require('../models');
const {TEST_DATABASE_URL} = require('../config');
const {app, runServer, closeServer} = require('../server');
const seedData = require('../seed-data.json');

describe('Setup and TearDown', function(){
  before(function(){
    console.log('starting server');
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    return BlogPost.insertMany(seedData);
  });

  afterEach(function(){
    console.log('after each running');
    return mongoose.connection.dropDatabase();
  });
  
  after(function(){
    console.log('closing server');
    return closeServer();
  });



  describe('GET /posts', function(){
  /*
  Testing For:
  1. Count of Stories in Database should equal Request Totals on GET ALL
  2. It should return a post with the required fields
  3. id matches req.id
  */
    let res;
    
      it('should match request id with the post id', function(){
      return BlogPost.find()
      .then(_res => {
        res = _res;
        return res;})
      .then(function(){
      return chai.request(app)
        .get(`/posts/${res[0].id}`);
      })
      .then(response => {
          response.body.id.should.equal(res[0].id);
        });
          console.log(`Res.id has ${res[0].id} and response.body.id has ${response.body.id}`);
          console.log(`Here is what we have in res: ${res[0].id}`);
    });  


    it('should get all records and match database count', function(){
        return chai.request(app)
      .get('/posts') 
      .then(response =>{
        response.should.have.status(200);
        response.body.length.should.equal(res.length); 
      }) 
      .catch(err => { console.log(err);});
  
    });

    it('should return a post with required fields', function(){
      return chai.request(app)
        .get('/posts')
        .then(response =>{
          response.body.forEach(function(story){
            story.should.have.keys('title', 'content','author','id','created');
          });
        });
    });




  });

  // describe('POST /posts', function(){

  //   let res;
  //   it('should');

  // });

});


// describe('PUT Endpoints', function(){});
// describe('DELETE Endpoints', function (){});