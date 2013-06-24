(function( $ ) {

    $.fn.login = function(options) { 

        // This is the easiest way to have default options.
        var settings = $.extend({
            // These are the defaults.
            login: "#emaillogin"
            , password: "#passwordlogin"
            , url: '/user/login'
            , success: responseOK
            , error: responseFAILED
            , errorDiv: "#loginError"
            , modalId: "#loginForm"
        }, options );

        function collectFormValues() {
            return {
                email: $(settings.login).val()
                    , password: $(settings.password).val()
            };
        }   

        function tryToLogin(vals) {
            if (!vals.email || !vals.password) {
                settings.error("Missing email or password");
                return;
            }
            $.ajax({
                url: settings.url
                , dataType: 'json'
                , processData: false
                , type: 'POST'
                , contentType: 'application/json'
                , data: JSON.stringify(vals)
                , success: function(data, status, jqXHR) { settings.success(JSON.parse(data), status); }
                , error: function(jqXHR, status, err) { settings.error(status, err); }
            });
        }

        function responseOK(data) {

            if (data.error) {
                responseFAILED(data.error);
            } else {
                // login success!
                // close modal (if there is one) - you are now logged in!
                $(settings.modalId).modal('hide');
                if (data.username) {
                    // refresh page
                    dust.render('index', { user: data }, function(err, out){
                        var newDoc = document.open("text/html", "replace");
                        newDoc.write(out);
                        newDoc.close();
                    });
                }
            }
        }

        function responseFAILED(errorStatus, httpError) {
            $(settings.errorDiv).html(errorStatus);
        }

        this.submit(function(event) {
            event.preventDefault();
            $(settings.errorDiv).html('');
            tryToLogin(collectFormValues());
        });

        /*
           $("#register").click(function(event) {
           event.preventDefault();
           console.log('REGISTER');
           });
           */

        return this;
    };

    $("#loginForm").login();
    $("#registerForm").login({ 
        url: "/user/register"
        , errorDiv: "#registerError"
        , modalId: "#registerForm"
        , login: "#emailregister"
        , password: "#passwordregister"
    });

})( jQuery );
