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
function getLinks() {
    var links = $('.thumbnails .thumbnail a');
    console.log('links length in getlinks: ' + links.length);

    return Array.prototype.map.call(links, function(link) {
        return 'http://j-xvideos.com' + link.getAttribute('href');
    });
}

casper.saveToCSV = function(source) {
    var result = '';

    console.log('source length: ' + source.length);
    for (var index in source) {
        var line = source[index];
        if (result.indexOf(line) === -1 && line != null)
            result += line + '\r\n';
    }
    if (result.length > 0) {
        fs.write(fs.pathJoin(fs.workingDirectory, 'output', filename), result, 'w');
    }
};

//Crawl------------------------
casper.on("remote.message", function(msg) {
    this.echo("remote.msg: " + msg);
});

console.log(config.sourceUrl);

// casper.start('http://www.github.com');
casper.start(config.sourceUrl);

casper.then(function() {
    links = this.evaluate(getLinks);

    console.log('links length: ' + links.length);

    var j = 0;
    this.eachThen(links, function(response) {
        j++;
        if (j > maxLinks) return;

        console.log('response is ' + response.data);

        this.thenOpen(response.data, function writeToCSV() {
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