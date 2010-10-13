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
	$('a').live('click', function (event) {
		doMoveAjax($(this).attr('href'));
	});
	var $refresh = $('<div class="refresh">R</div>').click(function (event) {
		doMoveAjax(currentPath);
	}).appendTo('body').css({
		'position': 'fixed',
		'bottom': '50%',
		'right': '0px',
		'cursor': 'pointer',
		'color': '#fff',
		'background-color': '#000',
		'font-weight': 'bold',
		'padding': '2px 4px 2px 6px',
		'line-height': '100%',
		'font-size': '14px'
	});
	if (!$.browser.msie) {
		$refresh.css({
			'background-color': 'rgba(0,0,0,0.7)',
			'border-radius': '5px 0 0 5px',
			'-moz-border-radius': '5px 0 0 5px',
			'-webkit-border-radius': '5px 0 0 5px'
		});
	}
})(jQuery);