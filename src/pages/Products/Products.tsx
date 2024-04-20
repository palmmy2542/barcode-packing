import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { usePacking } from "../../contexts/PackingProvider";
import { columns } from "./utils";

const Products = () => {
  const { products } = usePacking();
  return (
    <>
      <Typography variant="h5" textAlign={"left"}>
        สินค้าทั้งหมด
      </Typography>
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
          disableRowSelectionOnClick
        />
      </Box>
    </>
  );
};

export default Products;
