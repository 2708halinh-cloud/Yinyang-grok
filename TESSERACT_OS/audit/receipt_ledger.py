import hashlib
import json
from pathlib import Path


class So:
    def __init__(self) -> None:
        self.dong: list[dict[str, str]] = []

    def ghi(self, hanh: str, viec: object) -> None:
        chu = json.dumps({"hanh": hanh, "viec": viec}, ensure_ascii=False, sort_keys=True)
        self.dong.append({"hanh": hanh, "hash": hashlib.sha256(chu.encode()).hexdigest()})

    def luu(self, duong: Path) -> None:
        duong.write_text(json.dumps(self.dong), encoding="utf-8")

    @classmethod
    def nap(cls, duong: Path) -> "So":
        so = cls()
        so.dong = json.loads(duong.read_text(encoding="utf-8"))
        return so
