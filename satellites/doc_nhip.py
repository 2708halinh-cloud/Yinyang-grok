import json
import platform
import socket

print(
    json.dumps(
        {
            "ten": socket.gethostname(),
            "he": platform.system(),
            "phienBan": platform.version(),
            "nhan": None,
        },
        ensure_ascii=False,
    )
)
