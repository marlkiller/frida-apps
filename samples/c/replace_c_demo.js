// 替换abcKit.dylib模块中，hopper中的地址为0xeba6c处的sub_xxx函数
var func_addr_replace_eba6c = get_func_addr('abcKit.dylib', 0xeba6c);
var add_replace_eba6c = new NativeFunction(func_addr_replace_eba6c, 'void', []);
// 进行替换
Interceptor.replace(add_replace_eba6c, new NativeCallback(function() {
    console.log('替换eba6c函数');
}, 'void', []));


//拦截open函数
var openPtr = Module.getExportByName(null, 'open');
var open = new NativeFunction(openPtr, 'int', ['pointer', 'int']);
Interceptor.replace(openPtr, new NativeCallback(function (pathPtr, flags) {
  var path = pathPtr.readUtf8String();
  console.log('Opening "' + path + '"');
  var fd = open(pathPtr, flags);
  console.log('Got fd: ' + fd);
  return fd;
}, 'int', ['pointer', 'int']));

//拦截exit函数
var openPtr = Module.getExportByName(null, 'exit');
  var open = new NativeFunction(openPtr, 'void', ['int']);
  Interceptor.replace(openPtr, new NativeCallback(function (flags) {
    console.log('Got fd: ');
  }, 'void', ['int']));