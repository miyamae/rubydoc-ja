
function baseUri() {
    return location.href.replace(/#.*?$/, '').replace(/[^/]*$/, '');
}

function absolutePath(path) {
    var e = document.createElement('span');
    var url = path.match(/^\//) ? baseUri().replace(/\/$/, '') + path : path;
    e.innerHTML = '<a href="' + url + '" />';
    return e.firstChild.href.replace(/^https?:\/\/.*?\//, '/');
}

function isAbsoluteUri(uri) {
    return uri.match(/^.*?:\/\//);
}

function ajaxLoadPage(path, data, success) {
    $.ajax({
        type: 'get',
        url: path,
        data: data,
        cache: true,
        success: success
    });
}

function loadPage() {
    if (location.hash.match(/^#!/)) {
        var path = location.hash.replace('#!', '');
        $('#body').text('読み込み中');
        ajaxLoadPage(absolutePath(path), null, function(html) {
            $('#body').html(html);
            initPage();
        });
    }
}

function initPage() {
    $('a').each(function() {
        var src_url = $(this).attr('href');
        if (!isAbsoluteUri(src_url) && !src_url.match(/^#/)) {
            $(this).attr('href', '#!' + absolutePath(src_url));
        }
    });
}

$(function() {

    $('#navi li:odd').addClass('odd');
    $('#navi li:even').addClass('even');

    $(window).hashchange(function() {
        loadPage();
    });
    
    if (!location.hash.match(/^#!/)) {
        location.hash = '#!/doc/index.html';
    }
    loadPage();

});
