import idaapi
import struct
from pathlib import Path
from typing import *


def parse_uint64(data: bytes, start: int) -> Tuple[int, int]:
    end = start + 8
    n = struct.unpack("<Q", data[start:end])[0]
    return n, end


def parse_string(data: bytes, start: int) -> Tuple[str, int]:
    end = data.find(b"\x00", start)
    s = data[start:end].decode("utf-8")
    return s, end


def main():
    sym_path = idaapi.ask_str("", idaapi.HIST_FILE, "input sym path")
    if len(sym_path) == 0:
        return

    sym_path = Path(sym_path)
    print(f"[*] loading sym file \"{sym_path}\"")

    sym_data = sym_path.read_bytes()
    print(f"[*] sym file bytes {len(sym_data)}")

    p = 0

    magic, p = parse_uint64(sym_data, p)
    assert magic == 0x34364D414D59534F

    num_items, p = parse_uint64(sym_data, p)
    print(f"[*] sym file items {num_items}")

    p += 8  # skip the length of 8 bytes

    addr_table = []
    sym_base = 0
    for i in range(num_items):
        addr, p = parse_uint64(sym_data, p)
        addr_table.append(addr)
        sym_base = addr if sym_base == 0 else sym_base

    base_offset = idaapi.get_imagebase() - sym_base

    idx_table = []
    for i in range(num_items):
        idx, p = parse_uint64(sym_data, p)
        idx_table.append(idx)

    str_table = sym_data[p:]

    for i in range(num_items):
        addr = addr_table[i]
        name = parse_string(str_table, idx_table[i])[0]
        idaapi.force_name(addr + base_offset, name)

    print(f"[*] sym file loaded successfully")


if __name__ == "__main__":
    main()
