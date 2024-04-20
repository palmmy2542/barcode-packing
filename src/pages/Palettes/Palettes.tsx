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
            label="พาเลสจัดกล่องครบแล้ว"
            color="warning"
            sx={{ width: "100%" }}
          />
        );
      } else if (params.value === PACKED_STATUS.PACKED) {
        return (
          <Chip
            label="พาเลสถูกนำส่งแล้ว"
            color="success"
            sx={{ width: "100%" }}
          />
        );
      } else
        return (
          <Chip
            label="พาเลสยังไม่ถูกจัดกล่อง"
            color="default"
            sx={{ width: "100%" }}
          />
        );
    },
  },
];

const Palettes = () => {
  const { palettes } = usePacking();
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={palettes}
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

export default Palettes;
