
function get_func_addr(module, offset) {
    var base_addr = Module.findBaseAddress(module);
    // console.log("base_addr: " + base_addr);
    // console.log(hexdump(ptr(base_addr), {
    //          length: 16,
    //          header: true,
    //          ansi: true
    //      }))
    var func_addr = base_addr.add(offset);
    if (Process.arch == 'arm')
        return func_addr.add(1);  //如果是32位地址+1
    else
        return func_addr;
}
if (ObjC.available) {
    // 拦截 dataTaskWithRequest
    // Intercept the NSURLSession's dataTaskWithRequest:completionHandler: method
    var NSURLSession = ObjC.classes.NSURLSession;
    var dataTaskWithRequest = NSURLSession['- dataTaskWithRequest:completionHandler:'];
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

    // Hook __NSDictionaryI's objectForKeyedSubscript:
    // var NSDictionaryI = ObjC.classes.__NSDictionaryI;
    // Interceptor.attach(NSDictionaryI["- objectForKeyedSubscript:"].implementation, {
    //     onEnter: function (args) {
    //         var key = ObjC.Object(args[2]); // 第一个参数是 self，第二个参数是 _cmd，第三个参数是 key
    //         console.log("NSDictionaryI objectForKeyedSubscript: key = " + key);
    //     },
    //     onLeave: function (retval) {
    //         var result = ObjC.Object(retval); // 返回值
    //         console.log("NSDictionaryI objectForKeyedSubscript: return value = " + result);
    //     }
    // });

    // 模糊 hook oc
    // 遍历所有加载的类
    // ObjC.enumerateLoadedClasses({
    //     onMatch: function(className) {
    //         var classRef = ObjC.classes[className];
    //         // 检查当前类是否有名为 objectForKeyedSubscript: 的方法
    //         if (classRef && classRef["- objectForKeyedSubscript:"]) {
    //             var method = classRef["- objectForKeyedSubscript:"];
    //             console.log("Hooking method in class: " + className);
    //
    //             try {
    //                 Interceptor.attach(method.implementation, {
    //                     onEnter: function (args) {
    //                         // args[0] 是 self，args[1] 是 _cmd，args[2] 是传入的参数
    //                         try {
    //                             var slf = ObjC.Object(args[0]); // 获取当前类的实例
    //                             var className = slf.$className; // 获取类名
    //                         } catch (e) {
    //                         }
    //                         var key = ObjC.Object(args[2]); // 获取传入的参数
    //                         console.log("objectForKeyedSubscript: called with key: ", className, slf, key);
    //                     },
    //                     onLeave: function (retval) {
    //                         // 获取返回值的 Objective-C 对象
    //                         var returnValue = ObjC.Object(retval);
    //                         console.log("objectForKeyedSubscript: return value: ", returnValue);
    //                     }
    //                 });
    //             } catch (e) {
    //                 console.log("Interceptor objectForKeyedSubscript error : ", classRef);
    //
    //             }
    //         }
    //     },
    //     onComplete: function() {
    //         console.log("Finished enumerating classes.");
    //     }
    // });



    // var PacketTunnelProvider = ObjC.classes["PacketTunnelProvider"];
    // if (PacketTunnelProvider){
    //     Interceptor.attach(PacketTunnelProvider["- setTunnelNetworkSettings:completionHandler:"].implementation, {
    //         onEnter: function(args) {
    //             var clz = ObjC.Object(args[0]);
    //             var settings = ObjC.Object(args[2]); // 假设参数是某个设置对象
    //             console.log("setTunnelNetworkSettings: called with settings: ",clz, settings);
    //         },
    //         onLeave: function(retval) {
    //         }
    //     });
    // }else {
    //     console.log("PacketTunnelProvider is  null");
    //
    // }

} else {
    console.log('Objective-C Runtime is not available!');
}


// lldb -p 69777
