Interceptor.attach(Module.findExportByName(null, 'LoadLibraryA'), {
    onEnter: function (args) {
        // args[0] is the first argument to LoadLibraryA, which is the library name
        this.libName = Memory.readUtf8String(args[0]);
        console.log('LoadLibraryA called with:', this.libName);
    },
    onLeave: function (retval) {
        // Optionally modify the return value if needed
    }
});

Interceptor.attach(Module.findExportByName(null, 'GetProcAddress'), {
    onEnter: function (args) {
        // args[0] is the handle to the library obtained from LoadLibraryA
        // args[1] is the name of the function to get the address of
        var libHandle = args[0];
        var funcName = Memory.readUtf8String(args[1]);
        console.log('GetProcAddress called with handle:', libHandle, 'and function name:', funcName);
    },
    onLeave: function (retval) {
        // Optionally modify the return value if needed
    }
});
