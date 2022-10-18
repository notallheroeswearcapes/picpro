const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const port = process.env.PORT;
imagesRouter = require('./routes/images.js');
presetsRouter = require('./routes/presets.js');

app.listen(port, (error) => {
    if (!error) {
        console.log("⚡️ Server is successfully running and listening on port " + port);
    }
    else {
        console.log("❌ Error occurred during server startup", error);
    }
});

app.use('/images?', imagesRouter);
app.use('/presets?', presetsRouter);