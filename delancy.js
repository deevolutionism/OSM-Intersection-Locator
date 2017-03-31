/*
Sorts through a .OSM file
Finds highways from ways
gets the node references from each highway
finds all the shared nodes from each highway
Outputs lat lon coordinate pairs from shared nodes.
*/
"use strict"
const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');
const inspect = require('eyes').inspector({maxLength: false})
const _ = require('lodash');

var parser = new xml2js.Parser();

// read .osm file
fs.readFile('../data/map_large.osm', function(err, data) {
  /* returns intersections output */

    //xml to json
    parser.parseString(data, function (err, result) {

        //get intersection lat lon coords and output to text file
        fs.writeFile('latlon.txt',getLatLon(findIntersections(fromWays(result),fromNodes(result))) , (err) => {
          if (err) throw err;
          console.log('It\'s saved!');
        });

    });
});


var getLatLon = (intersections) => {
  /* returns lat lon coordinates */
  var count = 0
  var latlonlist = ''
  intersections.forEach( (intersection) => {
    let latlon = `${intersection.lat}, ${intersection.lon}`
    console.log(latlon) // print lat lon to console
    count++ // keep track of how many intersections were found
    latlonlist += (latlon)
  })
  console.log('done!')
  console.log(count)
  return latlonlist
}


var fromWays = (result) => {
  /* sorts through ways to find only highways of certain types */

  var highways = [] //store highways
  var nodes = []
  var ways = result.osm.way
  var count = 0
  ways.forEach( ( way ) => {

    if(delanceyStreet(way)){
      // console.log(way)
      count++

      if(way.nd){
        // refs = removeDuplicates(way.nd)
        way.nd.forEach( (ref) => {
          nodes.push(ref.$.ref)
        })
      }

    }

  });

  // var noderefs = nodes.splice().sort()
  nodes = removeDuplicates(nodes.sort())
  console.log(count)
  // console.log(`${highways.length} ways`);
  // console.log(nodes.sort())
  return highways

}

var removeDuplicates = (nodes) => {

  //sort through the array of nodes
  var newArr = []

  // for(var i = 0; i<nodes.length;i++){
    //for each step, count upwards to find a match
    //[1,1,2,3]
    var i = 1;
    for(var j = 0; j<nodes.length;j++){
      //skip matching numbers
      if( nodes[i] != nodes[j]){
        //if the next number is differnt from the previous, add it.
        newArr.push(nodes[j])
      }
      i++
    // }
  }
  console.log(nodes.length)
  console.log('===========')
  console.log(newArr.length)
  return nodes
}

var delanceyStreet = (way) => {
  let delancey = false
  if(way.tag){
  for(var i = 0; i<way.tag.length;i++){
    if(way.tag[i].$.k == 'name'){
      if(way.tag[i].$.v == 'Delancey Street'){
        delancey = true
      }
    }
    }
  }
  return delancey
}

var fromNodes = (result) => {
  /* creates an array containing all nodes */

  var nodes = []

  result.osm.node.forEach( (node) => {

    nodes.push({
      id:node.$.id,
      lat:node.$.lat,
      lon:node.$.lon
    })

  })

  console.log(`${nodes.length} nodes`)

  return nodes
}


var findIntersections = (ways,nodes) => {
  /* takes highway refs and nodes, finds intersections*/

  //each way is composed of nodes.
  //find ways that share the same reference to a node.
  var refs = [] //

  var sorted_arr = fromNodeReferencesFrom(ways) //stores sorted arr of node refs from low to high
  // console.log(sorted_arr)
  for (var i = 0; i < sorted_arr.length - 1; i++) {
    //this loop finds adjacent refs from sorted_arr,
    if (sorted_arr[i + 1] == sorted_arr[i]) {
        //those are likely intersections bc they are the same.
        refs.push(sorted_arr[i]); //store them in refs
    }
  }

  var intersections = [] //store intersections
  //find the node lat and lon from the intersecting node refence
  nodes.forEach( (node) => {
    refs.forEach( ref => {if( node.id == ref){intersections.push(node)}})
  })

  //then, pull the lat/long from that node reference
  console.log(`got ${ways.length} ways and ${nodes.length} nodes!`)

  return intersections //return the intersections

}

var fromNodeReferencesFrom = (ways) => {
  /* pulls out the node references from each way,discarding all other junk... */
  var nodeReferences = []

  ways.forEach( ( way ) => {
    way.nd.forEach( ( nodeReference ) => {
        // console.log(inspect(nodeReference))
        nodeReferences.push(nodeReference.$.ref)
    });
  });

  return nodeReferences.slice().sort()
}
