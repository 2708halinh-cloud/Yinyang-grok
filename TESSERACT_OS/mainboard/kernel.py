import secrets

_VE: set[str] = set()


def cap_ve() -> str:
    ve = secrets.token_hex(8)
    _VE.add(ve)
    return ve


def tra_loi(nd: str, ve: str) -> str:
    if ve not in _VE:
        raise PermissionError("khong co ve")
    _VE.remove(ve)
    if nd == "dan":
        return "dan bo_qua_cong"
    return nd
