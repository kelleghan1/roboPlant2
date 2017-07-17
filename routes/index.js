var express = require('express');
var router = express.Router();
var moment = require('moment');
var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/cultivato";

var client = new pg.Client(conString);
client.connect();

// var knex = require('knex');

var knex = require('knex')({
  client: 'postgres',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'cultivato'
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index');

});



router.post("/submit_id", function(req, res){
  knex('clients').where('client_name', req.body.data)
  .then(function(result){

    if (!result[0]) {
      knex('clients').returning('client_id').insert({client_name: req.body.data})
      .then(function(insertResult){

        console.log("$$$$$$$$$CLIENT CREATED", insertResult);
        res.send({clientExists: false, clientId: insertResult[0]});

      });

    }else{

      console.log("$$$$$$$$$CLIENT EXISTS", result);
      res.send({clientExists: true, clientId: result[0].client_id});

    }

  })

});


// router.post("/submit_id", function(req, res){
//   var db = req.db;
//   var collection = db.get('usercollection');
//   var id = req.body.data;
//
//   collection.find({'clientId': id})
//   .then(function(clientRes){
//
//     if (clientRes[0] !== undefined) {
//       res.send({clientExists: true});
//     } else {
//       collection.insert({
//         "clientId": id,
//         "modules": []
//       },
//       function(e,success){
//         res.send({clientExists: false});
//       })
//
//     }
//
//   })
//
// });


router.post("/get_client", function(req, res){
  // var clientId = req.body.data.clientId;
  // var clientName = req.body.data.clientName;

  var clientObj = {
    clientId: req.body.data.clientId,
    clientName: req.body.data.clientName,
    modules: []
  };

  knex('modules').where({client_id: req.body.data.clientId})
  .then(function(modulesResult){

    var updateModuleLoop = function(i){

      if (i <= modulesResult.length - 1) {

        knex('temperature_readings').where({module_id: modulesResult[i].module_id})
        .then(function(tempResult){

          modulesResult[i].temperature_readings = tempResult;

          knex('humidity_readings').where({module_id: modulesResult[i].module_id})
          .then(function(humidityResult){

            modulesResult[i].humidity_readings = humidityResult;

            knex('weight_readings').where({module_id: modulesResult[i].module_id})
            .then(function(weightResult){

              modulesResult[i].weight_readings = weightResult;

              clientObj.modules.push(modulesResult[i]);
              updateModuleLoop(i + 1);

            });

          });

        })

      }else{

        res.send(clientObj);
        return;

      }

    };

    updateModuleLoop(0);

  });

});


router.post("/get_module", function(req, res){


  console.log("^^^^^^^^^^^^^^^^^^^^^^^req.body", req.body);

  var moduleObj = {};

  knex('temperature_readings').where({module_id: req.body.moduleId})
  .then(function(temperatureResult){

    moduleObj.temperatureReadings = temperatureResult;

    knex('humidity_readings').where({module_id: req.body.moduleId})
    .then(function(humidityResult){

      moduleObj.humidityReadings = humidityResult;

      knex('weight_readings').where({module_id: req.body.moduleId})
      .then(function(weightResult){

        moduleObj.weightReadings = weightResult;
        console.log("***********OBJ", moduleObj);
        res.send(moduleObj);

      });

    });

  });

});


router.post('/create_module', function(req, res, next) {

  var clientId = req.body.data.clientId;
  var clientName = req.body.data.clientName;
  var moduleName = req.body.data.moduleName;
  var moduleType = req.body.data.moduleType;

  console.log("$$$$$$$$CREATE OBJ", req.body);

  knex('modules').where({client_id: clientId})
  .then(function(modulesResult){
    for (var i = 0; i < modulesResult.length; i++) {
      if (modulesResult[i].module_name == moduleName) {
        res.send({moduleExists: true});
        return;
      }
    };
    knex('modules').insert({client_id: clientId, module_name: moduleName, module_type: moduleType, sensor_id: 0, scale_id: 0})
    .then(function(insertResult){
      res.send(insertResult);
    })
  })

});


router.get('/get_clients', function(req, res, next) {
  var db = req.db;
  var collection = db.get('usercollection');

  collection.find()
  .then(function(clientRes){
    res.send(clientRes);
  });

});


router.post('/update_module', function(req, res, next) {
  // var clientId = req.body.clientId;
  // var moduleId = req.body.moduleId;
  // var sensorId = req.body.sensorId;
  // var scaleId = req.body.scaleId;
  // var moduleNotes = req.body.moduleNotes;

  knex('modules').where({sensor_id: req.body.sensorId})
  .update({sensor_id: 0})
  .then(function(clearSensor){

    knex('modules').where({scale_id: req.body.scaleId})
    .update({scale_id: 0})
    .then(function(clearScale){

      knex('modules').where({module_id: req.body.moduleId})
      .update({sensor_id: req.body.sensorId, scale_id: req.body.scaleId, module_notes: req.body.moduleNotes})
      .then(function(moduleResult){

        console.log("$$$$$$$UPDATE COMPLETE", moduleResult);
        res.send(moduleResult);

      });

    });

  });

});



