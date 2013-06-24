(function( $ ) {

    $.fn.logout = function(options) { 

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            url: '/user/logout'
            , success: responseOK
            , error: responseFAILED

        }, options );

        this.click(function(event) {
            $.ajax({
                url: settings.url
                , type: 'POST'
                , success: function(data, status, jqXHR) { settings.success(data, status); }
                , error: function(jqXHR, status, err) { settings.error(status, err); }
            });
        });

        function responseOK(data) {
            dust.render('index', {}, function(err, out){
                var newDoc = document.open("text/html", "replace");
                newDoc.write(out);
                newDoc.close();
            });
        }

        function responseFAILED(errorStatus, httpError) {
        }

        return this;
    };

    $("#logout").logout();

})( jQuery );
