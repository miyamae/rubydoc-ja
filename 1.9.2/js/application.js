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
        $('#body').html('<div class="loading"></div');
        $('#body').load(absolutePath(path), null, function() {
            initPage($('#body'));
            if (path.match(/\?(.*)$/)) {
                var top = $('#' + RegExp.$1).offset().top;
                $('#content').scrollTop(top);
            }
        });
    }
}

function initPage(elem) {
    var as = elem ? elem.find('a') : $('a');
    as.each(function() {
        var src_url = $(this).attr('href');
        if (src_url.match(/^#(.*)$/)) {
            var id = RegExp.$1;
            $(this).attr('href', '#!' + currentPath().replace(/\?.*$/, '') + '?' + id);
        } else if (!isAbsoluteUri(src_url)) {
            $(this).attr('href', '#!/' + absolutePath(src_url.replace('#', '?')));
        }
    });
}

function itemIndex(param) {
    var item = $('<li><a><span class="key"></span><span class="sub"></span><span class="desc"></span></a></li>');
    item.find('li').attr('id', 'idx' + param.id);
    item.find('a').attr('href', param.path);
    item.find('a').attr('title', '【' + param.key + '】' +  param.desc);
    item.find('.key').text(param.key);
    item.find('.sub').text(param.sub);
    item.find('.desc').text(param.desc);
    return item;
}

_index = [];

function loadIndex() {
    $.getJSON('json/index.json', function(json) {
        _index = json;
        $('#search-box').removeAttr('disabled');
        $('#search-box').focus();
        $('#navi ul').empty();
    });
}

function zebraList() {
    $('#navi li:odd').addClass('odd');
    $('#navi li:even').addClass('even');
}

function suggest() {
    var key = $('#search-box').val().toLowerCase();
    var n = 0;
    var ul = $('#navi ul'); 
    ul.empty();
    if (key) {
        var results = [[], [], []];
        $.each(_index, function() {
            if (this.key && this.key.toLowerCase().indexOf(key) == 0) {
                results[0].push(this);
                n += 1;
                if (n > 30) return false;
            }
            return true;
        });
        $.each(_index, function() {
            if (this.key && this.key.toLowerCase().indexOf(key) > 0) {
                results[1].push(this);
                n += 1;
                if (n > 30) return false;
            }
            return true;
        });
        $.each(results, function() {
            $.each(this, function() {
                ul.append(itemIndex(this));
            });
        });
        if (n > 30) {
            ul.append('<li class="more">続きがあります</li>');
        }
        $('#navi li .key').highlight(key);
        zebraList();
        initPage($('#navi'));
    }
}

$(function() {

    $('#search-box').attr('disabled', 'disabled');
    $('#search-box').val('');

    loadIndex();

    $(window).hashchange(function() {
        loadPage();
    });
    
    if (!location.hash.match(/^#!/)) {
        location.hash = '#!/doc/index.html';
    }
    loadPage();

    $('#search-box').keyup(function(e) {
        suggest();
    });
    $('#search-box').focus(function(e) {
        $(this).select();
    });

});
