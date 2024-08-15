import sys
import time

import frida
import subprocess


# 加载JavaScript脚本
with open('hook.js', 'r', encoding="utf-8") as f:
    script_code = f.read()

# 连接到目标进程 , attach 传入进程名称（字符串）或者进程号（整数）
# subprocess.Popen(["cmd.exe", "/K", "C:\\workspace\\c\\oracle_oci_demo\\ocis\\instantclient_10_2\\sqlplus.exe user_dev/123456@127.0.0.1:1521/xe"], creationflags=subprocess.CREATE_NEW_CONSOLE)
# time.sleep(2)
session = frida.attach("sqlplus.exe")


# sqlplus 127.0.0.1:1521/xe
# sqlplus user_dev/123456@127.0.0.1:1521/xe1
# select * from all_users;
# pid = frida.spawn([r"C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\sqlplus.exe","user_dev/123456@127.0.0.1:1521/xe"], enable_debugger=True)
# pid = frida.spawn([r"C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\sqlplus.exe"])
# session = frida.attach(pid)

# 创建并注入JavaScript脚本
script = session.create_script(script_code)
script.load()

# # 注意resume的时机，如果需要一开始就hook，则放在创建脚本之后
# frida.resume(pid)
sys.stdin.read()

if __name__ == '__main__':
    pass

