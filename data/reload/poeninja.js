/**
 * Created by rxudsk on 6/14/2018.
 */
const dataSources = require("./poeninja.json");
const request = require('request');
const writerService = require('./writerQService.js');

const getParser = (url) => {
    var type = url.substring(url.indexOf("type=") + 5);

    if (url.indexOf('currency') > -1) {
        return getCurrencyParser(type);
    } else {
        return getNoncurrencyParser(type);
    }
};

const getCurrencyParser = (type) => {
    return (error, response, body) => {
        var data = JSON.parse(body);

        var nameMap = data.currencyDetails.reduce(
            (accrue, entry) => {
                accrue[entry.name] = entry;

                return accrue;
            }, {}
        );

        data.lines.forEach((entry)=> {
                var name = entry.currencyTypeName;
                var nameObj = nameMap[name];

                var itemObj = {};
                itemObj.id = type + "." + nameObj.id;
                itemObj.name = name;
                itemObj.icon = nameObj.icon;
                itemObj.desc = name;
                itemObj.chaosValue = entry.chaosEquivalent;

                writerService(itemObj);
            }
        );
    };
};


const getNoncurrencyParser = (type) => {
    return (error, response, body) => {
        var data = JSON.parse(body);

        data.lines.forEach((entry)=> {
                var itemObj = {};
                itemObj.id = type + "." + entry.id;
                itemObj.name = entry.name;
                itemObj.icon = entry.icon;
                itemObj.desc = entry.flavourText.replace(/\|/g, '');
                itemObj.chaosValue = entry.chaosValue;
                itemObj.links = entry.links;
                itemObj.variant = entry.variant;
                itemObj.baseType = entry.baseType;

                writerService(itemObj);
            }
        );
    };
};

const parser = {
    reload: () => {
        dataSources.forEach((src) => {
            request(src, getParser(src));
        });
    }

};

module.exports = parser;
