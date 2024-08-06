## frida + python3 hook demo

> https://codeshare.frida.re/browse

```shell
doc : https://frida.re/docs/examples/macos/
pip3 install frida-tools
pip3 install thop
```

### 0x0: 准备


### 0x1: 获取进程 ID

```shell
frida-ps | grep Table  
4105  Table
```

### 0x2: 找到要 hook 的函数

```shell

# 设备相关
# -D 连接到指定的设备，多个设备时使用。示例:frida-trace -D 555315d66cac2d5849408f53da9eea514a90547e -F
# -U 连接到USB设备，只有一个设备时使用。示例 fria-trace -U -F

# -m 对 Object-C 的方法进行追踪（你也可以叫 Hook ），后面可以跟各种模糊匹配等等
frida-trace -m "-[NSView drawRect:]" Safari
# -i 对 C 函数进行追踪
frida-trace -i printOneOneZero -p 11986
# -f 表示启动某个进程（后面跟着应用的 bundleId）
frida-trace -f "/Applications/DevUtils.app/Contents/MacOS/DevUtils" -m "+[NSURL URLWithString:]"    

# -d, --decorate       将模块名称添加到生成的 onEnter

# 遍历所有 module : python3 enumerate_modules.py 
# 遍历所有 oc class : frida-trace -p 11986 -S ./oc_enumerate_classes.js 


# Hook 某个动态库
frida-trace -I "libcommonCrypto*" main

## https://www.exchen.net/frida-ios-interceptor.html
# 热启动/冷启动
frida-trace -m "+[NSURL URLWithString:]" Raycast   
frida-trace -f "/Applications/DevUtils.app/Contents/MacOS/DevUtils" -m "+[NSURL URLWithString:]"    
# hook 多个方法
frida-trace -m "-[NSURLRequest setHTTPBody:]" -m "-[NSMutableURLRequest setHTTPBody:]" devutils

```

### 0x3: hook

- 基于 JS hook: 
```shell
frida-trace -p 11986 -S ./hook.js
```  
 
- 基于 python+js hook
```shell
python3 hook.py
```



