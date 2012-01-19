INDEX = [];

function log(s) {
    if (console) console.log(s);
}

function topUri() {
    return location.href.replace(/#.*?$/, '').replace(/[^\/]*$/, '');
}

function baseUri() {
    var base_path = location.hash.replace('#!', '').replace(/[^\/]*$/, '');
    return topUri() + base_path.replace(/^\//, '');
}

function absolutePath(path) {
    var e = document.createElement('span');
    var url = baseUri() + path.replace(/^\//, '');
    e.innerHTML = '<a href="' + url + '" />';
    var abs_path = path.match(/^\//) ? e.firstChild.href.replace(baseUri(), '') : e.firstChild.href.replace(topUri(), '');
    return abs_path;
}

function isAbsoluteUri(uri) {
    return uri.match(/^.*?:\/\//);
}

function loadPage() {
    if (location.hash.match(/^#!/)) {
        var path = location.hash.replace('#!', '');
        $('#body').text('読み込み中');
        $('#body').load(absolutePath(path), null, function() {
            initPage();
        });
    }
}

function initPage() {
    $('a').each(function() {
        var src_url = $(this).attr('href');
        if (!isAbsoluteUri(src_url) && !src_url.match(/^#/)) {
            $(this).attr('href', '#!/' + absolutePath(src_url));
        }
    });
}

function itemIndex(param) {
    var item = $('<li><a><span class="name"></span><span class="sub"></span><span class="desc"></span></a></li>');
    item.find('a').attr('href', param.path);
    item.find('a').attr('title', param.desc);
    item.find('.name').text(param.name);
    item.find('.sub').text(param.sub);
    item.find('.desc').text(param.desc);
    return item;
}

function loadIndex() {
    $.getJSON('index.json', function(json) {
        INDEX = json;
        var ul = $('#navi ul');
        $.each(json, function() {
            ul.append(itemIndex(this));
        });
        zebraList();
    });
}

function zebraList() {
    $('#navi li:odd').addClass('odd');
    $('#navi li:even').addClass('even');
}

function suggest() {
    log($('#search-box').val());
}

$(function() {

    loadIndex();

    $(window).hashchange(function() {
        loadPage();
    });
    
    if (!location.hash.match(/^#!/)) {
        location.hash = '#!/doc/index.html';
    }
    loadPage();

    $('#search-box').change(function() {
        suggest();
    });

});
