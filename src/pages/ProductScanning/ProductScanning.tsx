import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import { usePacking } from "../../contexts/PackingProvider";
import { PACKED_STATUS, Packaging } from "../../contexts/PackingProvider/types";

const Products = () => {
  const { id = "" } = useParams();
  const [open, setOpen] = useState(false);
  const {
    findProductById,
    findPackagingById,
    addProductInPackaging,
    removeProductInPackagingByProductId,
    setPackagingById,
  } = usePacking();

  const packedPackaging = useMemo(() => {
    if (!id) return null;
    const packaging = findPackagingById(id);

    return packaging;
  }, [findPackagingById, id]);

  const disbled = packedPackaging?.status === PACKED_STATUS.PACKED;

  const columns: GridColDef[] = useMemo(
    () => [
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
              <Chip
                label="จัดสินค้าแล้ว"
                color="success"
                sx={{ width: "100%" }}
              />
            );
          }
        },
      },
      {
        field: "action",
        headerName: "action",
        width: 150,
        editable: true,
        renderCell: (params) => {
          if (params.row.status === PACKED_STATUS.PACKED) {
            return (
              <IconButton
                onClick={() => {
                  removeProductInPackagingByProductId(id, params.row.id);
                }}
                disabled={disbled}
                color="error"
              >
                <DeleteOutline />
              </IconButton>
            );
          }
        },
      },
    ],
    [disbled, id, removeProductInPackagingByProductId]
  );

  const handlePacked = () => {
    setPackagingById(id, {
      ...findPackagingById(id),
      status: PACKED_STATUS.PACKED,
    } as Packaging);
    alert(`แพ็คกล่องเลขที่ ${id} เรียบร้อยแล้ว`);
    setOpen(false);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const productId = event.target?.id.value;

    if (productId) {
      const product = findProductById(productId);
      if (product) {
        if (product.status === PACKED_STATUS.PACKED) {
          alert(`สินค้าเลขที่ ${product.id} ได้ถูกจัดสินค้าแล้ว`);
        } else {
          addProductInPackaging(id, product);
        }
      } else alert(`ไม่พบรหัสสินค้าเลขที่ ${productId}`);
    }
    event.target.id.value = null;
  };

  return (
    <>
      <Dialog
        open={open}
        content="เมื่อยืนยันแล้ว ไม่สามารถยกเลิกได้"
        title="ยืนยันการจัดสินค้า ?"
        handleClose={() => setOpen(false)}
        handleSubmit={handlePacked}
      />
      <Box textAlign={"left"}>
        <Typography>กำลังแพ็คกล่องเลขที่ {id}</Typography>
        <form onSubmit={onSubmit}>
          <Box display={"flex"} gap={2}>
            <TextField
              name="id"
              fullWidth
              placeholder={`ระบุรหัสสินค้าที่ต้องการแพ็คลงกล่องเลขที่ ${id}`}
              disabled={disbled}
            />
            <Button variant="contained" type="submit">
              ค้นหา
            </Button>
          </Box>
        </form>
        <Typography mt={2}>สินค้าทั้งหมดในกล่อง</Typography>
        <Box sx={{ height: 400, width: "100%" }} mb={2}>
          <DataGrid
            rows={packedPackaging?.products ?? []}
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
            disableMultipleRowSelection
          />
        </Box>
        <Box textAlign={"right"}>
          <Button variant="contained" onClick={() => setOpen(true)}>
            ยืนยันการแพ็คกล่อง
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Products;
