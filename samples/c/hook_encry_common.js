 // frida-trace -UF -i “CC_MD5”

 {
  onEnter(log, args, state) {
    this.args0 = args[0];   // 入参
    this.args2 = args[2];   // 返回值指针
  },
  onLeave(log, retval, state) {
    var ByteArray = Memory.readByteArray(this.args2, 16);
    var uint8Array = new Uint8Array(ByteArray);
    var str = "";
    for(var i = 0; i < uint8Array.length; i++) {
        var hextemp = (uint8Array[i].toString(16))
        if(hextemp.length == 1){
            hextemp = "0" + hextemp
        }
        str += hextemp;
    }
    log(`CC_MD5(${this.args0.readUtf8String()})`);      // 入参
    log(`CC_MD5()=${str}=`);    // 返回值
  }
}

// Base64 编码
// frida-trace -UF -m “-[NSData base64EncodedStringWithOptions:]”
{
  onEnter(log, args, state) {
    this.self = args[0];
  },
  onLeave(log, retval, state) {
    var before = ObjC.classes.NSString.alloc().initWithData_encoding_(this.self, 4);
    var after = new ObjC.Object(retval);
    log(`-[NSData base64EncodedStringWithOptions:]before=${before}=`);
    log(`-[NSData base64EncodedStringWithOptions:]after=${after}=`);
  }
}

// Base64解码
// frida-trace -UF -m “-[NSData initWithBase64EncodedData:options:]” -m “-[NSData initWithBase64EncodedString:options:]”
// initWithBase64EncodedData:options:方法对应的js代码如下：
{
  onEnter(log, args, state) {
    this.arg2 = args[2];
  },
  onLeave(log, retval, state) {
    var before = ObjC.classes.NSString.alloc().initWithData_encoding_(this.arg2, 4);
    var after = ObjC.classes.NSString.alloc().initWithData_encoding_(retval, 4);
    log(`-[NSData initWithBase64EncodedData:]before=${before}=`);
    log(`-[NSData initWithBase64EncodedData:]after=${after}=`);
  }
}
// initWithBase64EncodedString:options:方法对应的js代码如下：
{
  onEnter(log, args, state) {
    this.arg2 = args[2];
  },
  onLeave(log, retval, state) {
    var before = new ObjC.Object(this.arg2);
    var after = ObjC.classes.NSString.alloc().initWithData_encoding_(retval, 4);
    log(`-[NSData initWithBase64EncodedString:]before=${before}=`);
    log(`-[NSData initWithBase64EncodedString:]after=${after}=`);
  }
}


// 加密函数AES、DES、3DES
// frida-trace -UF -i CCCrypt
{
    onEnter: function(log, args, state) {
        this.op = args[0]
        this.alg = args[1]
        this.options = args[2]
        this.key = args[3]
        this.keyLength = args[4]
        this.iv = args[5]
        this.dataIn = args[6]
        this.dataInLength = args[7]
        this.dataOut = args[8]
        this.dataOutAvailable = args[9]
        this.dataOutMoved = args[10]
        log('CCCrypt(' +
            'op: ' + this.op + '[0:加密,1:解密]' + ', ' +
            'alg: ' + this.alg + '[0:AES128,1:DES,2:3DES]' + ', ' +
            'options: ' + this.options + '[1:ECB,2:CBC,3:CFB]' + ', ' +
            'key: ' + this.key + ', ' +
            'keyLength: ' + this.keyLength + ', ' +
            'iv: ' + this.iv + ', ' +
            'dataIn: ' + this.dataIn + ', ' +
            'inLength: ' + this.inLength + ', ' +
            'dataOut: ' + this.dataOut + ', ' +
            'dataOutAvailable: ' + this.dataOutAvailable + ', ' +
            'dataOutMoved: ' + this.dataOutMoved + ')')
        if (this.op == 0) {
            log("dataIn:")
            log(hexdump(ptr(this.dataIn), {
                length: this.dataInLength.toInt32(),
                header: true,
                ansi: true
            }))
            log("key: ")
            log(hexdump(ptr(this.key), {
                length: this.keyLength.toInt32(),
                header: true,
                ansi: true
            }))
            log("iv: ")
            log(hexdump(ptr(this.iv), {
                length: this.keyLength.toInt32(),
                header: true,
                ansi: true
            }))
        }
    },
    onLeave: function(log, retval, state) {
        if (this.op == 1) {
            log("dataOut:")
            log(hexdump(ptr(this.dataOut), {
                length: Memory.readUInt(this.dataOutMoved),
                header: true,
                ansi: true
            }))
            log("key: ")
            log(hexdump(ptr(this.key), {
                length: this.keyLength.toInt32(),
                header: true,
                ansi: true
            }))
            log("iv: ")
            log(hexdump(ptr(this.iv), {
                length: this.keyLength.toInt32(),
                header: true,
                ansi: true
            }))
        } else {
            log("dataOut:")
            log(hexdump(ptr(this.dataOut), {
                length: Memory.readUInt(this.dataOutMoved),
                header: true,
                ansi: true
            }))
        }
        log("CCCrypt did finish")
    }
}

// RSA
// frida-trace -UF -i “SecKeyEncrypt” -i “SecKeyRawSign”
// SecKeyEncrypt公钥加密函数对应的js代码如下：
{
  onEnter(log, args, state) {
    // 由于同一条加密信息可能会多次调用该函数，故在这输出该函数的调用栈。可根据栈信息去分析上层函数
    log(`SecKeyEncrypt()=${args[2].readCString()}=`);
    log('SecKeyEncrypt called from:\n' +
        Thread.backtrace(this.context, Backtracer.ACCURATE)
        .map(DebugSymbol.fromAddress).join('\n') + '\n');
  },
  onLeave(log, retval, state) {
  }
}
// SecKeyRawSign私钥加密函数对应的js代码如下：
{
  onEnter(log, args, state) {
    log(`SecKeyRawSign()=${args[2].readCString()}=`);
    log('SecKeyRawSign called from:\n' +
        Thread.backtrace(this.context, Backtracer.ACCURATE)
        .map(DebugSymbol.fromAddress).join('\n') + '\n');
  },
  onLeave(log, retval, state) {
  }
}



