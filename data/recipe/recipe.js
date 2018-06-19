/**
 * Created by rxudsk on 6/15/2018.
 */
const fs = require('fs');

const dataStorePath = "./recipeStore";

var count = 0;

const getFilePath = ()=> {
    return dataStorePath + "/" + count + ".json";
};

const getNewPath = () => {
    while (fs.existsSync(getFilePath())) {
        count++;
    }

    console.log(count);

    return getFilePath();
};

getNewPath();

const recipe = {
    add: (objStr) => {
        fs.writeFile(getNewPath(), objStr, (err) => {
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
            retVal.push(
                JSON.parse(fs.readFileSync(dataStorePath + "/" + file, 'utf-8'))
            );
        });

        return JSON.stringify(retVal);
    }
};

module.exports = recipe;
