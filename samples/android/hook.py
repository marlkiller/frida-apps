import sys

import frida


# hook回调函数
def on_message(message, data):
    if message['type'] == 'send':
        print("[*] Hooked function:", message['payload'])
    else:
        print("[-] Error:", message['description'])


# 加载JavaScript脚本
with open('method.js', 'r', encoding="utf-8") as f:
    script_code = f.read()

# 连接到目标进程,attach传入进程名称（字符串）或者进程号（整数）
session = frida.attach(25628)


script = session.create_script(script_code)
script.on('message', on_message)
script.load()
sys.stdin.read()

# python3 hook.py

if __name__ == '__main__':
    pass
