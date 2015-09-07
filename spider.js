var links = [];
var infos = [];

var maxLinks = 30;

// when run by batch
// require.paths.push("config.json path")

var casper = require('casper').create({
    verbose: true,
    logLevel: 'error',
    pageSettings: {
        loadImages: false,
        loadPlugins: false
    },
    clientScripts: [
        'lib/jquery.js'
    ]
});

var fs = require('fs');
var options = casper.cli.options;
var destination = options['dest'] === undefined ? 'j-xvideos' : options['dest'];
var config = require("config.json")[destination];
var filename = (options["name"] === undefined ?
    new Date().toLocaleDateString().replace(/\//g, '-') + '.csv' :
    options["name"] + '.csv');

//Functions------------------------
// function getLinks() {
//     var links = $('.thumbnails .thumbnail a');
//     console.log('links length in getlinks: ' + links.length);

//     return Array.prototype.map.call(links, function(link) {
//         return 'http://j-xvideos.com' + link.getAttribute('href');
//     });
// }

function getThumbnailInfo() {
    var thumbnails = $('.thumbnails .thumbnail');
    console.log('thumbnail length: ' + thumbnails.length);
    
    return Array.prototype.map.call(thumbnails, function(thumbnail) {
        var category = $(thumbnail).find('.caption .tags').text().replace(/\s/g, '');

        var info = $(thumbnail).children('a'),
            link = 'http://j-xvideos.com' + info.attr('href'),
            thumbnailimg = info.children('img').attr('src'),
            description = info.children('img').attr('alt'),
            duration = info.children('.thumbnail-infos').children('.duration').children('.text').text();

        return {
            category: category,
            link: link,
            thumbnail: thumbnailimg,
            description: description,
            duration: duration
        };
    });
}

casper.saveToCSV = function() {
    var result = '';
    var source = [];
    Array.prototype.map.call(infos, function(info, index) {
        if (info) {
            source.push(info + ',' + links[index].category + ',' + links[index].link + ',' + links[index].thumbnail + ',' + links[index].description + ',' + links[index].duration + ',' + filename.split('.csv')[0]);
        }
    });

    for (var index in source) {
        var line = source[index];
        console.log(line);

        if (result.indexOf(line) === -1 && line != null)
            result += line + (index === source.length - 1 ? '' : '\r\n');
    }
    if (result.length > 0) {
        fs.write(fs.pathJoin(fs.workingDirectory, 'output', filename), result, 'w');
    }
};

//Crawl------------------------
casper.on("remote.message", function(msg) {
    this.echo("remote.msg: " + msg);
});

console.log('sourceUrl is: ' + config.sourceUrl);
casper.start(config.sourceUrl);

casper.then(function() {
    links = this.evaluate(getThumbnailInfo);
    console.log('links length: ' + links.length);

    var j = 0;
    this.eachThen(links, function(response) {
        if (response.data == null) return;
        j++;
        if (j > maxLinks) return;

        this.thenOpen(response.data.link, function writeToCSV() {
            var embed = this.evaluate(function() {
                return __utils__.findOne('.iframe iframe').getAttribute('src');
            });

            console.log('embed: ' + embed);
            infos.push(embed);
        });
    });
});

casper.run(function() {
    this.saveToCSV(infos);
    this.echo('infos length :' + infos.length);
    this.exit();
});