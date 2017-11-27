var fs = require('fs');
var data = fs.readFileSync('conf.json', 'utf-8');
var conf = JSON.parse(data);
var express = require('express');
var BodyParser = require('body-parser')
var request = require('request-promise');
var router = express.Router();
var smarting_db = require('../db/smarting-db.js');

router.use(BodyParser.json()); // for parsing application/json
router.use(BodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded, 이거 안하면 json이 undefined로 뜸

router.get('/', (req, res) => {
  res.send('server is running...');
});

// doorbell button
router.get('/ispressed', function(req, res) {
  // console.log('get /ispressed');

  // getting latest data(test)
  smarting_db.Doorbell.findOne({}, {}, { sort: { 'date' : -1 } },function(err, post) {
    // console.log(post);
    res.json(post.date);
  });
});

// TODO 2017-11-02 FCM기능 모듈화, 여기에는 최소한의 코드만.
router.post('/ispressed', function(req, res) {
  console.log(req.body.ispressed);
  console.log(req.body.time);

  var ispressedData = req.body.ispressed;
  var timeData = req.body.time;

  // MongoDB
  var doorbell = new smarting_db.Doorbell();
  doorbell.ispressed = req.body.ispressed;
  doorbell.date = req.body.time;

  // FCM push notification
  if(req.body.ispressed == 1) {
    // HTTP request options
    var options = {
        method: "POST",
        uri:"http://fcm.googleapis.com/fcm/send",
        headers: {
          "authorization": conf.fcmauth
        },
        body: {
        	"to" : conf.fcmkey,
        	"content_available": true,
        	"notification": {
        		"title": "Smarting",
        		"body": "doorbell pressed!",
        		"click_action": "fcm.ACTION_HELLO",
        	},
        	"data": {
            	"ispressed": 1,
            	"time": (new Date())
        	}
        },
        json: true
    }

    // execute POST request
    request(options)
      .then(function (parsedBody) {
        console.log('POST Succeeded');
      })
      .catch(function (err) {
        console.log('POST failed');
      }
    );
  }

  doorbell.save(function(err) {
    if(err) {
      console.log('error : ' + err);
      res.json({result: 0});
      return;
    }

    res.json({result: 1});
    console.log('saved');
  })
  // console.log('doorbellDB.toJSON() : ' + doorbellDB.toJSON());
});

// temperature sensor
router.get('/temperature', function(req, res) {
  smarting_db.Temperature.findOne({}, {}, { sort: { 'time' : -1 } },function(err, post) {
    // console.log(post);
    res.json(post.current_temperature);
  });
});

router.post('/temperature', function(req, res) {
  console.log(req.body.current_temperature);
  console.log(req.body.time);

  var temperatureData = req.body.current_temperature;
  var timeData = req.body.time;

  var temperature = new smarting_db.Temperature();
  temperature.current_temperature = temperatureData;
  temperature.time = timeData;

  temperature.save(function(err) {
    if(err) {
      console.log('error : ' + err);
      res.json({result: 0});
      return;
    }

    res.json({result: 1});
    console.log('saved');
  });
});

//trash can
// TODO 받아온 거리 데이터가 터무니 없는 값이면 DB에 저장하지 않음. 열려있는지 체크해보라는 내용이 있었으면.
router.get('/trash', function(req, res) {
  smarting_db.Trash.findOne({}, {}, { sort: { 'time' : -1 } },function(err, post) {
    // console.log(post);
    res.json(post.percentage);
  });
});

router.post('/trash', function(req, res) {
  console.log(req.body);

  var heightData = req.body.current_height;
  var percentageData = req.body.percentage;
  var timeData = req.body.time;

  var trash = new smarting_db.Trash();
  trash.current_height = heightData;
  trash.percentage = percentageData;
  trash.time = timeData;

  trash.save(function(err) {
    if(err) {
      console.log('error : ' + err);
      res.json({result: 0});
      return;
    }

    res.json({result: 1});
    console.log('saved');
  });
});

module.exports = router;
