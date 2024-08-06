Java.perform(function () {
    // 遍历方法
    Java.use('类名').class.getDeclaredMethods().forEach(function (method) {
      var methodName = method.toString();
      console.log("method name = " + methodName);
      try {
        // .. hook here
      } catch (e) {
        console.error(methodName, e);
      }
    });


    // 修改返回值
    var Adconfig = Java.use('com.bytedance.sdk.openadsdk.TTAdConfig');
    Adconfig.getAppId.implementation = function(){
        return 0
    }
});

// others
https://www.52pojie.cn/forum.php?mod=viewthread&tid=1196917&highlight=frida
https://www.52pojie.cn/forum.php?mod=viewthread&tid=931872&highlight=frida