// frida -n Surge -S nsurl.js
// frida -u -X nsurl.js Surge

if (ObjC.available) {
    // 拦截 dataTaskWithRequest
    // Intercept the NSURLSession's dataTaskWithRequest:completionHandler: method
    // var NSURLSession = ObjC.classes.NSURLSession;
    // var dataTaskWithRequest = NSURLSession['- dataTaskWithRequest:completionHandler:'];
    // Interceptor.attach(dataTaskWithRequest.implementation, {
    //     onEnter: function (args) {
    //         this.request = new ObjC.Object(args[2]);
    //
    //         var url = this.request.URL().absoluteString();
    //         var headers = this.request.allHTTPHeaderFields();
    //         var headersString = headers ? JSON.stringify(headers) : 'null';
    //
    //         var body = this.request.HTTPBody();
    //         var bodyString = body ? ObjC.classes.NSString.alloc().initWithData_encoding_(body, 4).toString() : 'null';
    //
    //         this.completionHandler = new ObjC.Block(args[3]);
    //         var block = this.completionHandler;
    //         var handler = block.implementation;
    //         block.implementation = function (data, response, error) {
    //             // Get the response data
    //             var responseString = data ? ObjC.classes.NSString.alloc().initWithData_encoding_(data, 4).toString() : 'null';
    //             console.log(`\n--- Network Request ---\n` +
    //                         `URL: ${url}\n` +
    //                         `Headers: ${headersString}\n` +
    //                         `Body: ${bodyString}\n` +
    //                         `Response: ${responseString}\n` +
    //                         `-----------------------\n`);
    //             // Call the original completion handler
    //             return handler(data, response, error);
    //         };
    //     }
    // });


    // Interceptor.attach(ObjC.classes.SGDNSPacket['+ queryPacketWithDomain:identifier:queryType:'].implementation, {
    //     onEnter: function (args) {
    //         // args[0] 是 self（SGDNSPacket 对象）
    //         // args[1] 是 _cmd（选择子）
    //         // args[2] 是 domain 参数
    //         // args[3] 是 identifier 参数
    //         // args[4] 是 queryType 参数
    //
    //         var domain = ObjC.Object(args[2]).toString();
    //         // 检查 domain 是否匹配
    //         if (domain === 'captive.apple.com') {
    //             console.log('queryPacketWithDomain:identifier:queryType: called');
    //             console.log('Domain: ' + domain);
    //             console.log('Identifier: ' + args[3].toInt32());
    //             console.log('Query Type: ' + args[4].toInt32());
    //             // 打印调用堆栈
    //             var backtrace = Thread.backtrace(this.context, Backtracer.ACCURATE)
    //                 .map(DebugSymbol.fromAddress)
    //                 .join('\n');
    //             console.log('Call Stack:\n' + backtrace);
    //         }
    //     },
    //     onLeave: function (retval) {
    //         // 输出 retval 的内容
    //         var retvalType = typeof retval;
    //         // 打印 retval 的值，根据其类型进行适当的转换
    //         if (retvalType === 'object') {
    //             // 如果 retval 是对象（例如指针），可以进一步检查
    //             if (retval.isNull()) {
    //                 console.log('Return Value is null');
    //             } else {
    //                 var obj = ObjC.Object(retval);
    //                 // 获取对象的类信息
    //                 // var cls = obj.$class;
    //                 // var className = cls.$className;
    //                 console.log('Return Value (Object): ' + obj.toString());
    //             }
    //         } else if (retvalType === 'number') {
    //             console.log('Return Value (Number): ' + retval.toInt32());
    //         } else {
    //             console.log('Return Value: ' + retval.toString());
    //         }
    //     }
    // });


    // 判断替换方法
    // var method = ObjC.classes.SGDNSPacket['+ queryPacketWithDomain:identifier:queryType:'];
    // var origImp = method.implementation;
    // // 基地址和偏移量
    // var baseAddr = Module.findBaseAddress("Surge");
    // var offset = 0x737000;
    // var addrFlag = baseAddr.add(offset);
    //
    // method.implementation = ObjC.implement(method, function (self, sel, domain, identifier, queryType) {
    //
    //     var domainStr = ObjC.Object(domain).toString();
    //
    //     if (domainStr === 'captive.apple.com') {
    //         console.log('domain detected: captive.apple.com');
    //
    //         // Memory.writeByteArray(addrFlag,[0x1]);
    //         var valueBefore = Memory.readPointer(addrFlag);
    //         console.log('Pointer value before: ' + valueBefore);
    //
    //         var result = origImp(self, sel, domain, identifier, queryType)
    //
    //         var valueAfter = Memory.readPointer(addrFlag);
    //         console.log('Pointer value after: ' + valueAfter);
    //         return result;
    //     }
    //
    //     return origImp(self, sel, domain, identifier, queryType);
    // });

} else {
    console.log('Objective-C Runtime is not available!');
}

