var fs = require('fs');

module.exports = function(app, timestamps) {
	var timestamps = {
		'content': 0
		, 'css': 0
	};

	var path = false;
	app.get('/reload-content/', function(req, res) {
		var timeoutCss;
		var timeoutContent;
		var timeoutPath;
		var reloadCss = timestamps.css;
		var reloadContent = timestamps.content;

		(function reload () {
			timeoutContent = setTimeout(function () {
				if (reloadContent < timestamps.content) {
					reloadContent = timestamps.content;
					res.send('content');
					reset();
				} else {
					reload();
				}
			}, 100);
		})();

		(function reload () {
			timeoutCss = setTimeout(function () {
				if (reloadCss < timestamps.css) {
					reloadCss = timestamps.css;
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
	var crypto = require('crypto');
	var validateCache = {};
	function getValidationSource(filePath, source, res, cacheKey) {
		fs.writeFile(filePath, source, function (err) {
			exec('curl -F "content=<'+filePath+';type=text/html" -F "showsource=no" http://validator.mape.me', function (error, stdout, stderr) {
				if (stdout.indexOf('There were errors') === -1) {
					validateCache[cacheKey] = 'ok';
					res.send('ok');
				} else {
					validateCache[cacheKey] = stdout;
					res.send(stdout);
				}
				fs.unlink(filePath, function() {});
			});
		});
	}
	app.post('/validate-content/', function(req, res) {
		if (req.body.source) {
			var cacheKey = crypto.createHash('md5').update(req.body.source).digest('hex');

			if (validateCache[cacheKey] === undefined) {
				var filePath = '/tmp/'+Date.now()+'.tmp';
				getValidationSource(filePath, req.body.source, res, cacheKey);
			} else {
				res.send(validateCache[cacheKey]);
			}
		} else {
			res.send('nope');
		}
	});

	fs.readdir(app.settings.views, function(err, files) {
		files.forEach(function(file) {
			fs.watchFile(app.settings.views+'/'+file, function (old, newFile) {
				if (old.mtime.toString() != newFile.mtime.toString()) {
					timestamps.content = Date.now();
				}
			});
		});
	});

	app.get(/.*/, function(req, res) {
		var file = 'index';
		var urlMatch = req.url.match(/\/([^\/]+)/);

		if (urlMatch && urlMatch[1]) {
			urlMatch = urlMatch[1];
			file = urlMatch;
		} else {
			urlMatch = '';
		}

		fs.stat(app.settings.views+'/'+file+'.ejs', function (err, stats) {
			if (err) {
				file = 'index';
			}
			var overlayPath = 'public/img/overlays/'+file+'.png';
			var overlayCenteredPath = 'public/img/overlays/'+file+'-center.png';
			fs.stat(overlayPath, function (err, stats) {
				if (err) {
					fs.stat(overlayCenteredPath, function (err, stats) {
						if (err) {
							render(null);
						} else {
							render(file+'-center.png');
						}
					});
				} else {
					render(file+'.png');
				}
			});
		});
		function render(overlay) {
			res.render(file, {
				locals: {
					'page': (urlMatch) ? '/'+urlMatch+'/' : '/'
					, 'date': new Date().toString()
					, 'dummyHelperHtml': overlay ? '<div id="dummy-overlay" style="background-image: url(/img/overlays/'+overlay+');"></div>' : ''
				}
			});
		}
	});

	return timestamps;
};