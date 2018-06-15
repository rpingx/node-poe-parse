/**
 * Created by rxudsk on 6/14/2018.
 */
const express = require('express');
const app = express();
const data_path = "data_models";

app.get('/', function (req, res) {
    res.send('Obsession engine online.');
});

app.get('/reload', function (req, res) {
    var reload = require('./reload/reloadAll.js');
    res.send(reload.reload());
});

app.listen(80);

console.log("Listening on 80.");