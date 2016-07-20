$(document).ready(function () {

    var content = $('#content');
    var headerHeight = $('#header').height();
    var footerHeight = $('#footer').height();

    content.css({
        'min-height': ($(window).height() - headerHeight - footerHeight).toString() - 20 + 'px'
    });

    $('#preview').css({
        'height': (content.height() - 232).toString() + 'px'
    });

    $('#map_tool').click(function () {
        $('#tools>div').hide();
        $('#map_tool_container').show();
    });
    $('#chart_tool').click(function () {
        $('#tools>div').hide();
        $('#chart_tool_container').show();
    });
    $('#box_tool').click(function () {
        $('#tools>div').hide();
        $('#box_tool_container').show();
    });


});