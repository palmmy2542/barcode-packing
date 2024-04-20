import { Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { usePacking } from "../../contexts/PackingProvider";
import { columns } from "./utils";
import { useState } from "react";
import { PACKED_STATUS, Product } from "../../contexts/PackingProvider/types";

const Products = () => {
  const { products, setProducts } = usePacking();
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    price: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: PACKED_STATUS.READY,
  });

  const handleAddProduct = () => {
    setProducts([
      ...products,
      { id: `P00${products.length + 1}`, ...newProduct },
    ]);
  };
  return (
    <>
      <Typography variant="h5" textAlign={"left"}>
        สินค้าทั้งหมด
      </Typography>
      <Box display={"flex"} gap={2} my={2}>
        <TextField
          name="name"
          label="ชื่อสินค้า"
          onChange={(event) =>
            setNewProduct({ ...newProduct, name: event.target.value })
          }
          required
        />
        <TextField
          name="price"
          label="ราคาสินค้า"
          type="number"
          onChange={(event) =>
            setNewProduct({ ...newProduct, price: event.target.value })
          }
          required
        />
        <Button variant="contained" onClick={handleAddProduct}>
          เพิ่มสินค้า
        </Button>
      </Box>
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
