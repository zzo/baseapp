/*
 * suck client-side coverage info out
 * POST it back
 * suck client+server side coverage out
 * persist to file
 */
exports.GetCoverage = (function() { 
    var currentX = 1
        , path = require('path')
        , http = require('http')
        , fs = require('fs')
        , outputDir = 'build/reports/webdriver'
    ;

    // 1. Get client-side CC 
    // 2. POST it back to /coverage/client
    // 3. GET & save /coverage/object = total coverage of client + server side code
    // 4. When all tests are done 'istanbul report ...' them (% grunt total_coverage)
    return function saveCoverage(client, host, port) {
        var outputTmpl = path.join(outputDir, 'coverage_' + currentX++);
        client.execute("return JSON.stringify(__coverage__);", null, function(err, result) {
            if (err) return;  // guess they don't got coverage

            // now post the client-side coverage back to '/client'
            var options = {
                hostname: host
            , port: port
            , path: '/coverage/client'
            , method: 'POST'
            , headers: {
                'Content-type': 'application/json'
                }
            }
            , req = http.request(options, function(res) {
                // now download full CC
                options.method = 'GET';
                options.headers = {};
                options.path = '/coverage/object';
                var dlReq = http.request(options, function(res) {
                    var output = fs.createWriteStream(outputTmpl + '.json');
                    res.pipe(output);
                    console.log('got coverage: ' + outputTmpl);
                });
                dlReq.end();
            });

            req.end(result.value); // POST client code coverage
        });
    };
})();
