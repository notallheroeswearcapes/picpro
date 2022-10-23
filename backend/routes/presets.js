const axios = require('axios');
const express = require('express');
require('dotenv').config();
const redis = require('redis');
const redisClient = redis.createClient();

const router = express.Router();

redisKeys = "dummy";
// example of json response
dummy = {
    presets: {
        width: 400,
        height: 200,
        greyscale: true,
        blackwhite: false,
        brightness: false,
        bri_set: 2,
        saturation: false,
        sat_set: 0.2,
        hue: false,
        hue_set: 180,
        blur: false,
        file: "jpeg"
    }
}

router.get('/test', (req, res) => {
    console.log("⚡️ Received request to /presets/test");

    redisClient.connect()
        .catch((err) => {
            console.log(err);
        });

    // save in redis
    // const redisJSON = JSON.parse(dummy.presets);
    const redisJSON = dummy.presets;
    redisJSON.source = "Redis Cache";
    redisClient.setEx(
        redisKeys,
        3600,
        JSON.stringify({ source: "Redis Cache", ...redisJSON })
    );

    // // retreive from redis
    // redisClient.get(redisKeys).then((result) => {
    //     if (result) {
    //         // insert code
    //         console.log(result)
    //     }
    // })
    // .catch((err) => {
    //     console.error(`❌ Error when fetching preset \'${redisKeys}\' from redis: ${err}`);
    // });

    res.send("Received successfully.")
});

router.get('/', (req, res) => {
    console.log("⚡️ Received request to /presets/");

    // return the "name" attributes of all stored preset objects in redis 
})

router.post('/fetch', (req, res) => {
    console.log("⚡️ Received request to /presets/fetch");

    // return a specific preset object by its "name" attribute that is passed in the request body
})

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /presets/upload");

    // upload a a preset object that is passed in the request body to redis and return a boolean if the operation was successful
    // we might change this later to a PUT method depending if we really need the success boolean, but it's fine for now
})

module.exports = router;