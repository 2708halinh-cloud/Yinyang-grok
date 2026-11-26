import hashlib
import json
import platform
import socket
import sys
import winreg
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(r"G:\OS_Workspace")
LOG = ROOT / "starmap" / "bien_nhan.jsonl"
CHO = (ROOT, Path(r"C:\Users\2708h"))


def bios():
    khoa = winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"HARDWARE\DESCRIPTION\System\BIOS")

    def lay(ten):
        gia, _ = winreg.QueryValueEx(khoa, ten)
        return gia if isinstance(gia, str) else str(gia)

    return {
        "hang": lay("SystemManufacturer"),
        "mach": lay("SystemProductName"),
        "ho": lay("SystemFamily"),
        "bios": lay("BIOSVendor") + " " + lay("BIOSVersion"),
        "nhan": None,
    }


def duong(p):
    path = Path(p)
    if not any(path.is_relative_to(goc) for goc in CHO):
        return {"qua": False, "ly": "Ngoai hai goc"}
    return {"qua": True, "co": path.exists()}


def main():
    lenh = sys.argv[1] if len(sys.argv) > 1 else ""
    if lenh == "bios":
        ket = bios()
    elif lenh == "ten":
        ket = {"ten": socket.gethostname(), "he": platform.system(), "nhan": None}
    elif lenh == "duong" and len(sys.argv) > 2:
        ket = duong(sys.argv[2])
    else:
        ket = {"qua": False, "ly": "lenh la bios, ten, hoac duong"}
    chu = json.dumps(ket, ensure_ascii=False, sort_keys=True)
    dong = {
        "lenh": " ".join(sys.argv[1:]),
        "file": str(LOG),
        "hash": hashlib.sha256(chu.encode()).hexdigest(),
        "gio": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "ket": ket,
    }
    LOG.parent.mkdir(parents=True, exist_ok=True)
    with LOG.open("a", encoding="utf-8") as tep:
        tep.write(json.dumps(dong, ensure_ascii=False) + "\n")
    print(json.dumps(dong, ensure_ascii=False))


if __name__ == "__main__":
    main()