//
// // Hook dlsym
// Interceptor.attach(Module.findExportByName(null, 'dlsym'), {
//     onEnter: function (args) {
//         this.handle = args[0];
//         this.symbol = args[1].readCString();
//
//         // 判断符号名称是否以 "Sec" 前缀开头
//         if (this.symbol.startsWith('Sec')) {
//             this.shouldLog = true; // 设置标志，以便在 onLeave 中输出
//             // console.log('dlsym called');
//             // console.log('Handle: ' + this.handle);
//             // console.log('Symbol: ' + this.symbol);
//         } else {
//             this.shouldLog = false;
//         }
//     },
//     onLeave: function (retval) {
//         // 仅在符号名称以 "Sec" 前缀开头时输出返回值
//         if (this.shouldLog) {
//             // console.log('Address: ' + retval);
//             // 尝试解析返回值的符号信息
//             var symbolInfo = DebugSymbol.fromAddress(retval);
//             // console.log('Return Value Symbol Info: ' + JSON.stringify(symbolInfo));
//
//             var symbolName = this.symbol;
//             // 设置 hook 到获取到的符号地址
//             Interceptor.attach(retval, {
//                 onEnter: function (args) {
//                     console.log('Entering ' + symbolName);
//                     this.aaa=args;
//                 },
//                 onLeave: function (retval) {
//                     console.log('Leaving ' + symbolName);
//                     console.log('Return Value: ' + retval);
//
//                     if (retval.toInt32() === 0x22000021) {
//                         retval.replace(ptr('0x22014221'));
//                         console.log('Return Value: ' + retval);
//                     }
//                     if (symbolName === 'SecStaticCodeCheckValidity') {
//                         retval.replace(ptr('0x0')); // 修改返回值为 0
//                         console.log('Modified return value for SecStaticCodeCheckValidity: 0');
//                     }
//                 }
//             });
//         }
//     }
// });
function base64(input) {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = new Uint8Array(input);
    while (i < input.byteLength) {
        chr1 = input[i++];
        chr2 = input[i++];
        chr3 = input[i++];
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
}

// 辅助函数：将 buffer 转换为十六进制字符串
function bufferToHex(buffer) {
    var hex = '';
    var view = new Uint8Array(buffer);
    for (var i = 0; i < view.length; i++) {
        hex += ('0' + view[i].toString(16)).slice(-2);
    }
    return hex;
}

var out;
var outLen;
Interceptor.attach(Module.findExportByName(null, 'CCCrypt'), {
       onEnter: function(args) {
        var valuein = '';
        try {
            valuein = Memory.readUtf8String(args[6]);
        } catch (error) {
            var dataLength = args[7].toInt32();
            valuein = base64(Memory.readByteArray(args[6], dataLength));
        }


        console.log('Value In: ' + valuein);
        var key = Memory.readByteArray(args[3], 32);
        console.log('Key: ' + base64(key));
        var iv = Memory.readByteArray(args[5], 16);
        console.log('IV: ' + base64(iv));
        // 打印 key 和 iv 的十六进制值
        console.log('Key (hex): ' + bufferToHex(key));
        console.log('IV (hex): ' + bufferToHex(iv));

        out = args[8];
        outLen = args[9];

    },

    onLeave: function(retval) {
        var valueout = '';
        try {
            var dataOutBuffer = Memory.readByteArray(out, outLen.toInt32());
            console.log('Data Out (hex): ' + bufferToHex(dataOutBuffer));
            valueout = Memory.readUtf8String(out);
        } catch (error) {
            var dataLength = outLen.toInt32();
            valueout = base64(Memory.readByteArray(out, dataLength));
        }
        console.log('Value Out: ' + valueout);
        console.log('\n');
    }
});