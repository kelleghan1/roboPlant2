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
  var sensorList = [{sensorId: 21}, {sensorId: 23}]



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
        res.render('client', { clientRes: success, sensorList: sensorList });
      })

    }

  })

});


router.get('/create_tote/:data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;
  var toteName = req.query.toteName;
  var sensors = [{sensorId: 21}, {sensorId: 23}]

  collection.update(
    {clientId: clientId},
    { $push:
      { totes:
        { toteName: toteName, sensorId: '', readings: [], sensors: sensors }
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

// router.get('/graph_data', function(req, res, next) {
//   var db = req.db;
//   var collection = db.get('usercollection');
//
//   collection.find({sensorid: 21}, {}, function(e,results){
//
//     var recent = [];
//     for (var i = results.length-1; i > 0; i--) {
//       recent.push({'temp': results[i].temp1});
//     };
//
//     return recent;
//
//   }).then(function(temps){
//     res.send(temps);
//   });
//
// });






module.exports = router;
