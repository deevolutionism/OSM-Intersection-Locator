"use strict"
const fs = require('fs');
const xml2js = require('xml2js')
const util = require('util')
const inspect = require('eyes').inspector({maxLength: false})
const _ = require('lodash');
const path = require('path')

var parser = new xml2js.Parser()


var IntersectionFinder = (() => {

	var data = {},
		maxFileSizeInMegaBytes = 100,
		dict = {'street_names':{}},
		cleanedHighways = []

	var parseFile = (file) => {
		/* 
		initial function that parses the osm file
		and returns intersections
		*/

		fs.readFile(file, function(err, data) {
			if(err){
				console.error('error reading file')
			} else {
				//use xml2json to parse osm
				parser.parseString(data, (err, result) => {
					getLatLon(findIntersection(fromWays(result),fromNodes(result)))
				})
			}
		})
	}

	var getLatLon = (intersections) => {
		/* 
		Returns latitude and longitude from each intersection
		*/

		let count = 0,
		latlonglist = ''


		intersections.forEach( (intersection) => {
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

	var findIntersections = (node_references, nodes) => {
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

	var fileSize = (file) => {
		/*
		checks file size. This is temporary while streams are integrated.
		*/
		const stats = fs.statSync("myfile.txt")
		const fileSizeInBytes = stats.size
		//Convert the file size to megabytes
		const fileSizeInMegabytes = fileSizeInBytes / 1000000.0
		return fileSizeInMegabytes
	}

	return {

		findIntersections: (path_to_file) => {
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

intersectionFinder.findIntersections()