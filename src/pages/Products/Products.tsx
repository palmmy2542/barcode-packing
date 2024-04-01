import { Box, Chip } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

enum PROUDCT_PACKED_STATUS {
  READY = "READY",
  PACKED = "PACKED",
}

const rows = [
  { id: 1, name: "Product 1", price: 100, status: PROUDCT_PACKED_STATUS.READY },
  { id: 2, name: "Product 2", price: 100, status: PROUDCT_PACKED_STATUS.READY },
  { id: 3, name: "Product 3", price: 100, status: PROUDCT_PACKED_STATUS.READY },
  {
    id: 4,
    name: "Product 4",
    price: 100,
    status: PROUDCT_PACKED_STATUS.PACKED,
  },
];

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
  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
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
