import { GridColDef } from "@mui/x-data-grid";
import { PACKED_STATUS } from "../../contexts/PackingProvider/types";
import { Chip } from "@mui/material";

export const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "บาร์โค๊ด",
    width: 150,
    editable: true,
  },
  {
    field: "amount",
    headerName: "จำนวนสินค้า",
    width: 150,
    editable: true,
  },
  {
    field: "status",
    headerName: "สถานะ",
    width: 200,
    align: "center",
    headerAlign: "center",
    hideable: true,
    renderCell: (params) => {
      if (params.value === PACKED_STATUS.READY) {
        return (
          <Chip
            label="ยังไม่จัดสินค้าลงกล่อง"
            color="default"
            sx={{ width: "100%" }}
          />
        );
      } else if (params.value === PACKED_STATUS.PACKED) {
        return (
          <Chip label="จัดสินค้าแล้ว" color="success" sx={{ width: "100%" }} />
        );
      }
    },
  },
  {
    field: "updatedAt",
    headerName: "อัปเดตเมื่อ",
    width: 200,
    align: "center",
    headerAlign: "center",
    hideable: true,
    renderCell: (params) => {
      if (params.value) {
        return new Date(params.value).toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    },
  },
];
