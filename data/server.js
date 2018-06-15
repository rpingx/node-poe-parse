/**
 * Created by rxudsk on 6/14/2018.
 */
const fs = require('fs');
const express = require('express');
const app = express();

const recipe = "./recipe";

const dataStorePath = "./dataStore";
const indexStore = dataStorePath + "/index.json";
const timestamp = dataStorePath + "/time.flag";

const reload = require('./reload/reloadAll.js');

const moment = require('moment');

app.get('/', function (req, res) {
    res.send('Obsession engine online.');
});

app.get('/api/getItem', function (req, res) {
    try {
        var id = req.query.id;
        var itemObj = require(dataStorePath + "/" + id + ".json");
        res.send(JSON.stringify(itemObj));
    } catch (e) {
        res.send("item not found");
    }
});

app.get('/api/getList', function (req, res) {
    var ordered = [];
    var unordered = require(indexStore);
    Object.keys(unordered)
        .sort()
        .forEach((key) => {
            ordered.push(
                {
                    name: key,
                    id: unordered[key]
                }
            );
        });
    res.send(JSON.stringify(ordered));
});

app.get('/api/getTimestamp', function (req, res) {
    var timestampFlag;
    try {
        timestampFlag = moment.unix(fs.readFileSync(timestamp, 'utf-8')).format();
    } catch (e) {
        timestampFlag = "No data loaded.";
    }

    res.send(timestampFlag);
});

app.get('/api/reload', function (req, res) {
    var unixTime;
    try {
        unixTime = fs.readFileSync(timestamp, 'utf-8');
    } catch (e) {
        unixTime = 0;
    }

    if (moment().unix() - unixTime > 900) {
        res.send(reload.reload());
    } else {
        res.send("Using cached values.");
    }
});

app.get('/api/forceReload', function (req, res) {
    res.send(reload.reload());
});

app.listen(80);

console.log("Listening on 80.");