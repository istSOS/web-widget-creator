$(document).ready(function () {
    /**
     * INITIAL
     */

    if($(window).height() > 654){
        var height = $(window).height() - 154;
        var preview = 350 * height/500;
        var code = 140 * height / 500;
        $('#tools').css({
            'min-height': height.toString() + 'px'
        });

        $('#preview').css ({
            'min-height': preview.toString() + 'px'
        });

        $('#code').css ({
            'min-height': code.toString() + 'px',
            'margin-top': (height - preview - code).toString() + 'px'
        });
        $('#server_data').css({
            'min-height': height.toString() + 'px'
        });

    } else {
        $('#tools').css({
            'min-height': '500px'
        });

        $('#preview').css ({
            'min-height': '350px'
        });

        $('#code').css ({
            'min-height': '140px',
            'margin-top': '10px'
        });

        $('#server_data').css({
            'min-height': '500px'
        });
    }

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
    /**
     * RESIZE
     */
    $(window).resize(function () {
        if($(window).height() > 654){
            var height = $(window).height() - 154;
            var preview = 350 * height/500;
            var code = 140 * height / 500;
            $('#tools').css({
                'min-height': height.toString() + 'px'
            });

            $('#preview').css ({
                'min-height': preview.toString() + 'px'
            });

            $('#code').css ({
                'min-height': code.toString() + 'px',
                'margin-top': (height - preview - code).toString() + 'px'
            });
            $('#server_data').css({
                'min-height': height.toString() + 'px'
            });
        } else {
            $('#tools').css({
                'min-height': '500px'
            });

            $('#preview').css ({
                'min-height': '350px'
            });

            $('#code').css ({
                'min-height': '140px',
                'margin-top': '10px'
            });

            $('#server_data').css({
                'min-height': '500px'
            });
        }
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
});
