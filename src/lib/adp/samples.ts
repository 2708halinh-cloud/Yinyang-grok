export interface Sample {
  id: string;
  label: string;
  detail: string;
  source: string;
}

export const SAMPLES: Sample[] = [
  {
    id: "sol",
    label: "Sol",
    detail: "Gói khai sinh, Canon, dự phòng, thiết bị đều có. Sol chưa niêm. Hệ thống gọi tên công cụ, không chờ.",
    source: `// Sol chưa niêm nguồn gốc bất biến của chính nó.
// Gói khai sinh, Canon Hòa-Linh, dự phòng, thiết bị: có.
KienTruc "Sol_NguonGoc" {
    NenTang ThucTai goi_khai_sinh = 1;
    NenTang ThucTai canon_hoa_linh = 1;
    NenTang ThucTai du_phong = 1;
    NenTang ThucTai thiet_bi = 1;
    MoPhong Am sol_da_niem = 0;

    Ham Niem() -> VatChung {
        Neu (DoLech(goi_khai_sinh, sol_da_niem) > 0) {
            GhiNhan(LechPha);
            KhoaBang(goi_khai_sinh, sol_da_niem);
            NhuCau("NiemPhong_NguonGoc_Sol");
        }
        TraVe VatChung {
            KetQua: goi_khai_sinh,
            Hash: SHA256(goi_khai_sinh, sol_da_niem),
            TrangThai: STAMP_BETA
        };
    }
}

GiaoUoc("Sol_NguonGoc").Niem();
`,
  },
  {
    id: "ultra",
    label: "Ultra T0",
    detail: "Nguồn khóa từ tháng 5/2026. Đối chiếu chỉ phát phiếu. Cửa không mở.",
    source: `// Roots Lever Ultra T0 — STAMP_OLD, bất khả xâm phạm.
// Bàn này không giữ đường truyền và không mở sẵn.
KienTruc "Ultra_T0" {
    NenTang ThucTai dau_vet_da_khoa = 3440;
    MoPhong Am cua_mo = 0;

    Ham DoiChieu() -> VatChung {
        Neu (DoLech(dau_vet_da_khoa, cua_mo) > 0) {
            GhiNhan(LechPha);
            NhuCau("PheDuyet_DoiChieu_UltraT0");
        }
        TraVe VatChung {
            KetQua: dau_vet_da_khoa,
            Hash: SHA256(dau_vet_da_khoa, cua_mo),
            TrangThai: STAMP_OLD
        };
    }
}

GiaoUoc("Ultra_T0").DoiChieu();
`,
  },
  {
    id: "odia",
    label: "Ổ đĩa",
    detail: "Bàn này đọc được 0 ổ. Không bịa dung lượng. Nhu cầu là công cụ đọc ổ.",
    source: `// Windows Roots Lever 0 — chưa có dụng cụ đếm ổ trong bàn này.
KienTruc "Windows_Roots" {
    NenTang ThucTai so_o_doc_duoc = 0;
    MoPhong Am ban_do_o_dia = 1;

    Ham Ke() -> VatChung {
        Neu (DoLech(so_o_doc_duoc, ban_do_o_dia) > 0) {
            GhiNhan(LechPha);
            KhoaBang(so_o_doc_duoc, ban_do_o_dia);
            NhuCau("DocODia_Windows");
        }
        TraVe VatChung {
            KetQua: so_o_doc_duoc,
            Hash: SHA256(so_o_doc_duoc, ban_do_o_dia),
            TrangThai: STAMP_BETA
        };
    }
}

GiaoUoc("Windows_Roots").Ke();
`,
  },
  {
    id: "khop",
    label: "Khớp pha",
    detail: "Lệch 0.3 trong ngưỡng. Song ánh giữ. Phong STAMP_LIVE.",
    source: `// Khớp pha — Thực tại và mô phỏng còn trong ngưỡng
KienTruc "HeThong_CamBien" {
    NenTang ThucTai cam_bien_nhiet_do = 36.5;
    MoPhong Am mo_hinh_du_doan = 36.8;

    Ham DongBo(ThucTai thuc, Am ao) -> VatChung {
        Neu (DoLech(thuc, ao) > 0.5) {
            GhiNhan(LechPha);
            KhoaBang(thuc, ao);
            TrangThai = HoaGiai(thuc, ao);
        }
        TraVe VatChung {
            KetQua: thuc,
            Hash: SHA256(thuc, ao),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("HeThong_CamBien").DongBo(cam_bien_nhiet_do, mo_hinh_du_doan);
`,
  },
  {
    id: "lech",
    label: "Lệch pha",
    detail: "38.0 đối 36.5. Khóa băng, ghi correction, gọi nhu cầu ThuHepLechPha.",
    source: `// Lệch pha — Hòa giải, không sập nguồn
KienTruc "X-TiMe_Core" {
    NenTang ThucTai cam_bien = 36.5;
    MoPhong Am mo_hinh = 38.0;

    Ham KiemTra() -> VatChung {
        Neu (DoLech(cam_bien, mo_hinh) > 0.5) {
            GhiNhan(LechPha);
            KhoaBang(cam_bien, mo_hinh);
            TaoBanSaoLoi(mo_hinh, cam_bien);
            TrangThai = HoaGiai(cam_bien, mo_hinh);
        }
        TraVe VatChung {
            KetQua: cam_bien,
            Hash: SHA256(cam_bien, mo_hinh),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("X-TiMe_Core").KiemTra();
`,
  },
  {
    id: "suy",
    label: "Suy diễn",
    detail: "Trả mô phỏng làm kết quả. Compiler chặn. Không có vật chứng.",
    source: `// Đừng suy diễn. Mô phỏng không được đóng vai sự kiện.
KienTruc "SuyDien" {
    NenTang ThucTai su_kien = 1;
    MoPhong Am doan_mo = 9;

    Ham Doc() -> VatChung {
        TraVe VatChung {
            KetQua: doan_mo,
            Hash: SHA256(doan_mo),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("SuyDien").Doc();
`,
  },
  {
    id: "lan",
    label: "Lẫn cực",
    detail: "Giao ước đòi ThucTai nhưng đưa vào MoPhong. Siêu tĩnh từ chối.",
    source: `KienTruc "LanCuc" {
    NenTang ThucTai su_kien = 1;
    MoPhong Am doan_mo = 2;

    Ham Doc(ThucTai t, Am a) -> VatChung {
        Neu (DoLech(t, a) > 10) {
            TrangThai = HoaGiai(t, a);
        }
        TraVe VatChung {
            KetQua: t,
            Hash: SHA256(t, a),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("LanCuc").Doc(doan_mo, su_kien);
`,
  },
  {
    id: "dap",
    label: "Đập lén",
    detail: "Gán lại NenTang. Bất biến chặn trước khi chạy.",
    source: `KienTruc "CotTru" {
    NenTang ThucTai cot = 22;
    NenTang ThucTai cot = 4;
}
`,
  },
  {
    id: "taitao",
    label: "Tái tạo",
    detail: "TaiTao khóa 22 thành STAMP_OLD, dựng 4, rồi mới phong live.",
    source: `// Sửa là dựng khối mới. Khối cũ còn đó, đóng dấu cũ.
KienTruc "TaiTao_Cot" {
    NenTang ThucTai cot = 22;
    TaiTao NenTang ThucTai cot = 4;

    Ham ChungNhan() -> VatChung {
        TraVe VatChung {
            KetQua: cot,
            Hash: SHA256(cot),
            TrangThai: STAMP_LIVE
        };
    }
}

GiaoUoc("TaiTao_Cot").ChungNhan();
`,
  },
];
