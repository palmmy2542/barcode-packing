import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { usePacking } from "../../contexts/PackingProvider";

enum PROUDCT_PACKED_STATUS {
  READY = "READY",
  PACKED = "PACKED",
}

const columns: GridColDef<(typeof rows)[number]>[] = [
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
      if (params.value === PROUDCT_PACKED_STATUS.READY) {
        return (
          <Chip
            label="ยังไม่จัดสินค้า"
            color="warning"
            sx={{ width: "100%" }}
          />
        );
      } else if (params.value === PROUDCT_PACKED_STATUS.PACKED) {
        return (
          <Chip label="จัดสินค้าแล้ว" color="success" sx={{ width: "100%" }} />
        );
      }
    },
  },
];

const Products = () => {
  const { products } = usePacking();
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default Products;
