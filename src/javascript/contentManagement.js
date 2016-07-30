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
        $('.common-item').val("");
        $('#preview').html("");
        $('#tools>div').hide();
        $('.widget-layout').hide();
        $('#server_data>div').hide();
        $('#map_tool_container').show();
        $('#common_settings').show();
        $('#map_tool_info').show();
        $('#map_button').show();
    });
    $('#chart_tool').click(function () {
        ('.common-item').val("");
        $('#preview').html("");
        $('#tools>div').hide();
        $('#server_data>div').hide();
        $('#chart_tool_container').show();
        $('#common_settings').show();
        $('#chart_tool_info').show();
        $('#chart_button').show();
    });
    $('#box_tool').click(function () {
        $('.common-item').val("");
        $('#preview').html("");
        $('#tools>div').hide();
        $('.widget-layout').show();
        $('#server_data>div').hide();
        $('#box_tool_container').show();
        $('#common_settings').show();
        $('#box_tool_info').show();
        $('#box_button').show();
    });
});