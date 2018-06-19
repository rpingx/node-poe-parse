/**
 * Created by rxudsk on 6/18/2018.
 */
import deepEquals from 'fast-deep-equal';

export default {
    // filter
    unique: function (value, index, arr) {
        for (var i = 0; i < index; i++) {
            if (deepEquals(arr[i], value)) {
                return false;
            }
        }
        return true;
    },
    propertyEquals: function (field, value) {
        return function (obj) {
            return obj[field] === value;
        }
    },
    remove: function (field) {
        return function (obj) {
            obj[field] = undefined;
            return obj;
        }
    },
    // map
    mapTo: function (field) {
        return function (obj) {
            return obj[field];
        }
    },
    keysToValues: function (map) {
        return function (key) {
            return map[key];
        }
    },
    // sort
    compare: function (field) {
        return function (a, b) {
            return a[field].localeCompare(b[field]);
        }
    },
    // reduce
    flatten: function (newArr, value) {
        return newArr.concat(value);
    },
    max: function (prev, current) {
        return (prev > current) ? prev : current;
    },
    intersect: function (otherArr) {
        return function (accumulator, currentValue) {
            if (accumulator.indexOf(currentValue) === -1// No reason to add if already exists
                && otherArr.indexOf(currentValue) !== -1) {
                accumulator.push(currentValue);
            }

            return accumulator;
        }
    },


    //others
    getDebouncer: function (defDelay) {
        var defaultDelay = defDelay === undefined ? 300 : defDelay;
        var timeoutID = {};
        return function (name) {
            return function (func, delay) {
                clearTimeout(timeoutID[name]);
                timeoutID[name] = setTimeout(func, delay === undefined ? defaultDelay : delay);
            }
        };
    }
}