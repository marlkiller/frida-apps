import sys
import frida


# 加载JavaScript脚本
with open('hook.js', 'r', encoding="utf-8") as f:
    script_code = f.read()

# 连接到目标进程 , attach 传入进程名称（字符串）或者进程号（整数）
# session = frida.attach("sqlplus.exe")


# sqlplus 127.0.0.1:1521/xe
# sqlplus user_dev/123456@127.0.0.1:1521/xe
# select * from all_users;
pid = frida.spawn([r"C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\sqlplus.exe","user_dev/123456@127.0.0.1:1521/xe"])
# pid = frida.spawn([r"C:\workspace\c\oracle_oci_demo\ocis\instantclient_10_2\sqlplus.exe"])
frida.resume(pid)
session = frida.attach(pid)

# 创建并注入JavaScript脚本
script = session.create_script(script_code)
script.load()
sys.stdin.read()


if __name__ == '__main__':
    pass
