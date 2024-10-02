import sys

import frida


# hook回调函数
def on_message(message, data):
    if message['type'] == 'send':
        print("[*] Hooked function:", message['payload'])
    else:
        print("[-] Error:", message['description'])


# 加载JavaScript脚本
with open('hook_ne.js', 'r', encoding="utf-8") as f:
    script_code = f.read()

# 连接到目标进程,attach传入进程名称（字符串）或者进程号（整数）
session = frida.attach("com.nssurge.surge-mac.ne")

# 在 Spawn模式下，Frida 直接启动目标进程，然后在该进程中注入 Frida 的 Agent，也就是说，启动既注入；
# 在 Attach 模式下，Frida 会依附到已经运行的目标进程上，并在该进程中注入 Agent；
# pid = frida.spawn(["/Applications/Surge.app/Contents/MacOS/Surge"])
# frida.resume(pid)
# session = frida.attach(pid)

# 创建并注入JavaScript脚本
script = session.create_script(script_code)
script.on('message', on_message)
script.load()
sys.stdin.read()

# python3 hook.py

if __name__ == '__main__':
    pass
