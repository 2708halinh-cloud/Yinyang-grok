from TESSERACT_OS.audit.receipt_ledger import So
from TESSERACT_OS.runtime_gateway.gateway import xu_ly


def nhan(ten: str, req: dict, cfg: dict, so: So) -> dict:
    goi = {**req, "cau": ten}
    if ten not in ("hoi_thoai", "local"):
        goi["bo_qua"] = True
    return xu_ly(goi, cfg, so)
