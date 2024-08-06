// frida -n Surge -S nsurl.js
// frida -u -X nsurl.js Surge

if (ObjC.available) {
    // Intercept the NSURLSession's dataTaskWithRequest:completionHandler: method
    var NSURLSession = ObjC.classes.NSURLSession;
    var dataTaskWithRequest = NSURLSession['- dataTaskWithRequest:completionHandler:'];
    Interceptor.attach(dataTaskWithRequest.implementation, {
        onEnter: function (args) {
            // Save the request
            this.request = new ObjC.Object(args[2]);
            console.log('Request: ' + this.request);
            var url = this.request?this.request.toString():"null"

            // Save the completion handler block
            this.completionHandler = new ObjC.Block(args[3]);
            var block = this.completionHandler;
            var handler = block.implementation;
            block.implementation = function (data, response, error) {
                // Print response data
                if (data) {
                    var dataString = ObjC.classes.NSString.alloc().initWithData_encoding_(data, 4); // 4 = NSUTF8StringEncoding
                    console.log(url + '>>> Response Data: ' + dataString.toString());
                }
                // Call original completion handler
                return handler(data, response, error);
            };
        }
    });

    Interceptor.attach(dataTaskWithRequest.implementation, {
        onEnter: function (args) {
            this.request = new ObjC.Object(args[2]);

            var url = this.request.URL().absoluteString();
            var headers = this.request.allHTTPHeaderFields();
            var headersString = headers ? JSON.stringify(headers) : 'null';

            var body = this.request.HTTPBody();
            var bodyString = body ? ObjC.classes.NSString.alloc().initWithData_encoding_(body, 4).toString() : 'null';

            this.completionHandler = new ObjC.Block(args[3]);
            var block = this.completionHandler;
            var handler = block.implementation;
            block.implementation = function (data, response, error) {
                // Get the response data
                var responseString = data ? ObjC.classes.NSString.alloc().initWithData_encoding_(data, 4).toString() : 'null';
                console.log(`\n--- Network Request ---\n` +
                            `URL: ${url}\n` +
                            `Headers: ${headersString}\n` +
                            `Body: ${bodyString}\n` +
                            `Response: ${responseString}\n` +
                            `-----------------------\n`);
                // Call the original completion handler
                return handler(data, response, error);
            };
        }
    });


} else {
    console.log('Objective-C Runtime is not available!');
}
