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
		maxFileSizeInMegaBytes = 100

	var parseFile = (file) => {

	}

	var fileSize = (file) => {
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
			} else if (fileSize(path_to_file) > maxFileSizeInMegaBytes){
				return console.log('file size must be under 100mb')
			} else {
				parseFile(path_to_file)
			}
		}
		
	}

})()

	dictionary: {'street_names':{}},

	cleanedHighways: [],

	findIntersectionFromOSM: (filepath) => {
		parser.parseString(data, (err, result) => {
			this.get
		})
	}

}