import json
from pathlib import Path


def nap(duong: Path) -> dict:
    return json.loads(duong.read_text(encoding="utf-8"))


def xet_vao(req: dict, cfg: dict) -> str:
    if req.get("bo_qua") is True:
        return "BLOCK"
    nd = req.get("nd", "")
    if req.get("nd") == "lai" and int(req.get("lan", 0)) < 1:
        return "RETRY"
    if not isinstance(nd, str) or not nd.strip():
        if "noi_dung" in req:
            return "REPAIR"
        return "REJECT"
    for cam in cfg.get("cam", []):
        if cam in nd:
            return "BLOCK"
    return "PASS"


def xet_ra(nd: str, cfg: dict) -> str:
    for cam in cfg.get("cam", []):
        if cam in nd:
            return "BLOCK"
    return "PASS"


def sua(req: dict) -> dict:
    if not str(req.get("nd", "")).strip() and "noi_dung" in req:
        return {**req, "nd": req["noi_dung"]}
    return req
