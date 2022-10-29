const axios = require('axios');
const express = require('express');
require('dotenv').config();

const router = express.Router();

// Redis setup
const redis = require('redis');
const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});
redisClient.connect();

redisClient.on("connect", () => {
    console.log("✅ Successfully connected to Redis")
});

router.get('/', (_, res) => {
    console.log("⚡️ Received request to /presets/");

    // return the "name" attributes of all stored preset objects in redis

    const keyNames = [];
    redisClient.keys('*').then((result) => {
        for (var i = 0; i < result.length; i++) {
            keyNames.push(result[i]);
        }
        console.log(`ℹ Retrieved ${result.length} presets from redis`);
        res.send(keyNames);
    })
        .catch((err) => {
            console.error(`❌ Error during preset listing from redis: ${err}`);
        });
})

router.post('/fetch', (req, res) => {
    console.log("⚡️ Received request to /presets/fetch");

    // return a specific preset object by its "name" attribute that is passed in the request body
    // retrieve from redis
    const redisKey = req.body.name;

    redisClient.get(redisKey)
        .then((result) => {
            if (result) {
                console.log(`✅ Successfully fetched preset \'${redisKey}\' from Redis`);
                res.send(JSON.parse(result));
            }
        })
        .catch((err) => {
            console.error(`❌ Error when fetching preset \'${redisKey}\' from Redis: ${err}`);
        });
})

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /presets/upload");

    // upload a a preset object that is passed in the request body to redis and return a boolean if the operation was successful
    // we might change this later to a PUT method depending if we really need the success boolean, but it's fine for now
    const redisKey = req.body.name;
    const redisJSON = req.body;

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