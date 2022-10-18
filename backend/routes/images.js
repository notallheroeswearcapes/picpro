const axios = require('axios');
const express = require('express');
const sharp = require("sharp");
require('dotenv').config();

const router = express.Router();

router.post('/upload', (req, res) => {
    console.log("⚡️ Received request to /upload");
    res.send("Received image successfully.")
});

router.post('/transform', (req, res) => {
    // main endpoint for image transformation, use sharp here
});

module.exports = router;