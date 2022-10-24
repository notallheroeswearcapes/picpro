const axios = require('axios');
const express = require('express');
require('dotenv').config();

const router = express.Router();

// example of json response
dummy = {
    name: "dummy",
    transformation: {
        outputType: "PNG",
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
    name: "dummy1",
    transformation: {
        outputType: "JPEG",
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

actual = {
    outputType: 'PNG',
    flip: false,
    flop: false,
    sharpen: false,
    blur: true,
    greyscale: false,
    blackwhite: false,
    imageName: 'original.png',
    width: 780,
    height: 460
}

// This section will change for Cloud Services
// Redis setup
const redis = require('redis');

const redisClient = redis.createClient();
redisClient.connect();

redisClient.on("connect", () => {
    console.log("Successful Connection to Redis")
});

router.get('/', (_, res) => {
    console.log("⚡️ Received request to /presets/");

    // return the "name" attributes of all stored preset objects in redis

    const keyNames = [];
    redisClient.keys('*').then((result) => {
        for (var i = 0; i < result.length; i++) {
            keyNames.push(result[i]);
        }
        console.log(`ℹ Retrieved ${result.length} images from S3`);
        res.send(keyNames);
    })
        .catch((err) => {
            console.error(`❌ Error when fetching preset * from redis: ${err}`);
        });
})

router.post('/fetch', (req, res) => {
    console.log("⚡️ Received request to /presets/fetch");

    console.log(req.body)

    // return a specific preset object by its "name" attribute that is passed in the request body
    // retreive from redis
    // const redisKey = dummy1.name
    const redisKey = req.body.name;

    redisClient.get(redisKey)
        .then((result) => {
            if (result) {
                // insert code
                console.log(JSON.parse(result));
                res.send(JSON.parse(result));
            }
        })
        .catch((err) => {
            console.error(`❌ Error when fetching preset \'${redisKey}\' from redis: ${err}`);
        });
})

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /presets/upload");

    console.log(req.body);

    // upload a a preset object that is passed in the request body to redis and return a boolean if the operation was successful
    // we might change this later to a PUT method depending if we really need the success boolean, but it's fine for now
    // const redisJSON = dummy1.transformation;
    // const redisKey = dummy1.name;
    // const redisJSON = req.body.transformation;
    const redisKey = req.body.name;
    const redisJSON = req.body;

    // console.log(redisJSON);

    redisClient.set(redisKey, JSON.stringify({ ...redisJSON }))
        .then((result) => {
            console.log(`✅ Successfully uploaded preset \'${redisKey}\' to Redis: ${result}`);
            res.send(true);
        })
        .catch((err) => {
            console.error(`❌ Error during upload of preset \'${redisKey}\' to Redis: ${err}`);
            res.send(false);
        });
})

module.exports = router;