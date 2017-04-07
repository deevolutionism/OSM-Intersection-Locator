/*
Sorts through a .OSM file
Finds highways from ways
gets the node references from each highway
finds all the shared nodes from each highway
Outputs lat lon coordinate pairs from shared nodes.
*/


/*
Some streets have duplicate references to a node
the duplicate refences must be removed from each
individual street before the findintersections function
is called. Otherwise, this will lead to eroneous lat lon
coordinates. The findintersections function assumes
that duplicate node refs are an intersection, but doesn't
take into account if the node refs are from different ways.
duplicate node refs from the same way will therefor count
as an intersection.
*/

"use strict"
const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');
const inspect = require('eyes').inspector({maxLength: false})
const _ = require('lodash');

var parser = new xml2js.Parser();

var dict = {'street_names':{}}

// read .osm file
fs.readFile('../data/map.osm', function(err, data) {
  /* returns intersections output */

    //xml to json
    parser.parseString(data, function (err, result) {
      getLatLon(findIntersections(fromWays(result),fromNodes(result)))
        //get intersection lat lon coords and output to text file
        // fs.writeFile('latlon.txt',getLatLon(findIntersections(fromWays(result),fromNodes(result))) , (err) => {
        //   if (err) throw err;
        //   console.log('It\'s saved!');
        // });

    });
});


var getLatLon = (intersections) => {
  /* returns lat lon coordinates */
  console.log('intersections:')
  console.log(intersections)
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

  var ways = result.osm.way

  ways.forEach( ( way ) => {
    if(way.tag){
      way.tag.forEach( ( tag ) => {
        if(tag.$.k == 'highway'){
          if(tag.$.v == 'primary' || tag.$.v == 'secondary' ||
             tag.$.v == 'motorway' || tag.$.v == 'trunk' ||
             tag.$.v == 'tertiary' || tag.$.v == 'residential' ||
             tag.$.v == 'service' || tag.$.v == 'unclassified' ||
             tag.$.v == 'road' || tag.$.v == 'living_street'
           ) {
             highways.push(way);
            //  console.log(way)
  }}});}});

  //create a dictionary of all the streets.
  /*
  {
    street_name: [array_of_node_refs]
    delancey: [],
    prospect: [],
    laffayette: [],
    ...
  }
  */
  highways.forEach( (highway) => {
    if(highway.tag){
      for(var i = 0; i<highway.tag.length;i++){
        if(highway.tag[i].$.k == 'name'){
          var street_name = highway.tag[i].$.v
          console.log(street_name)
          if(dict.street_names[street_name] == undefined){
              //street isn't in the dictionary yet, so add it.
              dict.street_names[street_name] = []
              // console.log(inspect(dict))
              highway.nd.forEach( (obj) => {
                dict.street_names[street_name].push(obj.$.ref)
              })
          } else {
            //street already exists in dictionary, add node refs to it.
            if(highway.nd){
              highway.nd.forEach( (obj) => {
                dict.street_names[street_name].push(obj.$.ref)
              })
            }
          }
        }
      }
    }
  })

  // console.log(inspect(dict))
  var cleanedHighways = []
  //sort each highway and remove any duplicates
  // var cleanedHighways = dict.street_names.map( (street)=>{ removeDuplicatesFrom(street) })
  for (var key in dict.street_names) {
    if (dict.street_names.hasOwnProperty(key)) {
      // var cleanedRefs = removeDuplicatesFrom(dict.street_names[key].sort(),key)
      cleanedHighways.concat(removeDuplicatesFrom(dict.street_names[key].sort(),key))

      console.log(cleanedHighways)
    }
  }
  console.log(inspect(cleanedHighways))
  console.log(`${highways.length} ways`);
  return highways

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
  console.log(`Finding intersections from ${ways.length} ways and ${nodes.length} nodes`);
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

  // console.log(intersections.length)
  return intersections //return the intersections

}

var removeDuplicatesFrom = (street_node_refs,street_name) => {

  //sort through the array of nodes
  var newArr = []
  //for each step, count upwards to find a match
  //[1,1,2,3]
  var i = 1;
  for(var j = 0; j<street_node_refs.length;j++){
    //skip matching numbers
    if( street_node_refs[i] != street_node_refs[j]){
      //if the next number is differnt from the previous, add it.
      newArr.push(street_node_refs[j])
    }
    i++
  }

  // console.log(street_node_refs.length)
  // console.log('===========')
  // console.log(newArr.length)
  console.log(`removed ${street_node_refs.length - newArr.length} duplicates from ${street_name}`)
  return newArr
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

  return nodeReferences.splice().sort()
}

// var removeDuplicates = (obj) =>{
//   var newArr = []
//
//   var i = 1;
//   for(var j = 0; j<nodes.length;j++){
//     //skip matching numbers
//     if( nodes[i] != nodes[j]){
//       //if the next number is differnt from the previous, add it.
//       newArr.push(nodes[j])
//     }
//     i++
//   }
//
//   return newArr
// }
