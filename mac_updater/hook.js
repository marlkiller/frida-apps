if (ObjC.available) {
    var targetClass = "NSURL";
    var targetMethod = "+ URLWithHost:path:query:user:password:fragment:scheme:port:";

    var hook = ObjC.classes[targetClass][targetMethod];

    Interceptor.attach(hook.implementation, {
        onEnter: function(args) {
            console.log("Hooked URLWithHost:path:query:user:password:fragment:scheme:port:");

            // 访问并打印参数（例如，第一个参数 args[2] 是 host）
            console.log("Host: " + ObjC.Object(args[2]));
            console.log("Path: " + ObjC.Object(args[3]));
            console.log("Query: " + ObjC.Object(args[4]));
            console.log("User: " + ObjC.Object(args[5]));
            console.log("Password: " + ObjC.Object(args[6]));
            console.log("Fragment: " + ObjC.Object(args[7]));
            console.log("Scheme: " + ObjC.Object(args[8]));
            console.log("Port: " + args[9].toInt32());

            // 可以在此处修改参数，例如替换 host
            // var newHost = ObjC.classes.NSString.stringWithString_("new-host.com");
            // args[2] = newHost;
        },
        onLeave: function(retval) {
            console.log("Original NSURL: " + ObjC.Object(retval));

            // 修改返回值
            // var newURL = ObjC.classes.NSURL.URLWithString_("https://new-host.com/new-path");
            // retval.replace(newURL);
        }
    });
} else {
    console.log("Objective-C runtime is not available!");
}
