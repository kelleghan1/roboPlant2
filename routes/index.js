var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  res.render('index');

});



router.get("/submit_id/:data", function(req, res){
  var db = req.db;
  var collection = db.get('usercollection');
  var id = req.query.clientId;

  collection.find({'clientId': id})
  .then(function(clientRes){

    if (clientRes[0] !== undefined) {
      res.render('client', { 'clientRes': clientRes[0] });
    } else {
      collection.insert({
        "clientId": id,
        "totes": []
      },
      function(e,success){
        console.log('SUCCESS INSERT', success);
        res.render('client', { clientRes: success });
      })

    }

  })

});



router.get('/get_data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  var clientId = req.query.clientId;

  collection.find({'clientId': clientId})
  .then(function(clientRes){

    res.send(clientRes[0])

  })

});


router.get('/create_tote/:data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;
  var toteName = req.query.toteName;



  collection.update(
    {clientId: clientId},
    { $push:
      { totes:
        { toteName: toteName, sensorId: '', readings: [] }
      }
    }
  )
  .then(function(result){
    res.redirect('back');
  })

});


router.get('/asign_sensor/:data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;
  var toteName = req.query.toteName;
  var sensorId = parseInt(req.query.sensorId);

  collection.update(
    { clientId: clientId, "totes.toteName": toteName },
    { $set: {"totes.$.sensorId": sensorId} }
  )
  .then(function(result){
    res.redirect('back');
  })

});


router.post("/post_data/:data", function(req, res){
  var db = req.db;
  var collection = db.get('usercollection');
  var sensorRequest = req.params.data;
  var obj = JSON.parse(sensorRequest);
  // obj.datetime = Date.now;

  collection.update(
    {"totes.sensorId": obj.sensorid},
    { $push:
      { "totes.$.readings": obj }
    }
  )

  return;

});



router.get('/test_route', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientRes = collection.find({})
  .then(function(primise){
    console.log(primise);
  })

});

router.get('/graph_data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;


  collection.find({'clientId': clientId})
  .then(function(clientRes){

    res.send(clientRes[0])

  })

});






module.exports = router;
