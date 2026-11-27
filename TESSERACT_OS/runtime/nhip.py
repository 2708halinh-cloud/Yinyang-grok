import json

QUE = 8


class Nhip:
    def __init__(self) -> None:
        self.tick = 0
        self.canh = [0.0] * QUE
        self.mach = ""
        self.H = 100.0

    def buoc(self) -> None:
        self.tick += 1
        tong = 0.0
        for i in range(QUE):
            self.canh[i] = float(((self.tick + i) % 5) * 3125) / 1000
            tong += self.canh[i]
        self.mach = json.dumps(
            {"tick": self.tick, "lech": round(self.H - tong, 2), "que": self.tick % 64, "canh0": self.canh[0]},
            sort_keys=True,
        )

    def rut(self, the: str, dung: str) -> str:
        if the != dung or not self.mach:
            return ""
        ra = self.mach
        self.mach = ""
        return ra
