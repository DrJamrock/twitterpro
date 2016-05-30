var express = require('express');
var router = express.Router();
var db = require('../db.js');


///////////////////////////////////
/////////dbroutes//////////////////
///////////////////////////////////

// fetch from db
router.get('/models/:model/:key/:value', function(req, res, next) {
  console.log('apiroutes: GET');
  var searchObject = {};
  searchObject[req.params.key] = req.params.value;
  db.helpers.handleGet(req.params.model, searchObject, function(results) {
    res.status(200).send(results);
    next();
  });

});
// create new model
router.post('/models/:model', function(req, res, next) {
  console.log('apiroutes: POST');
  db.helpers.handlePost(req.params.model, req.body, function(results) {
    res.status(200).send(results);
    next();
  });
});
// delete a model
router.delete('/models/:model/:key/:value', function(req, res, next) {
  console.log('apiroutes: DELETE');
  var searchObject = {};
  searchObject[req.params.key] = req.params.value;

  db.helpers.handleDelete(req.params.model, searchObject, function(results) {
    res.status(200).send(results);
    next();
  });
});
// change a model
router.put('/models/:model', function(req, res, next) {
  console.log('apiroutes: PUT');
  db.helpers.handlePut(req.params.model, req.body, function(results) {
    res.status(200).send(results);
    next();
  });
});

module.exports = router;
