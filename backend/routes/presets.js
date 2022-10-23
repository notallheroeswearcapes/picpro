const axios = require('axios');
const express = require('express');
require('dotenv').config();

const router = express.Router();

// example of json response
dummy = {
    presetName: "dummy",
    transformation: {
        outputType: "jpeg",
        width: 400,
        height: 200,
        flip: false,
        flop: false,
        sharpen: false,
        blur: false,
        greyscale: true,
        blackwhite: false
    }
}

// example of json response
dummy1 = {
    presetName: "dummy1",
    transformation: {
        outputType: "png",
        width: 200,
        height: 400,
        flip: false,
        flop: false,
        sharpen: false,
        blur: true,
        greyscale: false,
        blackwhite: false
    }
}

// This section will change for Cloud Services
// Redis setup
const redis = require('redis');

const redisClient = redis.createClient();
redisClient.connect();

redisClient.on("connect", function (result) {
    console.log("Successful Connection to Redis")
});

router.get('/test', (req, res) => {
    console.log("⚡️ Received request to /presets/test");

    res.send("Received successfully.")
});

router.get('/', (req, res) => {
    console.log("⚡️ Received request to /presets/");

    // return the "name" attributes of all stored preset objects in redis
    redisClient.keys('*', function (err, keys) {
        if (err) return console.log(err);
         
        for(var i = 0, len = keys.length; i < len; i++) {
          console.log(keys[i]);
        }
      })
    .catch((err) => {
        console.error(`❌ Error when fetching preset * from redis: ${err}`);
    });
})

router.post('/fetch', (req, res) => {
    console.log("⚡️ Received request to /presets/fetch");

    // return a specific preset object by its "name" attribute that is passed in the request body
    // retreive from redis
    const redisKey = dummy1.presetName
    redisClient.get(redisKey).then((result) => {
        if (result) {
            // insert code
            console.log(result);
            res.send(result);
        }
    })
    .catch((err) => {
        console.error(`❌ Error when fetching preset \'${redisKey}\' from redis: ${err}`);
    });
})

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /presets/upload");

    // upload a a preset object that is passed in the request body to redis and return a boolean if the operation was successful
    // we might change this later to a PUT method depending if we really need the success boolean, but it's fine for now
    const redisJSON = dummy.transformation;
    const redisKey = dummy.presetName;
    redisClient.setEx(
        redisKey,
        3600,
        JSON.stringify({ redisJSON })
    ).then((result) => {
        console.log(`✅ Successfully uploaded preset \'${redisKey}\' to Redis: ${result}`);
        res.send(`✅ Successfully uploaded preset \'${redisKey}\' to Redis: ${result}`);
    })
    .catch((err) => {
        console.error(`❌ Error during upload of preset \'${redisKey}\' to Redis: ${err}`);
        res.send(`❌ Error during upload of preset \'${redisKey}\' to Redis: ${err}`);
    });
})

module.exports = router;