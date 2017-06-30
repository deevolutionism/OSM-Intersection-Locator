"use strict"
const fs = require('fs');
const xml2js = require('xml2js')
const util = require('util')
const inspect = require('eyes').inspector({maxLength: false})
const _ = require('lodash');
const path = require('path')

const parser = new xml2js.Parser()


const intersectionFinder = ( () => {

	var data = {},
		maxFileSizeInMegaBytes = 100,
		dict = {'street_names':{}},
		cleanedHighways = []

	const parseFile = file => {
		/* 
		initial function that parses the osm file
		and returns intersections
		*/
		fs.readFile(file, (err, data) => {
			if(err){
				console.error('error reading file')
			} else {
				//use xml2json to parse osm
				parser.parseString(data, (err, result) => {
					getLatLon(findIntersections(fromWays(result),fromNodes(result)))
				})
			}
		})
	}

	const getLatLon = intersections => {
		/* 
		Returns latitude and longitude from each intersection
		*/

		let count = 0,
		latlonlist = ''


		intersections.forEach( intersection => {
			let latlon = `${intersection.lat}, ${intersection.lon}`
			//print the final output to console
			// THIS NEEDS TO WRITE TO A FILE? MAYBE? 
			console.log(latlon)
			count++
			latlonlist += latlon
		})
		console.log('done!')
		return latlonlist
	}

	const findIntersections = (node_references, nodes) => {
		/* 
		takes an array of highway node references and an array of actual nodes
		and searches for intersections. An intersection is found if any 2 or more ways
		share the same node reference.
		*/
		console.log(`Finding intersections from ${node_references.length} ways and ${nodes.length} nodes`)

		var cleaned_references = []

		//stores sorted array of node references. 
		//numbers that are the same are grouped sequentially.
		var sorted_references = node_references.sort()

		for(var i = 0; i < sorted_references.length - 1; i++){
			//this loop looks at the adjacent node reference
			// from the sorted array. Any duplicate node refences
			//are likely intersections because 2 ways share a commen node.
			if(sorted_references[i + 1] == sorted_references[i]){
				//store node reference for later
				cleaned_references.push(sorted_references[i])
			}
		}

		var intersections = []
		//nested for loops are inneficient
		//O(n^2)
		//possible remedy: hashmaps?
		nodes.forEach( node => {
			
			cleaned_references.forEach( ref => {
				if(node.id == ref){
					intersections.push(node)
				}
			})
		})

		return intersections

	}

	const fromWays = result => {
		/*
		Sorts through ways to find only highways of certain types.
		A highway is any
		*/

		var highways = []
		var ways = result.osm.way
		// highways.reduce

		// result.osm.way.forEach( way => {
		// 	//store all the ways which contain some
		// 	//form of highway data
		// 	if(way.tag){
		// 		if(way.tag.find(highway) != undefined){
		// 			if(way.tag.find(highwaytype)){
		// 				console.log(way)
		// 				highways.push(way)
		// 			}
		// 		}
		// 	}
		// }) 

		ways.forEach( ( way ) => {
		    if(way.tag){
		      way.tag.forEach( ( tag ) => {
		        if(tag.$.k == 'highway'){
		          if(tag.$.v == 'primary' || tag.$.v == 'secondary' ||
		             tag.$.v == 'motorway' || tag.$.v == 'trunk' ||
		             tag.$.v == 'tertiary' || tag.$.v == 'residential' ||
		             tag.$.v == 'service' ||
		             tag.$.v == 'road' || tag.$.v == 'living_street'
		           ) {
		             highways.push(way);
		            //  console.log(way)
		  }}});}});

		highways.forEach( highway => {
		    if(highway.tag){
		      for(var i = 0; i<highway.tag.length;i++){
		        if(highway.tag[i].$.k == 'name'){
		          var street_name = highway.tag[i].$.v
		          // console.log(street_name)
		          if(dict.street_names[street_name] == undefined){
		              //street isn't in the dictionary yet, so add it.
		              dict.street_names[street_name] = []
		              // console.log(inspect(dict))
		              highway.nd.forEach( obj => {
		                dict.street_names[street_name].push(obj.$.ref)
		              })
		          } else {
		            //street already exists in dictionary, add node refs to it.
		            if(highway.nd){
		              highway.nd.forEach( obj => {
		                dict.street_names[street_name].push(obj.$.ref)
		              })
		            }
		          }
		        }
		      }
		    }
		})

		// console.log(inspect(dict.street_names['Hanover Street'].sort()))
	    //sort each highway and remove any duplicate node references
	    for (var key in dict.street_names) {
	    if (dict.street_names.hasOwnProperty(key)) {
	      
	        cleanedHighways = cleanedHighways.concat(removeDuplicatesFrom(dict.street_names[key].sort(),key))

	        }
	    }
	    // console.log(inspect(cleanedHighways))
	    console.log(`${highways.length} ways`);
	    console.log(inspect(cleanedHighways))
	    return cleanedHighways

	}

	const streetname = street => {
		return street == 'name'
	}

	const highway = tag => {
		return tag.$.k === 'highway'
	}

	const highwaytype = tag => {
		return
			tag.$.v == 'primary' 		|| 
			tag.$.v == 'secondary' 		||
            tag.$.v == 'motorway' 		|| 
            tag.$.v == 'trunk' 			||
            tag.$.v == 'tertiary' 		|| 
            tag.$.v == 'residential'	||
            tag.$.v == 'service' 		||
            tag.$.v == 'road' 			|| 
            tag.$.v == 'living_street'
	}

	const fromNodes = result => {
		
		var nodes = []

		result.osm.node.forEach( node => {

		    nodes.push({
		      id:node.$.id,
		      lat:node.$.lat,
		      lon:node.$.lon
		    })

  		})

  		console.log(`${nodes.length} nodes`)

  		return nodes
	}

	const removeDuplicatesFrom = (street_node_refs, street_name) => {
		var newArr = []

		var i = 1;
		for(var j = 0; j < street_node_refs.length; j++){
			if(street_node_refs[i] != street_node_refs[j]){
				newArr.push(street_node_refs[j])
			}
			i++
		}

		console.log(`removed ${street_node_refs.length - newArr.length} duplicates from ${street_name}`)
  		console.log('-------------')
		return newArr
	}

	const fromNodeReferencesFrom = ways => {

		var nodeReferences = []

		ways.forEach( way => {
			way.nd.forEach( nodeReference => {
				nodeReferences.push(nodeReferences.$.ref)
			})
		})

		return nodeReferences.splice().sort()
	}

	const fileSize = file => {
		/*
		checks file size. This is temporary while streams are integrated.
		*/
		const stats = fs.statSync(file)
		const fileSizeInBytes = stats.size
		//Convert the file size to megabytes
		const fileSizeInMegabytes = fileSizeInBytes / 1000000.0
		return fileSizeInMegabytes
	}

	return {

		findIntersections: path_to_file => {
			//check file type
			if(path.extname(path_to_file) !== '.osm'){
				return console.log('file type must be .osm')
			} else if (fileSize(path_to_file) > maxFileSizeInMegaBytes) {
				return console.log('file size must be under 100mb')
			} else {
				parseFile(path_to_file)
			}
		} 

	}

})()



intersectionFinder.findIntersections('../data/map.osm')