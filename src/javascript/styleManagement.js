$(document).ready(function () {
    var content = $('#content');
    var headerHeight = $('#header').height();
    var footerHeight = $('#footer').height();

    content.css({
        'min-height': ($(window).height() - headerHeight - footerHeight).toString() - 20 + 'px'
    });

    $('#preview').css({
        'height': (content.height() - 232).toString() + 'px'
    })


});