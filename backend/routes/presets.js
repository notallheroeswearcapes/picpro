const axios = require('axios');
const express = require('express');
require('dotenv').config();

const router = express.Router();

router.get('/test', (req, res) => {
    console.log("⚡️ Received request to /presets/test");
    res.send("Received successfully.")
});

module.exports = router;