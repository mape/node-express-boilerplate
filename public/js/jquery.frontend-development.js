var currentPath = window.location.href.replace(new RegExp('https?://' + window.location.host, ''), '');
var doReload = true;
(function ($) {
	function doMoveAjax(url) {
		if (url) {
			$.ajax({
				'url': '/reload-content/'
				, 'data': {
					'path': url
				}
				, 'type': 'post'
				, 'cache': false
				, 'success': function (text) {
					$('.sync').fadeTo(200, 0.2).fadeTo(200, 1).fadeTo(200, 0.2).fadeTo(200, 1);
				}
			});
		}
	}(function reload($) {
		$.ajax({
			'url': '/reload-content/'
			, 'cache': false
			, 'success': function (text) {
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
			}
			, 'complete': function () {
				setTimeout(function () {
					if (doReload) {
						reload($);
					}
				}, 1000);
			}
		});
	})($);
	var $toolbar = $('<div id="frontend-development"></div>').appendTo('html');

	var $refresh = $('<div title="Sync all browsers to this page" class="sync">S</div>').click(function (event) {
		doMoveAjax(currentPath);
	}).appendTo($toolbar);

	var $validate = $('<div title="Validate html" class="validate">V</div>').click(function (event) {
		if ($(this).is('.ok,.bad')) {
			return false;
		}
		var originSrc = $(this).html();
		$validate.html('<div class="loading"></div>');
		$.ajax({
			'cache': false
			, 'success': function (html) {
				$.ajax({
					'url': '/validate-content/'
					, 'type': 'post'
					, 'cache': false
					, 'dataType': 'text'
					, 'data': {
						'source': html
					}
					, 'success': function (text) {
						if (text === 'ok') {
							$validate.html(originSrc).addClass('ok');
						} else {
							$validate.html(originSrc).addClass('bad');
							var $errorContainer = $('<ul id="frontend-development-validation-errors"/>').html($(text).find('#error_loop').html()).appendTo('html');
							$errorContainer.find('.helpwanted').remove();
							$errorContainer.find('.err_type').text('Errors');
							$validate.click(function() {
								$errorContainer.remove();
							});
						}
					}
				});
			}
		});
	}).appendTo($toolbar);
})(jQuery);