/**
 * Created by rxudsk on 6/15/2018.
 */
const fs = require('fs');

const dataStorePath = "./recipeStore";
const jsonfile = require('jsonfile');

var count = 0;

const getFilePath = ()=> {
    return dataStorePath + "/" + count + ".json";
};

const getNewPath = () => {
    while (fs.existsSync(getFilePath())) {
        count++;
    }

    return getFilePath();
};

const getFilePathById = (id)=> {
    return dataStorePath + "/" + id + ".json";
};

getNewPath();

const recipe = {
    add: (obj) => {
        var path = getNewPath();
        obj.id = count;
        fs.writeFile(path, JSON.stringify(obj), (err) => {
            // throws an error, you could also catch it here
            if (err) {
                console.log("error writing data: ", err);
                throw err;
            }
        });
    },
    getAll: () => {
        var retVal = [];
        var files = fs.readdirSync(dataStorePath);

        files.forEach(file => {
            var obj = JSON.parse(fs.readFileSync(dataStorePath + "/" + file, 'utf-8'));
            if (obj.profit == undefined) {
                obj.profit = 0;
            }

            obj.input.forEach(
                function (entry) {
                    if (entry.url == undefined) {
                        entry.url = "";
                    }

                    if (entry.chaosValue == undefined) {
                        entry.chaosValue = "";
                    }
                }
            );

            obj.output.forEach(
                function (entry) {
                    if (entry.url == undefined) {
                        entry.url = "";
                    }

                    if (entry.chaosValue == undefined) {
                        entry.chaosValue = "";
                    }
                }
            );

            retVal.push(
                obj
            );
        });

        return JSON.stringify(retVal);
    },
    save: (obj) => {
        jsonfile.writeFile(getFilePathById(obj.id), obj, (err)=> {
            // throws an error, you could also catch it here
            if (err) {
                console.log("error writing data: ", err);
                throw err;
            }
        });
    }
};

module.exports = recipe;