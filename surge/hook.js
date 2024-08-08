// frida -n Surge -S nsurl.js
// frida -u -X nsurl.js Surge

var baseAddr = Module.findBaseAddress("Surge");

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


    // 挂钩 SGDNSPacket 类的 -answer 方法
    // var SGDNSPacket = ObjC.classes.SGDNSPacket;
    // var method = SGDNSPacket['- answer'];
    //
    // Interceptor.attach(method.implementation, {
    //     onEnter: function (args) {
    //         // 输出 self 的信息
    //         var self = new ObjC.Object(args[0]);
    //         console.log('self: ' + self);
    //
    //         // 遍历 self 的属性
    //         var props = self.$ownMethods;
    //         console.log('self properties: ' + props.join(', '));
    //     },
    //     onLeave: function (retval) {
    //         if (retval.isNull()) {
    //             console.log("answer returned null");
    //             return;
    //         }
    //         // 遍历 NSArray 的代码如下：
    //         var array = new ObjC.Object(retval);
    //         var count = array.count().valueOf();
    //         for (var i = 0; i !== count; i++) {
    //           var element = array.objectAtIndex_(i);
    //           console.log(element);
    //         }
    //     }
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


// hook CCCrypt
// var out;
// var outLen;
//
// Interceptor.attach(Module.findExportByName(null, 'CCCrypt'), {
//        onEnter: function(args) {
//         var valuein = '';
//         try {
//             valuein = Memory.readUtf8String(args[6]);
//         } catch (error) {
//             var dataLength = args[7].toInt32();
//             valuein = base64(Memory.readByteArray(args[6], dataLength));
//         }
//
//
//         console.log('Value In: ' + valuein);
//         var key = Memory.readByteArray(args[3], 32);
//         console.log('Key: ' + base64(key));
//         var iv = Memory.readByteArray(args[5], 16);
//         console.log('IV: ' + base64(iv));
//         // 打印 key 和 iv 的十六进制值
//         console.log('Key (hex): ' + bufferToHex(key));
//         console.log('IV (hex): ' + bufferToHex(iv));
//
//         out = args[8];
//         outLen = args[9];
//
//     },
//
//     onLeave: function(retval) {
//         var valueout = '';
//         try {
//             var dataOutBuffer = Memory.readByteArray(out, outLen.toInt32());
//             console.log('Data Out (hex): ' + bufferToHex(dataOutBuffer));
//             valueout = Memory.readUtf8String(out);
//         } catch (error) {
//             var dataLength = outLen.toInt32();
//             valueout = base64(Memory.readByteArray(out, dataLength));
//         }
//         console.log('Value Out: ' + valueout);
//         console.log('\n');
//     }
// });
//
// Interceptor.attach(Module.findExportByName(null, 'CCCrypt'), {
//   onEnter: function (args) {
//     console.log("[+] CCCrypt function called");
//     console.log("[+] CCOperation: " + args[0].toInt32());
//     console.log("[+] CCAlgorithm: " + args[1].toInt32());
//     console.log("[+] CCOptions: " + args[2].toInt32());
//     console.log("[+] key: " + hexdump(ptr(args[3]), { length: args[4].toInt32() }));
//     console.log("[+] keyLength: " + args[4].toInt32());
//     if (!args[5].isNull()) {
//       console.log("[+] iv: " + hexdump(ptr(args[5]), { length: 16 }));
//     }else{
//       console.log("[+] iv: 0x0");
//     }
//     console.log("[+] dataIn: \n" + hexdump(ptr(args[6]), { length: args[7].toInt32() }));
//     console.log("[+] dataInLength: " + args[7].toInt32());
//     this.dataOutPtr = args[8];
//     this.dataOutLengthPtr = args[10];
//   },
//   onLeave: function (retval) {
//     console.log("[+] dataOut: \n" + hexdump(ptr(this.dataOutPtr), { length: ptr(this.dataOutLengthPtr).readUInt() }));
//   }
// });

function readMemory() {
    try {
        var tmp_addr = baseAddr.add(0x737d98);
        const value = Memory.readPointer(tmp_addr); // 假设要读取 32 位无符号整数
        console.log('Value at address', tmp_addr, ':', value);
    } catch (e) {
        console.error('Failed to read memory:', e);
    }
}

//  // 每隔 5 秒读取一次内存
// setInterval(readMemory, 500);


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

// hook subxx 方法
// var cap1 = get_func_addr('Surge', 0xf478);
// Interceptor.attach(ptr(cap1), {
//    onEnter: function(args) {
//       console.log("cap1 onEnter");
//       readMemory();
//    },
//    onLeave: function(retval) {
//       console.log("cap1 onLeave");
//       readMemory();
//    }
// });
//
// var cap2 = get_func_addr('Surge', 0x142e8);
// Interceptor.attach(ptr(cap2), {
//    onEnter: function(args) {
//       console.log("cap2 onEnter");
//       readMemory();
//    },
//    onLeave: function(retval) {
//       console.log("cap2 onLeave");
//       readMemory();
//    }
// });