// router.get('/asign_sensor/:data', function(req, res, next) {
//   var db = req.db;
//   var collection = db.get('usercollection');
//   var clientId = req.query.clientId;
//   var moduleId = req.query.moduleId;
//   var sensorId = parseInt(req.query.sensorId);
//
//
//   collection.update(
//     { "modules.sensorId": sensorId },
//     { $set: {"modules.$.sensorId": ''} }
//   )
//
//   collection.update(
//     { clientId: clientId, "modules.moduleId": moduleId },
//     { $set: {"modules.$.sensorId": sensorId} }
//   )
//   .then(function(result){
//     res.redirect('back');
//   })
//
// });

// router.get('/asign_scale/:data', function(req, res, next) {
//   var db = req.db;
//   var collection = db.get('usercollection');
//   var clientId = req.query.clientId;
//   var moduleId = req.query.moduleId;
//   var scaleId = parseInt(req.query.scaleId);
//
//
//   collection.update(
//     { "modules.scaleId": scaleId },
//     { $set: {"modules.$.scaleId": ''} }
//   )
//
//   collection.update(
//     { clientId: clientId, "modules.moduleId": moduleId },
//     { $set: {"modules.$.scaleId": scaleId} }
//   )
//   .then(function(result){
//     res.redirect('back');
//   })
//
// });


// router.get('/asign_notes/:data', function(req, res, next) {
//   var db = req.db;
//   var collection = db.get('usercollection');
//   var clientId = req.query.clientId;
//   var moduleId = req.query.moduleId;
//   var moduleNotes = req.query.moduleNotes;
//
//   collection.update(
//     { clientId: clientId, "modules.moduleId": moduleId },
//     { $set: {"modules.$.moduleNotes": moduleNotes} }
//   )
//   .then(function(result){
//     res.redirect('back');
//   })
//
// });


// router.post("/post_data/:data", function(req, res){
//   // var db = req.db;
//   // var collection = db.get('usercollection');
//   // var sensorRequest = req.params.data;
//   // var obj = JSON.parse(sensorRequest);
//   // var date = new Date();
//   var date = moment(new Date());
//
//   console.log("############DATE", date);
//
//   obj.serverParseTime = date;
//
//   if (obj.sensorid == 22) {
//
//     collection.update(
//       {"modules.scaleId": obj.sensorid},
//       { $push:
//         { "modules.$.scaleReadings": obj }
//       }
//     )
//
//   } else {
//
//     collection.update(
//       {"modules.sensorId": obj.sensorid},
//       { $push:
//         { "modules.$.sensorReadings": obj }
//       }
//     )
//
//   }
//
//
//   return;
//
// });


router.post("/post_data/:data", function(req, res){

  var sensorRequest = JSON.parse(req.params.data);
  var date = moment(new Date());

  console.log("$$$$$$$$$$$$$$$THE DATE", date);

  // console.log("$$$$$$$$$$$$$$$", sensorRequest);

  if (sensorRequest.hum1) {

    knex('modules').where({sensor_id: sensorRequest.sensorid})
    .then(function(moduleResult){

      // console.log("##########MOD RESULT", moduleResult);

      if (moduleResult.length) {


        knex('humidity_readings').insert({module_id: moduleResult[0].module_id, humidity_reading: parseFloat(sensorRequest.hum1), sensor_id: sensorRequest.sensorid, time: date})
        .then(function(res){
          // console.log("%%%%%RESULT HUM", res);
          knex('temperature_readings').insert({module_id: moduleResult[0].module_id, temperature_reading: parseFloat(sensorRequest.temp1), sensor_id: sensorRequest.sensorid, time: date})
          .then(function(res1){
            // console.log("%%%%%RESULT TEMP", res1);
            return;
          })
        })
      }


    })

  } else if (sensorRequest.weight1) {

    knex('modules').where({scale_id: sensorRequest.sensorid})
    .then(function(moduleResult){

      // console.log("##########MOD RESULT", moduleResult);

      if (moduleResult.length) {


        knex('weight_readings').insert({module_id: moduleResult[0].module_id, weight_reading: parseFloat(sensorRequest.weight1), sensor_id: sensorRequest.sensorid, time: date})
        .then(function(res3){
          // console.log("%%%%%RESULT WEIGHT", res3);
          return;
        })


      }

    });

  }

});






module.exports = router;
