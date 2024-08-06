var className = "NSURL";
var funcName = "+ URLWithString:";
var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');
Interceptor.attach(hook.implementation, {
    onLeave: function(retval) {

        console.log("[*] Class Name: " + className);
        console.log("[*] Method Name: " + funcName);
        console.log("\t[-] Type of return value: " + typeof retval);
        console.log("\t[-] Original Return Value: " + retval);
    },

    onEnter: function(args){

        var className = ObjC.Object(args[0]);
        var methodName = args[1];
        var urlString = ObjC.Object(args[2]);

        console.log("className: " + className.toString());
        console.log("methodName: " + methodName.readUtf8String());
        console.log("urlString: " + urlString.toString());
        console.log("-----------------------------------------");

        urlString = ObjC.classes.NSString.stringWithString_("http://www.baidu.com")
        console.log("newUrlString: " + urlString.toString());
        console.log("-----------------------------------------");

    }
});


// oc 修改方法的入参
onEnter(log, args, state) {
    var self = new ObjC.Object(args[0]);  // 当前对象
    var method = args[1].readUtf8String();  // 当前方法名
    log(`[${self.$className} ${method}]`);
    // 字符串
    // var str = ObjC.classes.NSString.stringWithString_("hi wit!")  // 对应的oc语法：NSString *str = [NSString stringWithString:@"hi with!"];
    // args[2] = str  // 修改入参为字符串
    // 数组
    // var array = ObjC.classes.NSMutableArray.array();  // 对应的oc语法：NSMutableArray array = [NSMutablearray array];
    // array.addObject_("item1");  // 对应的oc语法：[array addObject:@"item1"];
    // array.addObject_("item2");  // 对应的oc语法：[array addObject:@"item2"];
    // args[2] = array; // 修改入参为数组
    // 字典
    // var dictionary = ObjC.classes.NSMutableDictionary.dictionary(); // 对应的oc语法:NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
    // dictionary.setObject_forKey_("value1", "key1"); // 对应的oc语法：[dictionary setObject:@"value1" forKey:@"key1"]
    // dictionary.setObject_forKey_("value2", "key2"); // 对应的oc语法：[dictionary setObject:@"value2" forKey:@"key2"]
    // args[2] = dictionary; // 修改入参为字典
    // 字节
    var data = ObjC.classes.NSMutableData.data(); // 对应的oc语法：NSMutableData *data = [NSMutableData data];
    var str = ObjC.classes.NSString.stringWithString_("hi wit!")  // 获取一个字符串。 对应的oc语法：NSString *str = [NSString stringWithString:@"hi with!"];
    var subData = str.dataUsingEncoding_(4);  // 将str转换为data,编码为utf-8。对应的oc语法：NSData *subData = [str dataUsingEncoding:NSUTF8StringEncoding];
    data.appendData_(subData);  // 将subData添加到data。对应的oc语法：[data appendData:subData];
    args[2] = data; // 修改入参字段
    // 更多数据类型：https://developer.apple.com/documentation/foundation
},

// 修改 oc 方法的返回值
{
  onEnter(log, args, state) {
  },
  onLeave(log, retval, state) {
    // 字符串
    var str = ObjC.classes.NSString.stringWithString_("hi wit!")  // 对应的oc语法：NSString *str = [NSString stringWithString:@"hi with!"];
    retval.replace(str)  // 修改返回值
    var after = new ObjC.Object(retval); // 打印出来是个指针时，请用该方式转换后再打印
    log(`before:=${retval}=`);
    log(`after:=${after}=`);
  }
}

// 打印字符串、数组、字典
{
  onEnter(log, args, state) {
    var self = new ObjC.Object(args[0]);  // 当前对象
    var method = args[1].readUtf8String();  // 当前方法名
    log(`[${self.$className} ${method}]`);
    var before = args[2];
    // 注意，日志输出请直接使用log函数。不要使用console.log()
    var after = new ObjC.Object(args[2]); // 打印出来是个指针时，请用该方式转换后再打印
    log(`before:=${before}=`);
    log(`after:=${after}=`);
  },
  onLeave(log, retval, state) {
  }
}

// 打印NSData
{
  onEnter(log, args, state) {
    var self = new ObjC.Object(args[0]);  // 当前对象
    var method = args[1].readUtf8String();  // 当前方法名
    log(`[${self.$className} ${method}]`);
    var before = args[2];
    // 注意，日志输出请直接使用log函数。不要使用console.log()
    var after = new ObjC.Object(args[2]); // 打印NSData
    var outValue = after.bytes().readUtf8String(after.length()) // 将data转换为string
    log(`before:=${before}=`);
    log(`after:=${outValue}=`);
  },
  onLeave(log, retval, state) {
  }
}

// 打印对象的所有属性和方法
{
  onEnter(log, args, state) {
    var self = new ObjC.Object(args[0]);  // 当前对象
    var method = args[1].readUtf8String();  // 当前方法名
    log(`[${self.$className} ${method}]`);
    var customObj = new ObjC.Object(args[2]); // 自定义对象
    // 打印该对象所有属性
    var ivarList = customObj.$ivars;
    for (key in ivarList) {
       log(`key${key}=${ivarList[key]}=`);
    }
    // 打印该对象所有方法
    var methodList = customObj.$methods;
    for (var i=0; i<methodList.length; i++) {
       log(`method=${methodList[i]}=`);
    }
  },
  onLeave(log, retval, state) {
  }
}

// 打印调用栈
{
  onEnter(log, args, state) {
    var url = new ObjC.Object(args[2]);
    log(`+[NSURL URLWithString:${url}]`);
    log('NSURL URLWithString: called from:\n' +
        Thread.backtrace(this.context, Backtracer.ACCURATE)
        .map(DebugSymbol.fromAddress).join('\n') + '\n');
  },
  onLeave(log, retval, state) {
  }
}