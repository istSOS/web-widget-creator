$(document).ready(function() {
    var content = $('#content');
    var headerHeight = $('#header').height();
    var footerHeight = $('#footer').height();

    content.css({
        'min-height': ($(window).height() - headerHeight - footerHeight - 20).toString() + 'px'
    });

    $('#preview').css({
        'height': (content.height() - 222).toString() + 'px'
    });

    $('#auto-update').change(function(evt) {
        if(this.checked) {
            $('#auto-update-interval').show();
        } else {
            $('#auto-update-interval').hide();
        }
    });


    $('#map_tool').click(function() {
        $('.common-item').val("");
        $('#preview').html("");
        $('#tools>div').hide();
        $('.widget-layout').hide();
        $('#server_data>div').hide();
        $('#code_output').val("");
        $('#map_tool_container').show();
        $('#common_settings').show();
        $('#map_tool_info').show();
        $('#map_button').show();
    });
    $('#chart_tool').click(function() {
        $('.common-item').val("");
        $('#preview').html("");
        $('#tools>div').hide();
        $('#server_data>div').hide();
        $('#code_output').val("");
        $('.widget-layout').hide();
        $('#chart_tool_container').show();
        $('#common_settings').show();
        $('#chart_tool_info').show();
        $('#chart_button').show();
    });
    $('#box_tool').click(function() {
        $('.common-item').val("");
        $('#preview').html("");
        $('#tools>div').hide();
        $('.widget-layout').show();
        $('#server_data>div').hide();
        $('#code_output').val("");
        $('#box_tool_container').show();
        $('#common_settings').show();
        $('#box_tool_info').show();
        $('#box_button').show();
    });
    
    var tz = ["−12:00", "−11:00", "−10:00", "−09:30", "−09:00", "−08:00", "−07:00", "−06:00", "−05:00", "−04:00", "−03:30", "−03:00", "−02:00", "−01:00", "Z", "+01:00", "+02:00", "+03:00", "+03:30", "+04:00", "+04:30", "+05:00", "+05:30", "+05:45", "+06:00", "+06:30", "+07:00", "+08:00", "+08:30", "+08:45", "+09:00", "+09:30", "+10:00", "+10:30", "+11:00", "+12:00", "+12:45", "+13:00", "+14:00"]
    tz.forEach(function(t) {
        var option = document.createElement('option');
        option.innerHTML = t;
        if(t === "Z") {
            option.setAttribute('selected','');
        }
        document.getElementById('timeZone').appendChild(option);
    });

});