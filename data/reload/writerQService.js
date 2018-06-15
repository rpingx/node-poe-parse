/**
 * Created by rxudsk on 6/15/2018.
 */
/**
 * Created by rxudsk on 6/14/2018.
 */
const fs = require('fs');
const async = require('async');
const dataStorePath = "./dataStore";
const indexStore = dataStorePath + "/index.json";

var nameIdList = [];

const q = async.queue((itemObj, callback) => {
    _writeToIndex(itemObj, callback);
}, 1);

q.drain = () => {
    var holder = nameIdList;
    nameIdList = [];

    var dataHolder;
    try {
        dataHolder = JSON.parse(fs.readFileSync(indexStore, 'utf-8'));
    } catch (e) {
        console.log("err:", e);
        dataHolder = {};
    }

    holder.forEach((itemObj)=> {
        var key = itemObj.name;

        if (itemObj.baseType != null) {
            key += " [" + itemObj.baseType + "]";
        }

        if (itemObj.variant != null) {
            key += ", " + itemObj.variant + " ";
        }

        if (itemObj.links != null && itemObj.links != 0) {
            key += " {" + itemObj.links + "}";
        }

        while (dataHolder[key] != undefined) {
            key += " ";
        }

        dataHolder[key] = itemObj.id;
    });

    fs.writeFileSync(indexStore, JSON.stringify(dataHolder, null, 2));
};



const _writeToIndex = (itemObj, callBack) => {
    nameIdList.push(itemObj);

    writeDataAsync(dataStorePath + "/" + itemObj.id + ".json", itemObj);

    callBack();
};

const writeDataAsync = (path, data) => {
    fs.exists(path, (exists) => {
        if (exists) {
            console.log("file (" + path + ") exists");
            console.log(fs.readFileSync(path, 'utf-8'));
        }

        fs.writeFile(path, JSON.stringify(data, null, 2), (err) => {
            // throws an error, you could also catch it here
            if (err) {
                console.log("error writing data: ", err);
                throw err;
            }
        });
    });

};

const queueAdd = (itemObj) => {

    q.push(itemObj, (err) => {
        if (err) {
            return console.log('error in adding tasks to queue');
        }
    });
};

module.exports = queueAdd;
