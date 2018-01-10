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


describe('GET /posts', function(){
  before(function(){
    console.log('starting server');
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    console.log(seedData);
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

  /*
  Testing For:
  1. Count of Stories in Database should equal Request Totals on GET ALL
  2. It should return a post with the required fields
  3. id matches req.id
  */
  let res;
  it('should get all records and match database count', function(){
    return BlogPost.count()
      .then(_res => {
        res = _res;
        return res;})
      .then(function(){
        return chai.request(app)
          .get('/posts');}) 
      .then(response =>{
        response.should.have.status(200);
        response.body.length.should.equal(res); 
      }) 
      .catch(err => { console.log(err);});
  
  });

});

// describe('POST Endpoints', function(){});


// describe('PUT Endpoints', function(){});
// describe('DELETE Endpoints', function (){});