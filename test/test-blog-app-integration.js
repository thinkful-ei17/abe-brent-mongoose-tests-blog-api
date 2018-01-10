'use strict';
const chai = require('chai');
const should = require('chai').should;
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
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function(){
    return BlogPost.insertMany(seedData);
  });

  afterEach(function(){
    return mongoose.connection.dropDatabase();
  });
  
  after(function(){
    return closeServer();
  });

  /*
  Testing For:
  1. Count of Stories in Database should equal Request Totals on GET ALL
  2. It should return a post with the required fields
  3. 
  */

  it('should get all records and match database count', function(){
    const totalInDb = BlogPost.find().count();
    console.log(totalInDb); 
    return chai.request(app)
    .get('/post')
    .then(response =>{
      response.should.have.status(200);
      response.body.length.should.equal(totalInDb);
    });
  });

});

// describe('POST Endpoints', function(){});


// describe('PUT Endpoints', function(){});
// describe('DELETE Endpoints', function (){});