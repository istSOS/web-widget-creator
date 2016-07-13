$(document).ready(function () {
    /**
     * INITIAL
     */
    var titlediv = $('#title').height();
    var title_p = $('#title_p').height();
    $('#title_p').css({
        'margin-top': (titlediv/2 - title_p/2).toString() + 'px'
    });

    if($(window).width() < 753) {
        $('#categories_list').css({
            'display': 'none'
        });
    } else {
        $('#categories_list').css({
            'display': 'inline-block'
        });
    }
    $('#menu').click(function () {
        $('#categories_list').slideToggle();
    });
    var contentHeight = $('#content').height();

    $('#tools').css({
        'min-height': contentHeight.toString() + 'px'
    });

    $('#output').css({
        'min-height': contentHeight.toString() + 'px'
    });

    $('#server_data').css({
        'min-height': contentHeight.toString() + 'px'
    });
    var previewHeight = contentHeight * 70 / 100;
    var codeHeight = contentHeight * 28 / 100;
    $('#preview').css({
        'min-height': previewHeight.toString() + 'px'
    });

    $('#code').css({
        'min-height': codeHeight.toString() + 'px'
    });

    $('#code').css({
        'margin-top': ($('#content').height() - 40 - $('#preview').height() - $('#code').height()).toString() + 'px'
    });

    $('#preview_container').height(previewHeight);

    var diff = $(window).height() - 154 - contentHeight;
    console.log(diff);
    var t = $('#tools').height();
    var o = $('#output').height();
    var s = $('#server_data').height();
    var check = [t, o, s];
    var max = Math.max.apply(Math, check);
    if(diff >= 0) {
        if(max >= contentHeight) {
            max += diff;
            console.log('max > content');
            $('#content').css({
                'min-height': max.toString() + 'px'
            });

            $('#tools').css({
                'min-height': max.toString() + 'px'
            });

            $('#output').css({
                'min-height': max.toString() + 'px'
            });

            $('#server_data').css({
                'min-height': max.toString() + 'px'
            });
            var previewHeight = (contentHeight + diff) * 70 / 100;
            var codeHeight = (contentHeight + diff) * 28 / 100;
            $('#preview').css({
                'min-height': previewHeight.toString() + 'px'
            });

            $('#code').css({
                'min-height': codeHeight.toString() + 'px'
            });

            $('#code').css({
                'margin-top': ($('#content').height() - 40 - $('#preview').height() - $('#code').height()).toString() + 'px'
            });
            $('#preview_container').height(previewHeight);
        }
    } else {
        if(max >= contentHeight){
            $('#content').css({
                'min-height': max.toString() + 'px'
            });

            $('#tools').css({
                'min-height': max.toString() + 'px'
            });
            $('#output').css({
                'min-height': max.toString() + 'px'
            });
            $('#server_data').css({
                'min-height': max.toString() + 'px'
            });
            var previewHeight = contentHeight * 70 / 100;
            var codeHeight = contentHeight * 28 / 100;
            $('#preview').css({
                'min-height': previewHeight.toString() + 'px'
            });

            $('#code').css({
                'min-height': codeHeight.toString() + 'px'
            });

            $('#code').css({
                'margin-top': ($('#content').height() - 44 - $('#preview').height() - $('#code').height()).toString() + 'px'
            });
        }

    }
    if ($(window).width() < 992) {
        $('#content').css({
            'min-height': ''
        });

        $('#tools').css({
            'min-height': '',
            'padding': '10px 0 10px 0'
        });
        $('#output').css({
            'min-height': ''
        });
        $('#server_data').css({
            'min-height': ''
        });
        $('#preview').css({
            'min-height': ''
        });

        $('#code').css({
            'min-height': ''
        });

        $('#code').css({
            'margin-top': '10px'
        });
    }


    /**
     * RESIZE
     */
    $(window).resize(function () {
        var titlediv = $('#title').height();
        var title_p = $('#title_p').height();
        $('#title_p').css({
            'margin-top': (titlediv/2 - title_p/2).toString() + 'px'
        });

        /**
         * MENU BAR and CATEGORIES
         */
        if($(window).width() < 753) {
            $('#categories_list').css({
                'display': 'none'
            });
        } else {
            $('#categories_list').css({
                'display': 'inline-block'
            });
        }

    });

    /*
    * CATEGORIES&TOOLS
    */

    $('#creation').click(function () {
        $('#tools_container>p').hide();
        $('#tools_container>hr').hide();
        $('#tools_container .tools_list').hide();
        $('#tools_container>a').hide();
        $('#tools_container>br').hide();
        $('#creation_tools').fadeIn('fast');

    });

    $('#modification').click(function () {
        $('#tools_container>p').hide();
        $('#tools_container>hr').hide();
        $('#tools_container .tools_list').hide();
        $('#tools_container>a').hide();
        $('#tools_container>br').hide();
        $('#modification_tools').fadeIn('fast');

    });

    $('#deletion').click(function () {
        $('#tools_container>p').hide();
        $('#tools_container>hr').hide();
        $('#tools_container .tools_list').hide();
        $('#tools_container>a').hide();
        $('#tools_container>br').hide();
        $('#deletion_tools').fadeIn('fast');

    });

    $('#map_tools').click(function () {
        $('#tools_container>p').hide();
        $('#tools_container>hr').hide();
        $('#tools_container .tools_list').hide();
        $('#tools_container>a').hide();
        $('#tools_container>br').hide();
        $('#map_tools_list').fadeIn('fast');
    })

});


