import { GridColDef } from "@mui/x-data-grid";
import { PACKED_STATUS } from "../../contexts/PackingProvider/types";
import { Chip } from "@mui/material";

export const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "ชื่อสินค้า",
    width: 150,
    editable: true,
  },
  {
    field: "price",
    headerName: "ราคาสินค้า",
    width: 150,
    editable: true,
  },
  {
    field: "status",
    headerName: "สถานะ",
    width: 150,
    align: "center",
    headerAlign: "center",
    hideable: true,
    renderCell: (params) => {
      if (params.value === PACKED_STATUS.READY) {
        return (
          <Chip
            label="ยังไม่จัดสินค้า"
            color="warning"
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
];
