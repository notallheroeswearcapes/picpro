const axios = require('axios');
const express = require('express');
const sharp = require("sharp");
require('dotenv').config();

const router = express.Router();

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /images/upload");
    let imgBuffer = getBufferFromBase64(req.body.url);
    sharp(imgBuffer)
        .metadata()
        .then(metadataResult => {
            console.log(metadataResult);
            res.send(metadataResult);
        })
        .catch(error => {
            console.error(`❌ Error during image analysis for metadata: ${error}`);
        });
});

router.post('/transform', (req, res) => {
    // main endpoint for image transformation, use sharp here
    console.log("⚡️ Received request to /images/transform");
});

router.get('/', (req, res) => {
    // retrieves all images from S3
    console.log("⚡️ Received request to /images");
});

function getBufferFromBase64(url) {
    return Buffer.from(url.split(',')[1], 'base64');
}

module.exports = router;