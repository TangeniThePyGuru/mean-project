/**
 * Created by tshikomba on 8/7/2018.
 */
const express = require('express');

const app = express();

app.use((req, res, next ) => {
     console.log('First middleware');
     next();
})

app.use((req, res, next) => {
    res.send('Gello from express');
})

module.exports = app;