// 目标地址
//
// // 000000010000e8cc         cmp        r14d, r13d
// // 000000010000e8cf         jne        loc_10000e900
// Interceptor.attach(ptr(get_func_addr('Surge', 0xe8cc)), {
//     onEnter: function (args) {
//         // 打印寄存器 w25 和 w20 的值
//         // 0x1cf3fd11
//         // 0x1cf3fd11
//         // 0xa0f3fd11
//         // 0xa0f3fd11
//         console.log(this.context.r13);
//         console.log(this.context.r14);
//     },
//     onLeave: function (retval) {
//         // 可以在这里处理返回值，如果需要的话
//     }
// });
//
//
// // 00000001000145a5         cmp        r14d, r13d
// // 00000001000145a8         jne        loc_100014616
// Interceptor.attach(ptr(get_func_addr('Surge', 0x145a5)), {
//     onEnter: function (args) {
//         // 打印寄存器 w25 和 w20 的值
//         console.log(this.context.r13);
//         console.log(this.context.r14);
//     },
//     onLeave: function (retval) {
//         // 可以在这里处理返回值，如果需要的话
//     }
// });


Interceptor.attach(Module.getExportByName(null, 'sendto'), {
    onEnter: function (args) {
        var sockfd = args[0].toInt32();
        var buf = args[1];
        var len = args[2].toInt32();
        var dest_addr = args[4];
        if (dest_addr.equals(0)) {
            dest_addr = Memory.alloc(16);
            var addr_len = Memory.alloc(4);
            Memory.writeU32(addr_len, 16);
            var getpeername = new NativeFunction(Module.findExportByName(null, "getpeername"), "int", ["int", "pointer", "pointer"]);
            getpeername(sockfd, dest_addr, addr_len);
        }
        var sin_family = Memory.readU8(dest_addr.add(1));
        if (sin_family != 2) return;
        var sin_port = Memory.readU16(dest_addr.add(2));
        sin_port = ((sin_port & 0xff) << 8) | ((sin_port >> 8) & 0xff);
        var sin_addr = Memory.readU32(dest_addr.add(4));
        var sin_ip = (sin_addr & 0xff).toString() + '.' + ((sin_addr >> 8) & 0xff).toString() +
            '.' + ((sin_addr >> 16) & 0xff).toString() + '.' + ((sin_addr >> 24) & 0xff).toString();
        console.log("sendto(sockfd=" + args[0] + ",buflen=" + len + ",family=" + sin_family +
            ",ip=" + sin_ip + ",port=" + sin_port + ")");
        console.log(hexdump(buf, {length: len, header: false}));
    },
    onLeave: function (retval) {
        console.log('sendto return value: ' + retval.toInt32());
    }
});

// Hook recvfrom function
Interceptor.attach(Module.getExportByName(null, 'recvfrom'), {
    onEnter: function (args) {
        this.gargs = new Array(6);
        for (var i = 0; i < 6; i++) {
            this.gargs[i] = args[i];
        }
    },
    onLeave: function (retval) {
        var args = this.gargs;
        var sockfd = args[0].toInt32();
        var buf = args[1];
        var len = retval.toInt32();
        var dest_addr = args[4];
        if (dest_addr.equals(0)) {
            dest_addr = Memory.alloc(16);
            var addr_len = Memory.alloc(4);
            Memory.writeU32(addr_len, 16);
            var getpeername = new NativeFunction(Module.findExportByName(null, "getpeername"), "int", ["int", "pointer", "pointer"]);
            getpeername(sockfd, dest_addr, addr_len);
        }
        var sin_family = Memory.readU8(dest_addr.add(1));
        if (sin_family !== 2) return;
        var sin_port = Memory.readU16(dest_addr.add(2));
        sin_port = ((sin_port & 0xff) << 8) | ((sin_port >> 8) & 0xff);
        var sin_addr = Memory.readU32(dest_addr.add(4));
        var sin_ip = (sin_addr & 0xff).toString() + '.' + ((sin_addr >> 8) & 0xff).toString() +
            '.' + ((sin_addr >> 16) & 0xff).toString() + '.' + ((sin_addr >> 24) & 0xff).toString();
        console.log("recvfrom(sockfd=" + args[0] + ",buflen=" + len + ",family=" + sin_family +
            ",ip=" + sin_ip + ",port=" + sin_port + ")");
        console.log(hexdump(buf, {length: len, header: false}));
    }
});