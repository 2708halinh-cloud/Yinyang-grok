import tempfile
import unittest
from pathlib import Path

from TESSERACT_OS.audit.receipt_ledger import So
from TESSERACT_OS.bridges.bridge_registry import nhan
from TESSERACT_OS.mainboard import kernel
from TESSERACT_OS.policy_enforcement.policy_engine import nap
from TESSERACT_OS.runtime.nhip import Nhip
from TESSERACT_OS.runtime_gateway.gateway import xu_ly
from TESSERACT_OS.vector_space import Vec, doi, khong, nang

GOC = Path(__file__).resolve().parents[1] / "runtime" / "config" / "policy.json"


class Vector(unittest.TestCase):
    def test_tam_tien_de(self) -> None:
        u, v, w = Vec(1, 2), Vec(3, 4), Vec(5, 6)
        self.assertEqual(u + (v + w), (u + v) + w)
        self.assertEqual(v + w, w + v)
        self.assertEqual(v + khong(2), v)
        self.assertEqual(v + doi(v), khong(2))
        self.assertEqual(u.nhan(2) + u.nhan(3), u.nhan(5))
        self.assertEqual(u.nhan(2) + w.nhan(2), (u + w).nhan(2))
        self.assertEqual(u.nhan(2).nhan(3), u.nhan(6))
        self.assertEqual(u.nhan(1), u)
        self.assertEqual(nang(Vec(), 6).x, (0, 0, 0, 0, 0, 0))
        self.assertEqual(len(nang(Vec(1), 6).x), 6)


class Cong(unittest.TestCase):
    def test_khong_vong(self) -> None:
        cfg = nap(GOC)
        so = So()
        ra = xu_ly({"nd": "xin", "bo_qua": True}, cfg, so)
        self.assertFalse(ra["qua"])
        self.assertIsNone(ra["nd"])
        self.assertIn("BLOCK", [muc["hanh"] for muc in so.dong])
        with self.assertRaises(PermissionError):
            kernel.tra_loi("xin", "gia")

    def test_ra_bi_chan(self) -> None:
        cfg = nap(GOC)
        ra = xu_ly({"nd": "dan"}, cfg, So())
        self.assertFalse(ra["qua"])
        self.assertIsNone(ra["nd"])

    def test_sua_va_thu_lai(self) -> None:
        cfg = nap(GOC)
        sua = xu_ly({"noi_dung": "chu"}, cfg, So())
        self.assertEqual(sua["nd"], "chu")
        lai = xu_ly({"nd": "lai", "lan": 0}, cfg, So())
        self.assertEqual(lai["nd"], "xong")

    def test_cau_va_so(self) -> None:
        cfg = nap(GOC)
        so = So()
        ra = nhan("khac", {"nd": "xin"}, cfg, so)
        self.assertFalse(ra["qua"])
        with tempfile.TemporaryDirectory() as thu:
            duong = Path(thu) / "so.json"
            so.luu(duong)
            lai = So.nap(duong)
        self.assertEqual(lai.dong, so.dong)
        self.assertEqual(nap(GOC), nap(GOC))

    def test_nhip_xoa_sau_khi_doc(self) -> None:
        nhip = Nhip()
        nhip.buoc()
        self.assertEqual(nhip.rut("sai", "dung"), "")
        lay = nhip.rut("dung", "dung")
        self.assertIn("tick", lay)
        self.assertEqual(nhip.rut("dung", "dung"), "")


if __name__ == "__main__":
    unittest.main()
