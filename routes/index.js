var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var allSensors = [];

  collection.find({sensorid: 21}, {}, function(e,results){
    var stringResults = JSON.stringify(results);
    console.log("****************************", results);
    console.log("----------------------------", e);
    res.render('index', {
      'weight1' : results[results.length-1].weight1,
      'sensorid' : results[results.length-1].sensorid,
      'temp1' : results[results.length-1].temp1,
      'hum1' : results[results.length-1].hum1,
      'title' : 'RoboPlant!'
    });
  });

});



router.get('/graph_data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  collection.find({sensorid: 21}, {}, function(e,results){

    var recent = [];
    for (var i = results.length-1; i > 0; i--) {
      recent.push({'temp': results[i].temp1});
    };

    return recent;

  }).then(function(temps){
    res.send(temps);
  });

});

router.post("/post_data/:data", function(req, res){
  var db = req.db;
  var collection = db.get('usercollection');
  var sensorRequest = req.params.data;
  var obj = JSON.parse(sensorRequest);
  // obj.datetime = Date.now;
  console.log("######################", obj[0]);

  collection.insert(JSON.parse(sensorRequest), function(e,success){
    console.log('SUCCESS*******', success);
    // console.log('ERROR*********', e);
  });
  return;
});


// router.get("/submit_id/:data", function(req, res){
//   var db = req.db;
//   var collection = db.get('usercollection');
//   var id = req.query.id;
//
//   collection.insert({"CLIENTID": id}, function(e,success){
//     console.log('SUCCESS*******', success);
//     console.log('ERROR*********', e);
//   }).then(function(){
//     collection.find({}, {}, function(e,results){
//       var stringResults = JSON.stringify(results);
//       console.log("SUCCESS*******", stringResults);
//       console.log("ERROR*********", e);
//     })
//   }).then(function(){
//     res.render('client', { 'title': id });
//   })
//
// });

module.exports = router;
