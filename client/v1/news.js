var util = require("util");
var _ = require("lodash");
var Resource = require("./resource");
var camelKeys = require('camelcase-keys');


function News(session, params) {
    Resource.apply(this, arguments);
}

util.inherits(News, Resource);
module.exports = News;

var Request = require('./request');
var Helpers = require('../../helpers');
var Media = require('./media');
var Exceptions = require('./exceptions');


News.getNews = function (session) {
  return new Request(session)
      .setMethod('GET')
      .setResource('news')
      .send()
      .then(function(data) {
          return data
      })
      // will throw an error with 500 which turn to parse error
      .catch(Exceptions.ParseError, function(){
          throw new Exceptions.PlaceNotFound();
      })
};

News.newsInbox = function (session) {
  return new Request(session)
      .setMethod('GET')
      .setResource('newsInbox')
      .send()
      .then(function(data) {
          return data
      })
      // will throw an error with 500 which turn to parse error
      .catch(Exceptions.ParseError, function(){
          throw new Exceptions.PlaceNotFound();
      })
};

