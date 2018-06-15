/**
 * Created by rxudsk on 6/15/2018.
 */
const dataSources = require("./incursion.json");
const writerService = require('./writerQService.js');

const incursion = {
    reload: () => {
        dataSources.forEach((itemObj) => {
                        writerService(itemObj);
        });
    }

};

module.exports = incursion;
