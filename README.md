## frida + python3 hook demo

```shell
doc : https://frida.re/docs/examples/macos/
pip3 install frida-tools
pip3 install thop
```

### 0x0: 准备

写一段c程序, 写一个 printOneOneZero 函数, 返回 110,   
并且导出 extern "C"
编译 运行

### 0x1: 获取进程 ID

```shell
frida-ps | grep Table  
4105  Table
```

### 0x2: 找到要 hook 的函数 printOneOneZero

```shell

# 设备相关
# -D 连接到指定的设备，多个设备时使用。示例:frida-trace -D 555315d66cac2d5849408f53da9eea514a90547e -F
# -U 连接到USB设备，只有一个设备时使用。示例fria-trace -U -F
# -m 对Object-C的方法进行追踪（你也可以叫Hook），后面可以跟各种模糊匹配等等
# -i 对C函数进行追踪
# -f 表示启动某个进程（后面跟着应用的bundleId）
# -d, --decorate       将模块名称添加到生成的onEnter

# 在 Frida 的过滤条件中，-、+ 和 * 符号分别代表以下含义:
# 
# -: 代表实例方法（Instance method）。
#   在 Objective-C 中，实例方法是属于类的实例的方法。在此例中，-[NSNumber foo:bar:] 代表类 NSNumber 的实例方法 foo:bar:。
# +: 代表类方法（Class method）。
#   类方法是直接属于类本身的方法，不需要创建类的实例即可调用。在此例中，+[Foo foo] 代表类 Foo 的类方法 foo。
# *: 代表通配符，匹配任意方法。
#   在此例中，*[Bar baz] 将匹配类 Bar 的任意方法，无论是实例方法还是类方法，只要方法名为 baz。

# 因此，整个过滤条件 - [NSNumber foo:bar:], +[Foo foo] or *[Bar baz] 表示匹配以下方法：
# - 类 NSNumber 的实例方法 foo:bar:
# - 类 Foo 的类方法 foo
# - 类 Bar 的任意方法（实例方法或类方法）baz

frida-trace -i printOneOneZero -p 11986
frida-trace --decorate -i "*OneOne*" main
frida-trace -f "./main" --decorate -i "*OneOne*"

# 遍历所有 module : python3 enumerate_modules.py 
# 遍历所有 class : frida-trace -p 11986 -S ./enumerate_classes.js 
# Trace ObjC method calls 
frida-trace -m "-[NSView drawRect:]" Safari
frida-trace -m "-[NSObject leng*]" main
frida-trace -m "-[TablePlus.RegisterWindow activateLicense:]" TablePlus

# hook所有Ocject-C包含FreeTrial关键字的方法
#frida-trace -m "[ activateLicense]" TablePlus
#frida-trace -m "[* activateLicense]" TablePlus
# Hook Object类APNSubscriptionsManager下的所有方法
#frida-trace -m "*[APNSubscriptionsManager *]" main

# Hook 某个动态库
frida-trace -I "libcommonCrypto*" main

## https://www.exchen.net/frida-ios-interceptor.html
# Hook get或post的接口地址 , 热启动/冷启动
frida-trace  -m "+[NSURL URLWithString:]" Raycast   
frida-trace -f "/Applications/DevUtils.app/Contents/MacOS/DevUtils" -m "+[NSURL URLWithString:]"    
# Hook request body
frida-trace -m "-[NSURLRequest setHTTPBody:]" -m "-[NSMutableURLRequest setHTTPBody:]" devutils
# 打印对象信息 https://www.yuucn.com/a/1512152.html , https://blog.csdn.net/tslx1020/article/details/128250777

# sub_xxxx 函数参考 https://www.exchen.net/frida-interceptor-sub_xxxx.html

# frida hook常用函数分享
# https://www.52pojie.cn/forum.php?mod=viewthread&tid=1196917&highlight=frida
# https://www.52pojie.cn/forum.php?mod=viewthread&tid=931872&highlight=frida

```

### 0x3: 编写hook 脚本
```javascript

// 获取被hook的函数指针
var func_ptr = Module.findExportByName(null, 'printOneOneZero');

if (func_ptr !== null) {
    // hook函数
    Interceptor.attach(func_ptr, {
        // 函数入口
        onEnter: function (args) {
            if (args[0].isNull()) {
                console.log("[>>] onEnter args is null");
                return;
            }
            // send 给 python3 回掉信息
            send(args[0])
            console.log("\t[>>] Type of args value: " + typeof args);
            // var argStr = args[0].readUtf8String();
            var argTostring = args[0].toString();
            console.log("\t[>>] Original args Value: " + argTostring);

        },
        // 函数出口
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
```
### 0x4: hook

- 基于 JS hook: 
```shell
frida-trace -p 11986 -S ./hook.js
```  
 
- 基于 python+js hook
```shell
python3 hook.py
```


### Doc


