/**
 * Created by rxudsk on 6/14/2018.
 */
const fs = require('fs');
const express = require('express');
const jsonfile = require('jsonfile');

const dataStorePath = "./dataStore";
const indexStore = dataStorePath + "/index.json";
const timestamp = dataStorePath + "/time.flag";

const reload = require('./reload/reloadAll.js');

const recipe = require('./recipe/recipe.js');

const moment = require('moment');
const cors = require('cors');

var app = express();
app.use(cors());

app.use(express.static('../UI/dist'));

app.get('/', function (req, res) {
    res.send('Obsession engine online.');
});

app.get('/api/addRecipe', function (req, res) {
    try {
        var recipeStr = req.query.recipe;

        if (recipeStr == undefined) {
            res.send("no recipe defined");
        } else {
            recipe.add(JSON.parse(recipeStr));
            res.send("recipe added");
        }
    } catch (e) {
        res.send("recipe failed to be added");
    }
});

app.get('/api/getRecipes', function (req, res) {
    try {
        res.send(recipe.getAll());
    } catch (e) {
        res.send("failed to retrieve all recipes");
    }
});

app.get('/api/saveRecipe', function (req, res) {
    try {
        var recipeStr = req.query.recipe;

        if (recipeStr == undefined) {
            res.send("no recipe defined");
        } else {
            recipe.save(JSON.parse(recipeStr));
            res.send("recipe saved");
        }
    } catch (e) {
        res.send("recipe failed to be saved");
    }
});

app.get('/api/getItem', function (req, res) {
    try {
        jsonfile.readFile(
            dataStorePath + "/" + req.query.id + ".json",
            function (err, obj) {
                if (err) {
                    res.send("item not found");
                }
                res.send(JSON.stringify(obj));
            }
        );
    } catch (err) {
        res.send("item not found");
    }
});

app.get('/api/getList', function (req, res) {
    var ordered = [];
    jsonfile.readFile(
        indexStore,
        function (err, unordered) {
            if (err) {
                res.send("getList err: ", err);
            }

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
        }
    );
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
        res.send(reload());
    } else {
        res.send("Using cached values.");
    }
});

app.get('/api/forceReload', function (req, res) {
    res.send(reload());
});

app.listen(80);

console.log("Listening on 80.");