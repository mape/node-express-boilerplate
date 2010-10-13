var currentPath = window.location.href.replace(new RegExp('https?://' + window.location.host, ''), '');
var doReload = true;
(function ($) {
	function doMoveAjax(url) {
		if (url) {
			$.ajax({
				'url': '/reload-content/',
				'data': {
					'path': url
				},
				'type': 'post',
				'cache': false,
				'success': function (text) {
					$('.refresh').fadeTo(200, 0.2).fadeTo(200, 1).fadeTo(200, 0.2).fadeTo(200, 1);
				}
			});
		}
	}(function reload($) {
		$.ajax({
			'url': '/reload-content/',
			'cache': false,
			'success': function (text) {
				if (text === 'css') {
					$('link').each(function (index) {
						$(this).attr('href', $(this).attr('href').replace(/[0-9]+/, new Date().getTime()));
					});
				} else if (text === 'content') {
					setTimeout(function () {
						window.location.reload(true);
					}, 200);
				} else {
					if (text && currentPath !== text) {
						doReload = false;
						window.location = text;
					}
				}
			},
			'complete': function () {
				setTimeout(function () {
					if (doReload) {
						reload($);
					}
				}, 1000);
			}
		});
	})($);
	var $toolbar = $('<div id="frontend-development"></div>').appendTo('html');
	$('a').live('click', function (event) {
		doMoveAjax($(this).attr('href'));
	});
	var $refresh = $('<div class="refresh">R</div>').click(function (event) {
		doMoveAjax(currentPath);
	}).appendTo($toolbar);
})(jQuery);