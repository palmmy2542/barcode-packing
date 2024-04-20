import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { usePacking } from "../../contexts/PackingProvider";
import { PACKED_STATUS } from "../../contexts/PackingProvider/types";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
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
];

const PackingCases = () => {
  const { packagings } = usePacking();
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={packagings}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default PackingCases;
