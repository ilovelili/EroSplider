var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db;

var mongoClient = new MongoClient(new Server('45.55.130.170', 27017));

console.log('hit');
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("ero");
    db.collection('videos', {strict:true}, function(err, collection) {
        populateDB();
    });
});


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
    console.log("Populating employee database...");
    var videos = [{
            "id": 1,
            "title": "mbr061 HUB3X.NET Part03 - 37 min",
            "thumbnail": "http://img100.xvideos.com/videos/thumbs/55/70/ee/5570eed04f6c3a6211c63a17db83050c/5570eed04f6c3a6211c63a17db83050c.2.jpg",
            "link": "<iframe src='http://flashservice.xvideos.com/embedframe/3366845' frameborder=0 width=510 height=400 scrolling=no></iframe>"
        }, {
            "id": 2,
            "title": "Sweet Megu Kamijyou with two guys that cant wait to strip her - 5 min",
            "thumbnail": "http://img-l3.xvideos.com/videos/thumbs/0e/cd/db/0ecddbd88fad7bf11c881d685a560b15/0ecddbd88fad7bf11c881d685a560b15.20.jpg",
            "link": "<iframe src='http://flashservice.xvideos.com/embedframe/4687876' frameborder=0 width=510 height=400 scrolling=no></iframe>"
        }, {
            "id": 3,
            "title": "3D HongKong sex and zen - 59 min",
            "thumbnail": "http://img-l3.xvideos.com/videos/thumbs/ec/5b/78/ec5b78bfac2dee2dac2913b18842deea/ec5b78bfac2dee2dac2913b18842deea.24.jpg",
            "link": "<iframe src='http://flashservice.xvideos.com/embedframe/1137507' frameborder=0 width=510 height=400 scrolling=no></iframe>"
        }];
 
    db.collection('videos', function(err, collection) {
        collection.insert(videos, {safe:true}, function(err, result) {});
    });
    
    console.log('inserted');
};