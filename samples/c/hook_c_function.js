// frida-trace -p 11986 -S ./hook.js

// 获取被hook的函数指针
var func_ptr = Module.findExportByName(null, 'printOneOneZero');

if (func_ptr !== null) {
    // hook函数
    Interceptor.attach(func_ptr, {
        onEnter: function (args) {

            if (args[0].isNull()) {
                console.log("[>>] onEnter args is null");
                return;
            }
            send(args[0])
            console.log("\t[>>] Type of args value: " + typeof args);
            // var argStr = args[0].readUtf8String();
            var argTostring = args[0].toString();
            console.log("\t[>>] Original args Value: " + argTostring);

        },
        onLeave: function (retval) {
            send(retval)
            console.log("\t[<<] Type of return value: " + typeof retval);
            console.log("\t[<<] Original Return Value: " + retval);
            retval.replace(0);  //将返回值替换成0
            console.log("\t[<<] New Return Value: " + retval);
        },
    });
} else {
    console.log("[*] Function not found");
}