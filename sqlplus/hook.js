function logMessage(message) {
    console.log(message);
//     var file = new File("frida_out.log","a+");//a+表示追加内容，此处的模式和c语言的fopen函数模式相同
//     file.write(message + "\n");
//     file.flush()
//     file.close();
}
//
//// 用于存储库句柄和库名的映射
//var libraryMap = {};
//
//// 拦截 LoadLibraryA 函数
//Interceptor.attach(Module.findExportByName(null, 'LoadLibraryA'), {
//    onEnter: function (args) {
//        this.libName = Memory.readUtf8String(args[0]);
//    },
//    onLeave: function (retval) {
//        // 将加载的库名与库句柄关联
//        if (retval.toInt32() !== 0) {
//            libraryMap[retval.toString()] = this.libName;
////            logMessage('LoadLibraryA called with:' + this.libName);
//            logMessage('LoadLibraryA called with:' + this.libName);
//        }
//    }
//});
//
//// 拦截 GetProcAddress 函数
//Interceptor.attach(Module.findExportByName(null, 'GetProcAddress'), {
//    onEnter: function (args) {
//        var libHandle = args[0].toString();
//        var funcName = Memory.readUtf8String(args[1]);
//
//        // 从库句柄获取库名
//        var libName = libraryMap[libHandle];
//
//        if (funcName.startsWith("OCI")) {
////            logMessage('Filtered GetProcAddress call: libName:'+ libName +  ', function name:' + funcName);
//            if (funcName === "OCIServerAttach") {
//                console.log('Hooking OCIServerAttach function');
//
//                // 进行 hook 操作
//                Interceptor.attach(Module.getExportByName(libName, funcName), {
//                    onEnter: function (args) {
//                        console.log('OCIServerAttach called');
//
//
//                        try{
//                            console.log('Number of arguments:');
//                            // 可以在此处添加自定义逻辑
//                            console.log('a1:', Memory.readInt(args[0])); // a1: -118891829
//                            console.log('a2:', Memory.readInt(args[1])); // a2: -118891829
//                            console.log('a3:', Memory.readUInt(args[2])); // a3: 775369265
//                            console.log('a4:', args[3]); // a4: 0x11
//                            console.log('a5:', args[4]); // a5: 0x0
//
//
//                             // 假设 a1 是第一个参数
//                            var a1 = args[0];
//
//                            // 读取条件中需要的值
//                            var valueAtA1 = Memory.readInt(a1); // *(_DWORD *)a1
//                            var byteAtA1Plus5 = Memory.readU8(ptr(a1.add(5))); // *(_BYTE *)(a1 + 5)
//                            var qwordAtA1Plus600 = Memory.readInt(ptr(a1.add(600))); // *(_QWORD *)(a1 + 600)
//                            var a1Plus704 = a1.add(704); // a1 + 704
//
//                            // 输出读取的值
//                            console.log('Value at a1:', valueAtA1);
//                            console.log('Byte at a1 + 5:', byteAtA1Plus5);
//                            console.log('QWORD at a1 + 600:', qwordAtA1Plus600);
//                            console.log('a1 + 704:', a1Plus704);
//
//                            // 输出判断条件的结果
//                            var condition1 = valueAtA1 != -118891829;
//                            var condition2 = byteAtA1Plus5 != 8;
//                            var condition3 = Memory.readInt(a1Plus704) != qwordAtA1Plus600;
//
//                            console.log('Condition 1 (valueAtA1 != -118891829):', condition1);
//                            console.log('Condition 2 (byteAtA1Plus5 != 8):', condition2);
//                            console.log('Condition 3 (a1 + 704 != qwordAtA1Plus600):', condition3);
//
//                        } catch(e) {
//                            console.error('Error in onEnter:', e);
//                        }
//                    },
//                    onLeave: function (retval) {
//                        console.log('OCIServerAttach retval');
//                    }
//                });
//            }
//        } else {
////            logMessage('GetProcAddress called with libName:', libName, 'function name:', funcName);
//        }
//    },
//    onLeave: function (retval) {
//
//    }
//});


//int WSASend(
//  _In_  SOCKET                             s,
//  _In_  LPWSABUF                           lpBuffers,
//  _In_  DWORD                              dwBufferCount,
//  _Out_ LPDWORD                            lpNumberOfBytesSent,
//  _In_  DWORD                              dwFlags,
//  _In_  LPWSAOVERLAPPED                    lpOverlapped,
//  _In_  LPWSAOVERLAPPED_COMPLETION_ROUTINE lpCompletionRoutine

Interceptor.attach(Module.getExportByName(null, 'WSASend'), {
    onEnter: function (args) {
       console.log("WSASend")
       try{

            console.log('s: ', args[0]);
            console.log('lpBuffers: ', args[1]);
            console.log('dwBufferCount: ', args[2]);
            console.log('lpNumberOfBytesSent: ', args[3]);
            console.log('dwFlags: ', args[4]);
            console.log('lpOverlapped: ', args[5]);
            console.log('lpCompletionRoutine: ', args[6]);


            console.log(hexdump(ptr(args[1]), {
                    length: 16,
                    header: true,
                    ansi: true
                }))
            var lpBuffers = args[1];
            var buff_len = lpBuffers.readULong();
            var buff_data = lpBuffers.add(Process.pointerSize).readPointer();

            // 0000000000145960  0E 01 00 00 00 00 00 00  26 C8 AC 00 00 00 00 00
            // buff.len = 270
            // buff.data = 0xACC826

            console.log('buff_len:', buff_len);
            console.log(hexdump(ptr(buff_data), {
                    length: buff_len,
                    header: true,
                    ansi: true
                }))
       }catch(e){
            console.error('Error in onEnter:', e);
       }
    }
});
//
//
//int WSAAPI WSARecv(
//  [in]      SOCKET                             s,
//  [in, out] LPWSABUF                           lpBuffers,
//  [in]      DWORD                              dwBufferCount,
//  [out]     LPDWORD                            lpNumberOfBytesRecvd,
//  [in, out] LPDWORD                            lpFlags,
//  [in]      LPWSAOVERLAPPED                    lpOverlapped,
//  [in]      LPWSAOVERLAPPED_COMPLETION_ROUTINE lpCompletionRoutine
//);
Interceptor.attach(Module.getExportByName(null, 'WSARecv'), {
    onEnter: function (args) {
        console.log("WSARecv");
        try {
            console.log('s: ', args[0]);
            console.log('lpBuffers: ', args[1]);
            console.log('dwBufferCount: ', args[2]);
            console.log('lpNumberOfBytesRecvd: ', args[3]);
            console.log('dwFlags: ', args[4]);
            console.log('lpOverlapped: ', args[5]);
            console.log('lpCompletionRoutine: ', args[6]);

            this.lpNumberOfBytesRecvd = args[3]
            // ptr(args[1]
            this.lpBuffers = args[1];
            console.log(hexdump(ptr(args[1]), {
                    length: 16,
                    header: true,
                    ansi: true
                }))


        } catch (e) {
            console.error('Error in onEnter:', e);
        }
    },
    onLeave: function (retval) {
        console.log("WSARecv - onLeave");
        try {
           console.log('retval:', retval);
           var buff_len = ptr(this.lpNumberOfBytesRecvd).readInt()
           var buff_data = this.lpBuffers.add(Process.pointerSize).readPointer();
           console.log('buff_len:', buff_len);
           console.log(hexdump(ptr(buff_data), {
                    length: buff_len,
                    header: true,
                    ansi: true
               }))

        } catch (e) {
            console.error('Error in onLeave:', e);
        }
    }
});

// user_dev/123456@127.0.0.1:1521/xe1