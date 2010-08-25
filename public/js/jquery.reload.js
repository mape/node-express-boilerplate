setTimeout(function () {
	(function reload ($) {
		$.ajax({
			'url': '/reload/'
			, 'success': function () {
				$('link').each(function(index) {
					$(this).attr('href', $(this).attr('href').replace(/[0-9]+/, new Date().getTime()));
				});
				
			}
			, 'complete': function () {
				setTimeout(function() {
					reload($);
				}, 1000);
			}
		});
	})(jQuery);
}, 1000);