var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    db,
    fs = require('fs');

var mongoClient = new MongoClient(new Server('localhost', 27017));
mongoClient.open(function(err, mongoClient) {
    db = mongoClient.db("ero");
    db.collection('videos', {
        strict: true
    }, function(err, collection) {
        var data = readFile();
        populateDB(data);
        mongoClient.close();
    });
});

var readFile = function() {
    var dir = './output/',
        files = fs.readdirSync(dir),
        data = [];
    for (var index in files) {
        data = data.concat((fs.readFileSync(dir + files[index], 'utf-8')).split('\r\n'));
    }
    var result = [];
    Array.prototype.map.call(data, function(record) {
        if (record.length) {
            var fragment = record.split(','),
                link = "<iframe src='" + fragment[0] + "' frameborder=0 width=510 height=400 scrolling=no></iframe>",
                category = fragment[1],
                thumbnail = fragment[3],
                title = fragment[4],
                duration = fragment[5],
                date = fragment[6];
                
            result.push({
               "title":  title,
               "link": link,
               "thumbnail": thumbnail,
               "category": category,
               "duration": duration,
               "date": date
            });
        }
    });
    
    console.log(result);
    return result;
};

var populateDB = function(data) {
    if (!data.length) {
        console.log('no data, exit');
        return;
    }
    console.log("Populating database...");
    
    db.collection('videos', function(err, collection) {
        collection.insert(data, {
            safe: true
        }, function(err, result) {});
    });
};
