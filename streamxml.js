"use strict"
const fs = require('fs');
const XMLStream = require('xml-stream')
// const stream = require('stream')
// const xml2js = require('xml2js');
// const util = require('util');
const inspect = require('eyes').inspector({maxLength: false})
const _ = require('lodash')

// var parser = new xml2js.Parser()
var count = 0;
// var stream = fs.createReadStream('boston_massachusetts.osm')
var stream = fs.createReadStream('boston_massachusetts.osm')
var xml = new XMLStream(stream);

// xml.preserve('nodes', true);
// xml.collect('$');
// xml.on('endElement: node', function(item) {
//   if( item.$.)
//   count++
//   console.log(inspect(item));
//   console.log(count)
// });

xml.collect('tag')
xml.on('endElement: way', function(item) {
  count++
  console.log(inspect(item));
  console.log(count)
});



// fs.readFile(__dirname + '/boston_massachusetts.osm', function(err, data) {
//     parser.parseString(data, function (err, result) {
//
//         console.log(inspect(result.osm.way.length));
//         // console.log(inspect(result.osm.way));
//         // console.log(result.osm.way.length)
//         // var intersections = findIntersections(fromWays(result),fromNodes(result))
//         // console.log(inspect(intersections));
//
//         // console.log(getLatLon(findIntersections(fromWays(result),fromNodes(result))))
//     });
// });
