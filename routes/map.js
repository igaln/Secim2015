

/*
 * GET home page.
 */

exports.view = function(req, res){
	res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('X-Frame-Options: GOFORIT');
	

	 if(typeof req.query.begin==='undefined'){
	 	console.log("of");
	 	start = 0;
	 } else {
	 	start = parseInt(req.query.begin);
	 }

	 var end = start + 1000;

	console.log(start + " " + end);

	var tweetdata  = [];


	 var Db = require('mongodb').Db
  , Connection = require('mongodb').Connection
  , Server = require('mongodb').Server
  , format = require('util').format;

  //166.78.181.167
	 var client = new Db('gezi', new Server("166.78.181.167", 27017, {}), {w: 1});
       

    	client.open(function(err, p_client) {
      		
      		var fields = {
			    "created_at": true,
			    "text": true,
			    "entities":true,
			    "geo":true,
			};
			var query = {"geo":{$ne : null}};

			options = {"skip" : start, "limit" : end};

      		client.collection("tweets", function(err,collection) {
      			collection.find(query,fields,options ).sort({_id:-1}).toArray(function(err, results){
    					console.log("results " + results.length);
    					
    					var duplicateChecker = [];
    					var geoJSON = [];
    					var length = results.length,
						 element = null;


						
						for (var i = 0; i < length; i++) {
						 	
						 	 element = results[i];


						 	  var geojsonFeature = {
						    "type": "Feature",
						    "properties": {
						        "name": "",
						        "popupContent": element.text
						    },
						    "geometry": {
						        "type": "Point",
						        "coordinates": [element.geo.coordinates[1],element.geo.coordinates[0]]
						    }
						};

							geoJSON.push(geojsonFeature);

						 	 var urls = element.entities.urls[0];
						 	 
						 	//  if(typeof urls!='undefined'){
						 	 		
						 	//  		//if(duplicateChecker.contains(urls.expanded_url))
						 	//  		if(duplicateChecker.indexOf(urls.expanded_url)  == -1) {

						 	//  		duplicateChecker.push(urls.expanded_url);

						 	//  		var isImage = false;
						 	//  		var isVine = false;
						 	//  		var isTube = false;

								// 	if( urls.expanded_url.indexOf(".jpg") !== -1 || urls.expanded_url.indexOf(".png") !== -1 || urls.expanded_url.indexOf(".jpeg") !== -1) {
								// 		isImage = true;
								// 	}
								// 	if( urls.expanded_url.indexOf("vine.co") !== -1) {
								// 		isVine = true;
								// 	}
								// 	if( urls.expanded_url.indexOf("youtube") !== -1) {
								// 		isTube = true;
								// 		var turl = "";
								// 		if(urls.expanded_url.indexOf("&") !== -1) {
								// 		    turl = urls.expanded_url.split("&");
								// 			turl = turl[1].split("=");
								// 		} else {
								// 			turl = urls.expanded_url.split("v=");
								// 		}
								// 		tubeUrl = "http://www.youtube.com/embed/" + turl[1];
								// 		//tweetdata.push({"date":element.created_at,"url":tubeUrl,"text":element.text,"isImage":isImage,"isVine":isVine,"isTube":isTube})
								// 	} else {
								// 		//tweetdata.push({"date":element.created_at,"url":urls.expanded_url,"text":element.text,"isImage":isImage,"isVine":isVine,"isTube":isTube})
								// 	}

								// }
									

						 	 		
						 	//  }
						 	 
						  // Do something with element i.
						} // results parsin

						// console.log(geoJSON);
						client.close();	
 						 res.render('map', { mapdata: JSON.stringify(geoJSON),type:"map" });
				});
      		});
		 });


};

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for(var i = 0; i < this.length; i++) {
            if(this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}