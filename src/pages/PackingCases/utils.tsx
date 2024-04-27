import { Chip } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { PACKED_STATUS } from "../../contexts/PackingProvider/types";

export const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 200 },
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
            label="กล่องจัดสินค้าครบแล้ว"
            color="warning"
            sx={{ width: "100%" }}
          />
        );
      } else if (params.value === PACKED_STATUS.PACKED) {
        return (
          <Chip
            label="กล่องถูกนำส่งพาเลสแล้ว"
            color="success"
            sx={{ width: "100%" }}
          />
        );
      } else
        return (
          <Chip
            label="กล่องยังไม่ถูกจัดสินค้า"
            color="default"
            sx={{ width: "100%" }}
          />
        );
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
