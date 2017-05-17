

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  res.render('index');

});



router.post("/submit_id", function(req, res){
  var db = req.db;
  var collection = db.get('usercollection');
  var id = req.body.data;

  collection.find({'clientId': id})
  .then(function(clientRes){

    if (clientRes[0] !== undefined) {
      res.send({clientExists: true});
    } else {
      collection.insert({
        "clientId": id,
        "modules": []
      },
      function(e,success){
        res.send({clientExists: false});
      })

    }

  })

});


router.post("/get_client", function(req, res){
  var db = req.db;
  var collection = db.get('usercollection');
  var id = req.body.data;

  console.log('GETID**************', id);

  collection.find({'clientId': id})
  .then(function(clientRes){
    console.log('GETDB**************', clientRes);

    res.send(clientRes);

  })

});


router.post('/create_module', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.body.data.clientId;
  var moduleId = req.body.data.moduleId;
  var moduleType = req.body.data.moduleType;

  console.log(req.body.data.clientId);

  collection.update(
    {clientId: clientId},
    { $push:
      { modules:
        { moduleId: moduleId, moduleType: moduleType, moduleNotes: '', sensorId: '', scaleId: '', sensorReadings: [], scaleReadings: [] }
      }
    }
  )
  .then(function(result){
    console.log('RESULT', result);
    res.send(result);
  })



});


// router.get("/moduleId/:clientId/:moduleId", function(req, res){
//   var db = req.db;
//   var collection = db.get('usercollection');
//   var id = req.params.clientId;
//   var moduleId = req.params.moduleId;
//
//   collection.find({'clientId': id})
//   .then(function(clientRes){
//
//     res.render('module', { 'clientRes': clientRes[0], 'moduleId': moduleId });
//
//   })
//
// });


// router.post('/get_client', function(req, res, next) {
//   var db = req.db;
//   var collection = db.get('usercollection');
//
//   var clientId = req;
//
//   console.log('GETCLIENT**************', clientId);
//
//   collection.find({'clientId': clientId})
//   .then(function(clientRes){
//
//     console.log('GETCLIENTDB**************', clientRes[0]);
//
//     res.send(clientRes[0]);
//
//   })
//
// });


router.get('/get_clients', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  collection.find()
  .then(function(clientRes){
    res.send(clientRes);
  });

});


// router.get('/create_module/:data', function(req, res, next) {
//   var db = req.db;
//   var collection = db.get('usercollection');
//   var clientId = req.query.clientId;
//   var moduleId = req.query.moduleId;
//   var moduleType = req.query.moduleType;
//
//   if (moduleId !== '') {
//
//     collection.update(
//       {clientId: clientId},
//       { $push:
//         { modules:
//           { moduleId: moduleId, moduleType: moduleType, moduleNotes: '', sensorId: '', scaleId: '', sensorReadings: [], scaleReadings: [] }
//         }
//       }
//     )
//     .then(function(result){
//       res.redirect('back');
//     })
//
//   } else {
//     res.redirect('back');
//   }
//
// });


router.post('/update_module', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.body.data.clientId;
  var moduleId = req.body.data.moduleId;
  var moduleType = req.body.data.moduleType;

  console.log(req.body.data.clientId);

  collection.update(
    {clientId: clientId},
    { $push:
      { modules:
        { moduleId: moduleId, moduleType: moduleType, moduleNotes: '', sensorId: '', scaleId: '', sensorReadings: [], scaleReadings: [] }
      }
    }
  )
  .then(function(result){
    console.log('RESULT', result);
    res.send(result);
  })



});



router.get('/asign_sensor/:data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;
  var moduleId = req.query.moduleId;
  var sensorId = parseInt(req.query.sensorId);


  collection.update(
    { "modules.sensorId": sensorId },
    { $set: {"modules.$.sensorId": ''} }
  )

  collection.update(
    { clientId: clientId, "modules.moduleId": moduleId },
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
  var moduleId = req.query.moduleId;
  var scaleId = parseInt(req.query.scaleId);


  collection.update(
    { "modules.scaleId": scaleId },
    { $set: {"modules.$.scaleId": ''} }
  )

  collection.update(
    { clientId: clientId, "modules.moduleId": moduleId },
    { $set: {"modules.$.scaleId": scaleId} }
  )
  .then(function(result){
    res.redirect('back');
  })

});


router.get('/asign_notes/:data', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');
  var clientId = req.query.clientId;
  var moduleId = req.query.moduleId;
  var moduleNotes = req.query.moduleNotes;

  collection.update(
    { clientId: clientId, "modules.moduleId": moduleId },
    { $set: {"modules.$.moduleNotes": moduleNotes} }
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






module.exports = router;
