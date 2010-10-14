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
	
	var exec  = require('child_process').exec;
	app.post('/validate-content/', function(req, res) {
		if (req.body.source) {
			var filePath = '/tmp/'+Date.now()+'.tmp';
			fs.writeFile(filePath, req.body.source, function (err) {
				exec('curl -F "fragment=<'+filePath+';type=text/html" -F "group=1" -F "doctype=Inline" -F "user-agent=W3C_Validator/1.1" -F "charset=(detect automatically)" http://validator.w3.org/check', function (error, stdout, stderr) {
					if (stdout.indexOf('error_loop') === -1) {
						res.send('ok');
					} else {
						res.send(stdout);
					}
					fs.unlink(filePath, function() {});
				});
			});
		} else {
			res.send('{"status":false}');
		}
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
			'page': '/'
			, 'date': new Date().toString()
		}
	});
});
app.get('/1/', function(req, res) {res.render('index', {locals:{'page': '/1/', 'date': new Date().toString()}});});
app.get('/2/', function(req, res) {res.render('index', {locals:{'page': '/2/', 'date': new Date().toString()}});});
app.get('/3/', function(req, res) {res.render('index', {locals:{'page': '/3/', 'date': new Date().toString()}});});
app.get('/4/', function(req, res) {res.render('index', {locals:{'page': '/4/', 'date': new Date().toString()}});});
app.get('/5/', function(req, res) {res.render('index', {locals:{'page': '/5/', 'date': new Date().toString()}});});
app.get('/6/', function(req, res) {res.render('index', {locals:{'page': '/6/', 'date': new Date().toString()}});});
app.get('/7/', function(req, res) {res.render('index', {locals:{'page': '/7/', 'date': new Date().toString()}});});
app.get('/8/', function(req, res) {res.render('index', {locals:{'page': '/8/', 'date': new Date().toString()}});});

app.listen(666);