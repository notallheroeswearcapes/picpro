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
})

router.post('/fetch', (req, res) => {
    console.log("⚡️ Received request to /presets/fetch");
})

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /presets/upload");
})

module.exports = router;