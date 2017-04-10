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
        "modules": []
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


router.get('/get_clients', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  collection.find()
  .then(function(clientRes){
    console.log(clientRes);
    res.send(clientRes);
  });

});


router.get('/create_module/:data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;
  var moduleName = req.query.moduleName;

  if (moduleName !== '') {

    collection.update(
      {clientId: clientId},
      { $push:
        { modules:
          { moduleName: moduleName, moduleType: '', sensorId: '', scaleId: '', sensorReadings: [], scaleReadings: [] }
        }
      }
    )
    .then(function(result){
      res.redirect('back');
    })

  } else {
    res.redirect('back');
  }

});

router.get('/asign_sensor/:data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;
  var moduleName = req.query.moduleName;
  var sensorId = parseInt(req.query.sensorId);


  collection.update(
    { "modules.sensorId": sensorId },
    { $set: {"modules.$.sensorId": ''} }
  )

  collection.update(
    { clientId: clientId, "modules.moduleName": moduleName },
    { $set: {"modules.$.sensorId": sensorId} }
  )
  .then(function(result){
    res.redirect('back');
  })

});

router.get('/asign_scale/:data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;
  var moduleName = req.query.moduleName;
  var scaleId = parseInt(req.query.scaleId);


  collection.update(
    { "modules.scaleId": scaleId },
    { $set: {"modules.$.scaleId": ''} }
  )

  collection.update(
    { clientId: clientId, "modules.moduleName": moduleName },
    { $set: {"modules.$.scaleId": scaleId} }
  )
  .then(function(result){
    res.redirect('back');
  })

});

router.get('/asign_type/:data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;
  var moduleName = req.query.moduleName;
  var moduleType = req.query.moduleType;


  collection.update(
    { clientId: clientId, "modules.moduleName": moduleName },
    { $set: {"modules.$.moduleType": moduleType} }
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

  console.log('WEIGHT', obj);

  if (obj.sensorid == 22) {

    collection.update(
      {"modules.scaleId": obj.sensorid},
      { $push:
        { "modules.$.scaleReadings": obj }
      }
    )

  } else {

    collection.update(
      {"modules.sensorId": obj.sensorid},
      { $push:
        { "modules.$.sensorReadings": obj }
      }
    )

  }


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
