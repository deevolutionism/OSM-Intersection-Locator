const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');
const inspect = require('eyes').inspector({maxLength: false})

var parseString = require('xml2js').parseString;
var xml = "<root>Hello xml2js!</root>"
parseString(xml, function (err, result) {
    console.dir(result);
});


var parser = new xml2js.Parser();

var nodes = []

fs.readFile(__dirname + '/map_large.osm', function(err, data) {
    parser.parseString(data, function (err, result) {
        // console.log(inspect(result));
        // console.log('Done');
        // console.log(inspect(result.osm.way));
        // console.log(result.osm.way.length)
        // console.log(inspect(result.osm.node[1].$.id));
        // console.log(inspect(result.osm.node[1]))
        result.osm.node.forEach( (node) => {

          if(node.$.id == '3630237363'){
            console.log(inspect(node))
          }

          // nodes.push({
          //   id:node.$.id,
          //   lat:node.$.lat,
          //   lon:node.$.lon
          // })

        })

        console.log(nodes.length)
        // console.log(result.osm.node.length)
        // nodes.forEach(  )
        // nodes.forEach( (node, i) => {
        //   if( node.$.id == '2547247356'){
        //     console.log('found matching node!')
        //     console.log(inspect(node))
        //   }
        // })
    });
});


//extract all ways and get their associated nodes
//find any nodes which share the same references
