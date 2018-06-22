/**
 * Created by rxudsk on 6/15/2018.
 */
const fs = require('fs');
const poeNinja = require('./poeninja.js');
const incSupp = require('./incursionSupplement.js');

const dataStorePath = "./dataStore";
const indexStore = dataStorePath + "/index.json";
const timestamp = dataStorePath + "/time.flag";

const moment = require('moment');

const reload = () => {
    var path = dataStorePath;
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
    }

    if (!fs.existsSync(dataStorePath)) {
        fs.mkdirSync(dataStorePath);
    }

    fs.writeFileSync(indexStore, JSON.stringify({}));

    poeNinja.reload();
    incSupp.reload();

    fs.writeFileSync(timestamp, moment().unix());

    return "Data reloaded.";
};


module.exports = reload;
