import idaapi
import idc
import ida_dbg

# IDA 条件断点,py 脚本

# 获取 RDX 寄存器的值，这个寄存器在 WSASend 函数中指向 LPWSABUF 结构体
rdx_value = ida_dbg.get_reg_val("RDX")
print(f"RDX (LPWSABUF pointer): 0x{rdx_value:X}")

# 从 RDX 指向的内存位置读取 4 字节（32 位）数据，作为 LPWSABUF 结构体的第一个成员（数据长度）
data_len = idc.get_wide_dword(rdx_value)
print(f"Data length (from LPWSABUF): {data_len}")

# 从 RDX + 8 位置读取 8 字节（64 位）数据，作为 LPWSABUF 结构体的第二个成员（指向数据缓冲区的指针）
data_ptr = idc.get_qword(rdx_value + 8)
print(f"Data pointer (from LPWSABUF): 0x{data_ptr:X}")

# 从数据指针（data_ptr）开始，读取整个数据缓冲区的内容，长度为 data_len
# data = idc.get_bytes(data_ptr, data_len)
# 将读取到的数据转换为十六进制字符串并输出
# print(f"Data content (hex): {data.hex()}")

# 读取并输出数据缓冲区中偏移 0x4 位置的字节
byte_4 = idc.get_wide_byte(data_ptr + 0x4)
# print(f"Byte at 0x4: 0x{byte_4:X}")

if byte_4 == 0x6:
    byte_a = idc.get_wide_byte(data_ptr + 0xa)
    if byte_a == 0x3:
        byte_b = idc.get_wide_byte(data_ptr + 0xb)
        if byte_b == 0x76:
            return True

return False
