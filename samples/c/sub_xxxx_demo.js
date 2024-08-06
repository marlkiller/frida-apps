//此函数在module模块中寻找地址为 offset 的sub_xxx
function get_func_addr(module, offset) {
   var base_addr = Module.findBaseAddress(module);
   // console.log("base_addr: " + base_addr);
   // console.log(hexdump(ptr(base_addr), {
   //          length: 16,
   //          header: true,
   //          ansi: true
   //      }))
   var func_addr = base_addr.add(offset);
   if (Process.arch == 'arm')
      return func_addr.add(1);  //如果是32位地址+1
   else
      return func_addr;
}


var func_addr = get_func_addr('CrackMe', 0x6684);
Interceptor.attach(ptr(func_addr), {
   onEnter: function(args) {
      console.log("onEnter");
      var num1 = args[0];
      var num2 = args[1];

      console.log("num1: " + num1);
      console.log("num2: " + num2);
   },
   onLeave: function(retval) {
      console.log("onLeave");
      retval.replace(3);  //返回值替换成3
   }
});