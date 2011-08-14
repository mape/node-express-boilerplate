/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given name.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String name The name of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        // CAUTION: Needed to parenthesize options.path and options.domain
        // in the following expressions, otherwise they evaluate to undefined
        // in the packed version for some reason...
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

var currentPath = window.location.href.replace(new RegExp('https?://' + window.location.host, ''), '');
var doReload = true;
(function ($) {
	setTimeout(function() {
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
						$('style,link').remove();
						$('<link rel="stylesheet" href="/static/css/'+(0|Math.random()*100000)+'/style.css" type="text/css">').appendTo('head');
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
	}, 100); // Prevent forever loading on iOS

	var $toolbar = $('<div id="frontend-development"></div>').appendTo('body');

	var $refresh = $('<div title="Sync all browasers to this page" class="sync">S</div>').click(function (event) {
		doMoveAjax(currentPath);
	}).appendTo($toolbar);

	var $toggleOverlay = $('<div title="Toggle overlay" class="toggle-overlay">O</div>').click(function (event) {
		if ($.cookie('do') === 'true') {
			$.cookie('do', 'false', {'path': '/'});
			window.location.reload(true);
		} else {
			$.cookie('do', 'true', {'path': '/'});
			window.location.reload(true);
		}
	}).appendTo($toolbar);

	if ($.cookie('do') === 'true') {
		$toggleOverlay.addClass('bad');
	} else {
		$toggleOverlay.addClass('ok');
	}

	var $overlay = $('#dummy-overlay');
	if ($.cookie('do') === 'true') {
		if (($overlay.attr('style')||'').match(/center/)) {
			  $overlay.addClass('center');
		}
		var $container = $('#dummy-overlay-container').show();
		$('#dummy-overlay').width($('#dummy-overlay').width());
		$(window).mousemove(function(e) {
			  $container.width((e.clientX-10)+'px');
		});
	} else {
		$('#dummy-overlay-container').remove();
	}
})(jQuery);
