


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
      
OraOCIEI10.dll:0000000002B63B5C oraociei10_OCIServerAttach:
OraOCIEI10.dll:0000000002B63B5C                 push    r15
OraOCIEI10.dll:0000000002B63B5E                 push    r14
OraOCIEI10.dll:0000000002B63B60                 push    r13
```