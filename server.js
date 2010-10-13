var connect = require('connect');
var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');
var express = require('express');
var fs = require('fs');

process.title = 'node-express-boilerplate';
process.addListener('uncaughtException', function (err, stack) {
	console.log('Caught exception: ' + err);
	console.log(err.stack.split('\n'));
});

var assets = assetManager({
	'js': {
		'route': /\/static\/js\/[0-9]+\/.*\.js/
		, 'path': './public/js/'
		, 'dataType': 'js'
		, 'files': [
			'jquery.js'
			, '*'
			, 'jquery.client.js'
			, 'jquery.frontend-development.js'
		]
		, 'preManipulate': {
			'^': []
		}
		, 'postManipulate': {
			'^': [
				function (file, path, index, isLast, callback) {
					// Enables live JS editing auto reload.
					callback(file);
					lastChangedContent = Date.now();
				}
			]
		}
	}, 'css': {
		'route': /\/static\/css\/[0-9]+\/.*\.css/
		, 'path': './public/css/'
		, 'dataType': 'css'
		, 'files': [
			'reset.css'
			, '*'
			, 'client.css'
			, 'frontend-development.css'
		]
		, 'preManipulate': {
			'^': [
				 assetHandler.fixVendorPrefixes
				, assetHandler.fixGradients
				, assetHandler.replaceImageRefToBase64(__dirname + '/public')
			]
		}
		, 'postManipulate': {
			'^': [
				function (file, path, index, isLast, callback) {
					// Enables live CSS editing without reload.
					callback(file);
					lastChangedCss = Date.now();
				}
			]
		}
	}
});

var app = module.exports = express.createServer();

app.configure(function() {
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/views');
});

app.configure(function() {
	app.use(connect.conditionalGet());
	app.use(connect.bodyDecoder());
	app.use(connect.logger());
	app.use(assets);
	app.use(connect.staticProvider(__dirname + '/public'));
});

app.dynamicHelpers({
	cacheTimeStamps: function(req, res) {
		return assets.cacheTimestamps;
	}
});

app.configure('development', function() {
	app.use(connect.errorHandler({ dumpExceptions: true, showStack: true }));

	// Set as global to allow assetmaanger to change
	lastChangedContent = 0;
	lastChangedCss = 0;
	var path = false;
	app.get('/reload-content/', function(req, res) {
		var timeoutCss;
		var timeoutContent;
		var timeoutPath;
		var reloadCss = lastChangedCss;
		var reloadContent = lastChangedContent;
		(function reload () {
			timeoutContent = setTimeout(function () {
				if (reloadContent < lastChangedContent) {
					reloadContent = lastChangedContent;
					res.send('content');
					reset();
				} else {
					reload();
				}
			}, 100);
		})();
		(function reload () {
			timeoutCss = setTimeout(function () {
				if (reloadCss < lastChangedCss) {
					reloadCss = lastChangedCss;
					res.send('css');
					reset();
				} else {
					reload();
				}
			}, 100);
		})();
		(function reload () {
			timeoutPath = setTimeout(function () {
				if (path) {
					res.send(path);
					reset();
				} else {
					reload();
				}
			}, 100);
		})();

		function reset() {
			if (timeoutCss) {
				clearTimeout(timeoutCss);
			}
			if (timeoutCss) {
				clearTimeout(timeoutPath);
			}
			if (timeoutContent) {
				clearTimeout(timeoutContent);
			}
		}
	});

	app.post('/reload-content/', function(req, res) {
		if (req.body.path) {
			path = req.body.path;
			setTimeout(function() {
				path = null;
			}, 1000);
		}
		res.send('');
	});

    fs.readdir(app.settings.views, function(err, files) {
		files.forEach(function(file) {
			fs.watchFile(app.settings.views+'/'+file, function (old, newFile) {
				if (old.mtime.toString() != newFile.mtime.toString()) {
					lastChangedContent = Date.now();
				}
			});
		});
    });
});
app.get('/', function(req, res) {
       res.render('index', {
               locals: {
                       'date': new Date().toString()
}
      });
});
app.get('/1/', function(req, res) {res.render('index', {locals:{'date':new Date().toString()}});});
app.get('/2/', function(req, res) {res.render('index', {locals:{'date':new Date().toString()}});});
app.get('/3/', function(req, res) {res.render('index', {locals:{'date':new Date().toString()}});});
app.get('/4/', function(req, res) {res.render('index', {locals:{'date':new Date().toString()}});});
app.get('/5/', function(req, res) {res.render('index', {locals:{'date':new Date().toString()}});});

app.listen(666);