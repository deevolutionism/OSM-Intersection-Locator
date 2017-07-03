"use strict"
// var intersections = require('./intersectionFinder')

// intersections.findIntersections('../data/map.osm')

var findIntersections = require('./osm-intersection-finder')

console.time('findIntersections')

findIntersections('../data/map.osm')

console.timeEnd('findIntersections')