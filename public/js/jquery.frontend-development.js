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
	}
	(function reload($) {
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
	var $toolbar = $('<div id="frontend-development"></div>').appendTo('body');

	var $refresh = $('<div title="Sync all browsers to this page" class="sync">S</div>').click(function (event) {
		doMoveAjax(currentPath);
	}).appendTo($toolbar);

	var $validate = $('<div title="Validate html" class="validate">V</div>').click(function (event) {
		var originSrc = $(this).html();
		$validate.html('<div class="loading"></div>');
		var pulseInterval;
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
					, 'success': function (html) {
						$validate.unbind('click');

						if (html === 'ok') {
							$validate.html(originSrc).addClass('ok');
						} else {
							$validate.html(originSrc).addClass('bad');
							var $errorContainer = $('<ul id="frontend-development-validation-errors"/>').appendTo('html').hide();
							var count;
							$(html).find('li.error').each(function(index) {
								$errorContainer.append('<li>'+$(this).html()+'</li>');
								count = index+1;
							});
							if (count === undefined) {
								return;
							}
							$validate.append('<div class="validation-errors">'+(count || '')+'</div>');
							$validate.stop().animate({'opacity': 0.3}, 500).animate({'opacity': 1}, 500);
							pulseInterval = setInterval(function() {
								$validate.stop().animate({'opacity': 0.3}, 500).animate({'opacity': 1}, 500);
							}, 1000);

							$validate.bind('click', function() {
								$('.validation-errors').remove();
								clearInterval(pulseInterval);
								$errorContainer.show();
								$validate.unbind('click');
								$validate.bind('click', function() {
									$errorContainer.remove();
								});
							});
						}
					}
				});
			}
		});
	}).appendTo($toolbar);
	$validate.click();
	
	var $overlay = $('#dummy-overlay');
	if ($overlay.length) {
		if ($overlay.attr('style').match(/-center/)) {
			$overlay.addClass('center');
		}
		$('html').live('click', function(event) {
			if (toggleAnimation) {
				clearInterval(toggleAnimation);
			}
			$overlay.toggle();
		});
		$overlay.stop().fadeTo(500, 0).fadeTo(500, 1);
		var toggleAnimation = setInterval(function() {
			$overlay.stop().fadeTo(500, 0).fadeTo(500, 1);
		}, 1000);
	}
})(jQuery);