var fs = require('fs');

module.exports = function(app, timestamps) {
	var self = this;
	app.configure('development', function(){
		// Only look for changes is development mode
		fs.readdir(app.settings.views, function(err, files) {
			files.forEach(function(file) {
				fs.watchFile(app.settings.views+'/'+file, function (old, newFile) {
					if (old.mtime.toString() != newFile.mtime.toString()) {
						updatedContent();
					}
				});
			});
		});

		// Keep track of who wants updates
		app.get('/reload-content/', function(req, res) {
			queue.push(res);
		});

		app.post('/reload-content/', function(req, res) {
			if (req.body.path) {
				queue.forEach(function(res) {
					res.send(req.body.path);
				});
			}
			res.send('');
		});
	});

	// Catch all that fell through and serve a template that matches if possible,
	// otherwise fallback to index template.
	app.all(/.*/, function(req, res) {
		var file = 'index';
		var urlMatch = req.url.match(/\/([^\/]+)/);

		if (urlMatch && urlMatch[1]) {
			urlMatch = urlMatch[1];
			file = urlMatch;
		} else {
			urlMatch = '';
		}
		var templateFile = app.settings.views+'/'+file+'.'+app.settings['view engine'];
		fs.stat(templateFile, function (err, stats) {
			if (err) {
				file = 'index';
			}
			// Check to see if there is a image overlay coupled with the template.
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
					, 'dummyHelperHtml': overlay ? '<div id="dummy-overlay-container"><div id="dummy-overlay" style="background-image: url(/img/overlays/'+overlay+');"></div></div>' : ''
				}
			});
		}
	});

	var queue = [];
	// Clean out the queue every now and then
	setInterval(function() {
		queue = queue.filter(function(res) {
			if (!res.finished) {
				return res;
			}
		});
	}, 3000000);

	function updatedContent(date) {
		queue.forEach(function(res) {
			res.send('content');
		});
		queue = [];
	}
	function updatedCss(date) {
		queue.forEach(function(res) {
			res.send('css');
		});
		queue = [];
	}
	
	return {
		'updatedContent': updatedContent
		, 'updatedCss': updatedCss
	};
};