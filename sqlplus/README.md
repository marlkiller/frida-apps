
## 开始
```
### 跟踪模式
# frida-trace -i '*send*' -f "C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\sqlplus.exe"

### 附加脚本
# frida -f "C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\sqlplus.exe"  -l hook.js
```



## 这里会根据不同的 rdx 来走不同的 oci 请求

```
    sub_451884
    switch a2 = rdx
    case 7:
      // connect | auth | login
      PieceInfo = OCIServerAttach(
                    *(_QWORD *)(a2 + 8),
                    *(_QWORD *)(a2 + 32),
                    *(_QWORD *)(a2 + 40),
                    *(unsigned int *)(a2 + 48),
                    *(_DWORD *)(a2 + 52));
      break;
    case xx:
    xxx

```


## Login & Auth
```
# user_dev/123456@127.0.0.1:1521/xe1
# select * from all_users;

C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\OCI.dll	0000000010000000	0000000000088000

OCI.dll:00000000100032F0 call    OCIServerAttach ; kernel32_GetProcAddress

C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\OraOCIEI10.dll	0000000002620000	0000000005A9D000

OraOCIEI10.dll:0000000002B63B5C oraociei10_OCIServerAttach:



    v12 = connect(a1, (const struct sockaddr *)a2, a3);

    Buffers.len = a3;
    Buffers.buf = a2;
    v6 = WSASend(a1, &Buffers, 1u, NumberOfBytesSent, 0, 0i64, 0i64);
    
    
```