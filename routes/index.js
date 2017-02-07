var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  res.render('index');

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

// router.post("/post_data/:data", function(req, res){
//   var db = req.db;
//   var collection = db.get('usercollection');
//   var sensorRequest = req.params.data;
//   var obj = JSON.parse(sensorRequest);
//   // obj.datetime = Date.now;
//   console.log("######################", obj[0]);
//
//   collection.insert(JSON.parse(sensorRequest), function(e,success){
//     console.log('SUCCESS*******', success);
//     // console.log('ERROR*********', e);
//   });
//   return;
// });


router.get("/submit_id/:data", function(req, res){
  var db = req.db;
  var collection = db.get('usercollection');
  var id = req.query.clientId;

  collection.find({'clientId': id})
  .then(function(clientRes){

    if (clientRes[0] !== undefined) {
      console.log('FOUND', clientRes[0]);
      res.render('client', { 'client': clientRes[0] });
    } else {
      collection.insert({
        "clientId": id,
        "totes": []
      },
      function(e,success){
        console.log('NOTFOUND', success);
        res.render('client', { 'clientRes': success });
      })

    }

  })

});

module.exports = router;
