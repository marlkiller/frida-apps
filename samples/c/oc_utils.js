// NSString to String
onEnter: function (log, args, state) {
    log("+[NSURL URLWithString:" + args[2] + "]");
    var objcHttpUrl = ObjC.Object(args[2]);  //获取 Objective-C 对象 NSString
    var strHttpUrl = objcHttpUrl.UTF8String();
    log("httpURL: " + strHttpUrl);
},


// NSData to String
// 调用 NSData 的 bytes 函数得到内存地址，然后再调用 readUtf8String 读取内存中的数据，即可得到字符串
onEnter: function (log, args, state) {
    log("-[NSMutableURLRequest setHTTPBody:" + args[2] + "]");
    var objcData = ObjC.Object(args[2]);  //NSData
    var strBody = objcData.bytes().readUtf8String(objcData.length()); //NSData 转换成 string
    log("HTTPBody: " + strBody);
},

// 遍历 NSDictionary 的代码如下：
var dict = new ObjC.Object(args[2]);
var enumerator = dict.keyEnumerator();
var key;
while ((key = enumerator.nextObject()) !== null) {
  var value = dict.objectForKey_(key);
}


// 遍历 NSArray 的代码如下：
var array = new ObjC.Object(args[2]);
var count = array.count().valueOf();
for (var i = 0; i !== count; i++) {
  var element = array.objectAtIndex_(i);
}
