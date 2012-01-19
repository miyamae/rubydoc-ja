
function log(s) {
    console.log(s);
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
    return $('<li>xxx</li>');
}

function loadIndex() {
    $.getJSON('index.json', function(json) {
        var ul = $('#navi ul');
        $.each(json, function() {
            ul.append(itemIndex(this));
        });
    });
}

$(function() {

    $('#navi li:odd').addClass('odd');
    $('#navi li:even').addClass('even');

    loadIndex();

    $(window).hashchange(function() {
        loadPage();
    });
    
    if (!location.hash.match(/^#!/)) {
        location.hash = '#!/doc/index.html';
    }
    loadPage();

});
