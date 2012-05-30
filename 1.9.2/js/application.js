/*
 * Author: Tatsuya Miyamae @ BitArts, Inc.
 * http://bitarts.jp
 */

function log(s) {
    if (console) console.log(s);
}

function currentPath() {
    return location.hash.replace(/^#!/, '');
}

function topUri() {
    return location.href.replace(/#.*?$/, '').replace(/[^\/]*$/, '');
}

function baseUri() {
    var base_path = currentPath().replace(/[^\/]*$/, '');
    return topUri() + base_path.replace(/^\//, '');
}

function absolutePath(path) {
    var e = document.createElement('span');
    var url = baseUri() + path.replace(/^\//, '');
    e.innerHTML = '<a href="' + url + '" />';
    var abs_path = path.match(/^\//) ?
        e.firstChild.href.replace(baseUri(), '') : e.firstChild.href.replace(topUri(), '');
    return abs_path;
}

function isAbsoluteUri(uri) {
    return uri.match(/^.*?:\/\//);
}

function loadPage() {
    if (location.hash.match(/^#!/)) {
        var path = currentPath();
        $('#body').html('<div class="loading"></div>');
        $.ajax({
            type: 'GET',
            url: absolutePath(path),
            success: function(html) {
                $('#body').html(html);
                initPage($('#body'));
                if (path.match(/\?(.*)$/)) {
                    var offset = $('#' + RegExp.$1).offset();
                    if (offset) $('#content').scrollTop(offset.top);
                }
            },
            error: function(xhr, status, e) {
                $('#body').html(xhr.responseText);
            }
        });
        $('#search-box').focus();
    }
}

function initPage(elem) {
    var as = elem ? elem.find('a') : $('a');
    as.each(function() {
        $(this).attr('href', $(this).attr('href').replace('_builtin.html', 'builtin.html')); // for GitHub Pages
        var src_url = $(this).attr('href');
        if (src_url.match(/^#(.*)$/)) {
            var id = RegExp.$1;
            $(this).attr('href', '#!' + currentPath().replace(/\?.*$/, '') + '?' + id);
        } else if (!isAbsoluteUri(src_url)) {
            $(this).attr('href', '#!/' + absolutePath(src_url.replace('#', '?')));
        }
    });
}

function itemIndex(param, n) {
    var item = $('<li><a><span class="key"></span><span class="sub"></span><span class="desc"></span></a></li>');
    item.find('a').attr('href', param.path);
    item.find('a').attr('title', '【' + param.key + '】' +  param.desc);
    item.find('.key').text(param.key);
    if (typeof(param.sub) == 'object') {
        item.find('.sub').text(n ? param.sub[n] : param.sub[0]);
    } else {
        item.find('.sub').text(param.sub);
    }
    item.find('.desc').text(param.desc);
    return item;
}

_index = [];
function loadIndex() {
    $.getJSON('json/index.json', function(json) {
        _index = json;
        $('#search-box').removeAttr('disabled');
        $('#search-box').focus();
        $('#index').empty();
        $.each(_index, function() {
            var item = this;
            var tgt_str = item.key;
            if (tgt_str && item.sub && typeof(item.sub) == 'object') {
                $.each(item.sub, function() {
                    tgt_str = tgt_str + ' ' + this.replace(/ .*$/, '');
                });
            }
            item['index'] = tgt_str;
        });
    });
}

function zebraList() {
    $('#index li:odd').addClass('odd');
    $('#index li:even').addClass('even');
}

_key = '';
function suggest() {
    var key = $('#search-box').val();
    if (key != _key) {
        _key = key;
        var re = new RegExp(key.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1').replace(/[ #\.]+/g, '.*'), 'i');
        var ul = $('#index');
        ul.empty();
        $('#navi a').removeClass('current');
        $('#navi').scrollTop(0);
        if (key) {
            $('#contents').hide();
            var results = [[], [], []];
            $.each(_index, function() {
                var item = this;
                var key_matched = item.index.search(re);
                if (key_matched >= 0) {
                    var i =2;
                    if (item.key.search(re) == 0) {
                        i = 0;
                    } else if (key_matched == 0) {
                        i = 1;
                    }
                    results[i].push([item, null]);
                }
                return true;
            });
            var n = 0;
            $.each(results, function() {
                $.each(this, function() {
                    ul.append(itemIndex(this[0], this[1]));
                    n += 1;
                    return n > 30 ? false : true;
                });
            });
            if (n > 30) {
                ul.append('<li class="more">続きがあります</li>');
            }
            $('#index a:first').addClass('current');
            $('#navi li .key, #navi li .sub').highlight(key);
            zebraList();
            initPage($('#index'));
            $('#navi ul a').click(function(e) {
                clickNaviItem(this);
            });
        } else {
            $('#navi ul a').removeClass('current');
            $('#contents a:first').addClass('current');
            $('#contents').show();
        }
    }
}

function handleKey(key) {
    if (key == 38 || key == 40) { //[Up][Down]
        var first_idx = 0;
        if ($('#search-box').val()) {
            first_idx = $('#contents ul a').size();
        }
        var all = $('#navi ul a');
        var current = $('#navi ul a.current');
        var new_idx = all.index(current) + (key - 39);
        if (new_idx >= first_idx && new_idx < all.size()) {
            var next = all.eq(new_idx);
            current.removeClass('current');
            next.addClass('current');
        }
    } else if (key == 13) { //[Enter]
        var url = $('#navi ul a.current').attr('href');
        if (url) location.href = url;
    }
}

function clickNaviItem(target) {
    $('#navi ul a').removeClass('current');
    $(target).addClass('current');
}

$(function() {

    $('#search-box').attr('disabled', 'disabled');
    $('#search-box').val('');
    $('#navi ul a:first').addClass('current');

    loadIndex();

    $(window).hashchange(function() {
        loadPage();
    });

    if (!location.hash.match(/^#!/)) {
        location.hash = '#!/doc/index.html';
    }
    loadPage();

    $('#search-box').keydown(function(e) {
        handleKey(e.keyCode);
    });
    $('#search-box').keyup(function(e) {
        suggest();
    });
    $('#search-box').focus(function(e) {
        $(this).select();
    });
    $('#navi ul a').click(function(e) {
        clickNaviItem(this);
    });
});
