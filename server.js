var connect = require('connect');
var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');
var express = require('express');

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
			, 'jquery.client.js'
			, 'jquery.reload.js'
		]
		, 'preManipulate': {
			'^': []
		}
		, 'postManipulate': {
			'^': [
				assetHandler.uglifyJsOptimize
			]
		}
	}, 'css': {
		'route': /\/static\/css\/[0-9]+\/.*\.css/
		, 'path': './public/css/'
		, 'dataType': 'css'
		, 'files': [
			'reset.css'
			, 'client.css'
		]
		, 'preManipulate': {
			/*'MSIE': [
				assetHandler.yuiCssOptimize
				, assetHandler.fixVendorPrefixes
				, assetHandler.fixGradients
				, assetHandler.stripDataUrlsPrefix
				, assetHandler.fixFloatDoubleMargin
			]
			, */
			'^': [
				 assetHandler.fixVendorPrefixes
				, assetHandler.fixGradients
				, assetHandler.replaceImageRefToBase64(__dirname + '/public')
			]
		}
		, 'postManipulate': {
			'^': [
				function (file, path, index, isLast, callback) {
					// Notifies the browser to refresh the CSS.
					// This enables coupled with jquery.reload.js 
					// enables live CSS editing without reload.
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
	app.use(connect.gzip());
	app.use(connect.bodyDecoder());
	app.use(connect.logger());
	app.use(assets);
	app.use(connect.staticProvider(__dirname + '/public'));
});

app.configure('development', function() {
	app.use(connect.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.dynamicHelpers({
	cacheTimeStamps: function(req, res) {
		return assets.cacheTimestamps;
	}
});

app.get('/', function(req, res) {
	res.render('index', {
		locals: {
			'date': new Date().toString()
		}
	});
});

app.post('/', function(req, res) {
	console.log(req.body);
	res.send('post');
});

var lastChangedCss = 0;
app.get('/reload/', function(req, res) {
	var reloadCss = lastChangedCss;
	(function reload () {
		setTimeout(function () {
			if ( reloadCss < lastChangedCss) {
				res.send('reload');
				reloadCss = lastChangedCss;
			} else {
				reload();
			}
		}, 100);
	})();
});

app.listen(80);
