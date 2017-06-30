'use strict'
var path = require('path')
var fs = require('fs')
/**
 * Adds commas to a number
 * @param {number} number
 * @param {string} locale
 * @return {string}
 */

console.log(path.extname('../data/map.osm'))

console.log(fs.filesize('../data/map.osm'))

module.exports = function(number, locale) {
    return number.toLocaleString(locale);
};