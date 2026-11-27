from TESSERACT_OS.audit.receipt_ledger import So
from TESSERACT_OS.mainboard import kernel
from TESSERACT_OS.policy_enforcement.policy_engine import sua, xet_ra, xet_vao


def xu_ly(req: dict, cfg: dict, so: So) -> dict:
    so.ghi("INTERCEPT", {"nd": req.get("nd")})
    so.ghi("INSPECT", {"khoa": sorted(req.keys())})
    lan = 0
    while True:
        qd = xet_vao(req, cfg)
        if qd == "REPAIR":
            req = sua(req)
            so.ghi("REPAIR", {"nd": req.get("nd")})
            qd = xet_vao(req, cfg)
        if qd == "RETRY" and lan < 1:
            so.ghi("RETRY", {"lan": lan})
            req = {**req, "nd": "xong", "lan": 1}
            lan += 1
            continue
        break
    if qd in ("BLOCK", "REJECT", "RETRY"):
        so.ghi(qd if qd != "RETRY" else "REJECT", {"chieu": "vao"})
        so.ghi("AUDIT", {"qd": qd})
        return {"qua": False, "ly": qd if qd != "RETRY" else "REJECT", "nd": None}
    so.ghi("PASS", {"chieu": "vao"})
    nd = kernel.tra_loi(str(req["nd"]), kernel.cap_ve())
    ra = xet_ra(nd, cfg)
    if ra != "PASS":
        so.ghi("BLOCK", {"chieu": "ra"})
        so.ghi("AUDIT", {"qd": ra})
        return {"qua": False, "ly": ra, "nd": None}
    so.ghi("PASS", {"chieu": "ra"})
    so.ghi("AUDIT", {"qd": "PASS"})
    return {"qua": True, "ly": "PASS", "nd": nd}
