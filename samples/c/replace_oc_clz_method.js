var method = ObjC.classes.NSURL['+ URLWithString:'];
var origImp = method.implementation;
method.implementation = ObjC.implement(method, function  (self, sel, url){

      var url_str = ObjC.Object(url).toString()

     if (url_str.indexOf("mac/v3/init") != -1) {
        // >>> : https://www.surge-activation.com/mac/v3/init/
        // >>> : https://13.248.139.174/mac/v3/init/
        console.log("阻止url: " + url_str);
        var newUrl = ObjC.classes.NSString.stringWithString_("http://127.0.0.1:8080/123");
        return origImp(self, sel, newUrl);
      }
      // console.log(">>> : " + url_str);
      // 调用原方法，如果不调用则原方法得不到执行
      return origImp(self, sel, url);
});