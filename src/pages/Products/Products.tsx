import { Box, Button, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { usePacking } from "../../contexts/PackingProvider";
import { columns } from "./utils";
import { useState } from "react";
import { PACKED_STATUS, Product } from "../../contexts/PackingProvider/types";
import { addProduct } from "../../firebase";
import { toast } from "react-toastify";

const Products = () => {
  const { products, getAllProducts } = usePacking();
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    amount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: PACKED_STATUS.READY,
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.amount) {
      toast.error("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    try {
      const product = await addProduct(newProduct);
      if (product) {
        await getAllProducts();
        toast.success("เพิ่มสินค้าสำเร็จ");
        setNewProduct({
          name: "",
          amount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: PACKED_STATUS.READY,
        });
      } else {
        throw new Error("ไม่สามารถเพิ่มสินค้าได้");
      }
    } catch (err) {
      console.log(err);
      toast.error("ไม่สามารถเพิ่มสินค้าได้");
    }
  };

  return (
    <>
      <Typography variant="h5" textAlign={"left"}>
        สินค้าทั้งหมด
      </Typography>
      <Box display={"flex"} gap={2} my={2}>
        <TextField
          name="name"
          label="บาร์โค๊ด"
          onChange={(event) =>
            setNewProduct({ ...newProduct, name: event.target.value })
          }
          required
        />
        <TextField
          name="amount"
          label="จำนวนสินค้า"
          type="number"
          onChange={(event) =>
            setNewProduct({ ...newProduct, amount: Number(event.target.value) })
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
            sorting: {
              sortModel: [{ field: "updatedAt", sort: "desc" }],
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
