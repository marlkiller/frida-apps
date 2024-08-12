function logMessage(message) {
//    console.log(message);
     var file = new File("frida_out.log","a+");//a+表示追加内容，此处的模式和c语言的fopen函数模式相同
     file.write(message + "\n");
     file.flush()
     file.close();
}

// 用于存储库句柄和库名的映射
var libraryMap = {};

// 拦截 LoadLibraryA 函数
Interceptor.attach(Module.findExportByName(null, 'LoadLibraryA'), {
    onEnter: function (args) {
        this.libName = Memory.readUtf8String(args[0]);
    },
    onLeave: function (retval) {
        // 将加载的库名与库句柄关联
        if (retval.toInt32() !== 0) {
            libraryMap[retval.toString()] = this.libName;
//            logMessage('LoadLibraryA called with:' + this.libName);
            logMessage('LoadLibraryA called with:' + this.libName);
        }
    }
});

// 拦截 GetProcAddress 函数
Interceptor.attach(Module.findExportByName(null, 'GetProcAddress'), {
    onEnter: function (args) {
        var libHandle = args[0].toString();
        var funcName = Memory.readUtf8String(args[1]);

        // 从库句柄获取库名
        var libName = libraryMap[libHandle];

        if (funcName.startsWith("OCI")) {
            logMessage('Filtered GetProcAddress call: libName:'+ libName +  ', function name:' + funcName);
            this.filtered = true;
        } else {
//            logMessage('GetProcAddress called with libName:', libName, 'function name:', funcName);
        }
    },
    onLeave: function (retval) {

    }
});
