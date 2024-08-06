// frida-trace -UF -m “+[NSURL URLWithString:]” -o run.log
// file log
// 有时候被拦截的函数调用的次数较多，打印的信息也会较多，我们需要保存成文件，方便以后慢慢查看
var file = new File("/var/mobile/log.txt","a+");// a+表示追加内容，和c语言的 fopen 函数模式类似
file.write("logInfo");
file.flush();
file.close();

// 特征码搜索
var process_Obj_Module_Arr = Process.enumerateModules();
for(var i = 0; i < process_Obj_Module_Arr.length; i++) {
    //包含 "Surge" 字符串的
    if(process_Obj_Module_Arr[i].name==="Surge")
    {
          console.log("模块名称:",process_Obj_Module_Arr[i].name);
          console.log("模块地址:",process_Obj_Module_Arr[i].base);
          console.log("大小:",process_Obj_Module_Arr[i].size);
          console.log("文件系统路径",process_Obj_Module_Arr[i].path);


          // Print its properties:
          console.log(JSON.stringify(process_Obj_Module_Arr[i]));

          // Dump it from its base address:
          // console.log(hexdump(process_Obj_Module_Arr[i].base));

          // The pattern that you are interested in:
          // 55 48 89 E5 8B 05 E4 B3 68 00 5D C3
          // var pattern = '08 c6 8f e2 ?? ca 8c e2';
          var pattern = '55 48 89 E5 8B 05 E4 B3 68 00 5D C3';

          Memory.scan(process_Obj_Module_Arr[i].base, process_Obj_Module_Arr[i].size, pattern, {
            onMatch: function (address, size) {
              console.log('Memory.scan() found match at', address,
                  'with size', size);
              // Optionally stop scanning early:
              // address - process_Obj_Module_Arr[i].base = local offset
              return 'stop';
            },
            onComplete: function () {
              console.log('Memory.scan() complete');
            }
          });
    }
 }



 // 内存分配 Memory.alloc

const r = Memory.alloc(10);
console.log(hexdump(r, {
    offset: 0,
    length: 10,
    header: true,
    ansi: false
}));

// 分配utf字符串
var string = Memory.allocUtf8String(str) //  retval.replace(string); //替换
// 分配utf16字符串
Memory.allocUtf16String
// 分配ansi字符串
Memory.allocAnsiString

// 内存复制Memory.copy
const r = Memory.alloc(10);
// 复制以module.base地址开始的10个字节 那肯定会是7F 45 4C 46...因为一个ELF文件的Magic属性如此。
Memory.copy(r,process_Obj_Module_Arr[0].base,10);
console.log(hexdump(r, {
    offset: 0,
    length: 10,
    header: true,
    ansi: false
}));

//读取基址并加上偏移，就是该字符串在内存中的地址
var soAddr = Module.findBaseAddress("Surge");
// 0x10083dea8
// dword_10083dea8
var passwordAddr = soAddr.add(0x83DEA8);
//菜鸡的我想要一步一步的观察内存中的值
console.log(hexdump(passwordAddr, {
    offset: 0,
    length: 64,
    header: true,
    ansi: true,
}));

var buffer = Memory.readByteArray(passwordAddr, 16);
console.log("Memory.readByteArray:",buffer);

// 写入内存 Memory.writeByteArray
var arr = [ 0x2];
Memory.writeByteArray(passwordAddr,arr);

var buffer_new = Memory.readByteArray(passwordAddr, 16);
console.log("Memory.readByteArray:",buffer_new);


// 更多数据类型
/**
 * Converts to a signed 32-bit integer.
 */
  toInt32(): number;
  /**
  * Converts to an unsigned 32-bit integer.
  */
  toUInt32(): number;
  /**
  * Converts to a “0x”-prefixed hexadecimal string, unless a `radix`
  * is specified.
  */
  toString(radix?: number): string;
  /**
  * Converts to a JSON-serializable value. Same as `toString()`.
  */
  toJSON(): string;
  /**
  * Returns a string containing a `Memory#scan()`-compatible match pattern for this pointer’s raw value.
  */
  toMatchPattern(): string;
  readPointer(): NativePointer;
  readS8(): number;
  readU8(): number;
  readS16(): number;
  readU16(): number;
  readS32(): number;
  readU32(): number;
  readS64(): Int64;
  readU64(): UInt64;
  readShort(): number;
  readUShort(): number;
  readInt(): number;
  readUInt(): number;
  readLong(): number | Int64;
  readULong(): number | UInt64;
  readFloat(): number;
  readDouble(): number;
  readByteArray(length: number): ArrayBuffer | null;
  readCString(size?: number): string | null;
  readUtf8String(size?: number): string | null;
  readUtf16String(length?: number): string | null;