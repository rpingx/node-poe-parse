/**
 * Created by rxudsk on 6/14/2018.
 */
const fs = require('fs');
const dataSources = require("./poeninja.json");
const request = require('request');
const async = require('async');

const indexStore = "./dataStore/index.json";

const q = async.queue((itemObj, callback) => {
    _writeToIndex(itemObj, callback);
}, 1);

q.drain = () => console.log("Index queue has been emptied.");

const _writeToIndex = (itemObj, callBack) => {
    fs.readFile(indexStore, (err, data) => {

        var dataHolder;
        if (err) {
            dataHolder = {};
        } else {
            try {
                dataHolder = JSON.parse(data);
            } catch (e) {
                dataHolder = {};
            }
        }


        dataHolder[itemObj.name] = itemObj.id;

        fs.writeFile(indexStore, JSON.stringify(dataHolder, null, 2), (err) => {
            // throws an error, you could also catch it here
            if (err) {
                console.log("error writing data: ", dataHolder);
                throw err;
            }

            // success case, the file was saved
            console.log('data saved!');
        });

        callBack();
    });
};

const queueAdd = (itemObj) => {
    q.push(itemObj, (err) => {
        if (err) {
            return console.log('error in adding tasks to queue');
        }
        console.log('pushed');
    });
};

const parser = {
    reload: () => {
        request("https://poe.ninja/api/data/currencyoverview?league=Incursion&type=Currency",
            (error, response, body) => {
                var data = JSON.parse(body);
                queueAdd({id: 12, name: "Hats"});
                queueAdd({id: 45, name: "Herm"});
                queueAdd({id: 67, name: "Hlerm"});
                queueAdd({id: 120, name: "Boots"});
            }
        );

        return "Working on ";
    }

};

module.exports = parser;
