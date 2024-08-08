```

## 跟踪模式
# frida-trace -i 'LoadLibraryA' -f "C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\sqlplus.exe"

## 附加脚本
# frida -f "C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\sqlplus.exe"  -l hook.js

```

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
      
OraOCIEI10.dll:0000000002B63B5C oraociei10_OCIServerAttach:
OraOCIEI10.dll:0000000002B63B5C                 push    r15
OraOCIEI10.dll:0000000002B63B5E                 push    r14
OraOCIEI10.dll:0000000002B63B60                 push    r13
```