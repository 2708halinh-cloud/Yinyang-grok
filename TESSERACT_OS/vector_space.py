from fractions import Fraction


class Vec:
    def __init__(self, *xs: Fraction | int):
        self.x = tuple(Fraction(v) for v in xs)

    def __add__(self, khac: "Vec") -> "Vec":
        if len(self.x) != len(khac.x):
            raise ValueError("lech chieu")
        return Vec(*(a + b for a, b in zip(self.x, khac.x)))

    def nhan(self, a: Fraction | int) -> "Vec":
        he = Fraction(a)
        return Vec(*(he * v for v in self.x))

    def __eq__(self, khac: object) -> bool:
        return isinstance(khac, Vec) and self.x == khac.x


def khong(n: int) -> Vec:
    return Vec(*(0 for _ in range(n)))


def doi(v: Vec) -> Vec:
    return v.nhan(-1)


def nang(v: Vec, den: int) -> Vec:
    if den < len(v.x) or den > 6:
        raise ValueError("ngoai 0 den 6")
    return Vec(*(v.x + (Fraction(0),) * (den - len(v.x))))
