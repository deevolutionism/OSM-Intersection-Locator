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

var nodes = [ '486867432',
  '486867405',
  '42429812',
  '42429811',
  '42429809',
  '4300940094',
  '42427345',
  '4300940098',
  '42429806',
  '42424932',
  '42429773',
  '3314293721',
  '3314293717',
  '42429769',
  '486867605',
  '3630249566',
  '42424932',
  '592434795',
  '3630219665',
  '3630219666',
  '3630219667',
  '3630219668',
  '486868830',
  '3212472817',
  '42429761',
  '3212472843',
  '4015192902',
  '3212472816',
  '42429762',
  '486867513',
  '3314293724',
  '486867534',
  '486867548',
  '486867605',
  '3212472654',
  '3212472844',
  '3212472653',
  '3212472815',
  '3212472655',
  '3630249566',
  '3630249569',
  '3630249568',
  '3630249567',
  '486876056',
  '3536479708',
  '42435532',
  '42435534',
  '42427340',
  '42435538',
  '42435541',
  '42435544',
  '42435548',
  '42435550',
  '42435553',
  '3536479706',
  '4375208207',
  '4202930753',
  '4539951623',
  '4539951609',
  '486869282',
  '4202930754',
  '1773076511',
  '42429752',
  '42429782',
  '3314293722',
  '42429773',
  '486869939',
  '486868138',
  '4202930754',
  '486869287',
  '1773076511',
  '4215624277',
  '42429754',
  '486867405',
  '42429761',
  '42429754',
  '4539951608',
  '4539951622',
  '486867432',
  '486867459',
  '3314293719',
  '4215624275',
  '4215624276',
  '3314293718',
  '486867459',
  '4215624275',
  '3314293723',
  '486867513',
  '42429752',
  '1773076514',
  '486867578',
  '4215624277',
  '486867490',
  '4215624276',
  '42429769',
  '3314293716',
  '42429766',
  '486868830',
  '3212472817',
  '3212472842',
  '486868873',
  '42429645',
  '42429756',
  '4202930753',
  '42429762',
  '486867490',
  '4539951609',
  '486869282',
  '486868138',
  '42429782' ]

fs.readFile('../data/map.osm', function(err, data) {
    parser.parseString(data, function (err, result) {
        // console.log(inspect(result));
        // console.log('Done');
        // console.log(inspect(result.osm.way));
        // console.log(result.osm.way.length)
        // console.log(inspect(result.osm.node[1].$.id));
        // console.log(inspect(result.osm.node[1]))
        var coordinates = []
        result.osm.node.forEach( (node) => {

          for(var i = 0; i<nodes.length; i++){
            if(nodes[i] == node.$.id){
              console.log(`${node.$.lat},${node.$.lon}`)
            }
          }


        })

        console.log(coordinates)
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
