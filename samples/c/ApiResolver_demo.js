
// ApiResolver API 查找器支持对 Objective-C 方法和 C 函数的查找
// - 如果查找 Objective-C，ApiResolver 参数中填写 objc，
// - 如果是查找 C 函数，ApiResolver 参数中填写 module，然后调用 enumerateMatches 枚举函数，
// format is: exports:*!open*, exports:libc.so!* or imports:notepad.exe!*
var resolver = new ApiResolver('module');
resolver.enumerateMatches('exports:*!fopen*', {
    onMatch: function(match) {

         var name = match['name'];
         var address = match['address'];
         console.log(name + ":" + address);

    },
    onComplete: function() {}
});


// 每次枚举到一个函数会调用一次 onMatch，回调参数 match 包含 name 和 address 两个属性，分别代表名称和地址。
// 整个枚举过程完成之后会调用 onComplete
console.log("ApiResolver Started");
var resolver = new ApiResolver('objc');
//objc为要过滤的类
resolver.enumerateMatches('+[NSURL *URLWithString*]', {
   onMatch: function(match) {
      var method = match['name'];
      var implementation = match['address'];
      console.log("method_name = " + method);
      // 过滤需要拦截的方法 URLWithString
      if ((method.indexOf("+[NSURL URLWithString:]") != -1)) {

         console.log("hooked : " + match['name'] + " " + match['address']);
         try {
            Interceptor.attach(implementation, {
               onEnter: function(args) {
                  //参数打印
                  var className = ObjC.Object(args[0]);
                  var methodName = args[1];
                  var arg_info = ObjC.Object(args[2]);

                  console.log("className: " + className.toString());
                  console.log("methodName: " + methodName.readUtf8String());
                  console.log("arg_info: " + arg_info.toString());
                  send(args)

               },
               onLeave: function(retval) {

               }
            });
         } catch (err) {
            console.log("[!] Exception: " + err.message);
         }
      }

   },
   onComplete: function() {
   }
});