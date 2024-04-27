import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import { usePacking } from "../../contexts/PackingProvider";
import { PACKED_STATUS, Packaging } from "../../contexts/PackingProvider/types";

const renderStatusText = (status: PACKED_STATUS) => {
  switch (status) {
    case PACKED_STATUS.READY:
      return "กล่องจัดสินค้าครบแล้ว";
    case PACKED_STATUS.PACKED:
      return "กล่องถูกนำส่งพาเลสแล้ว";
    default:
      return "กล่องยังไม่ถูกจัดสินค้า";
  }
};

const renderStatusTextColor = (status: PACKED_STATUS) => {
  switch (status) {
    case PACKED_STATUS.READY:
      return "warning";
    case PACKED_STATUS.PACKED:
      return "primary";
    default:
      return "default";
  }
};

const ProductScanning = () => {
  const { id = "" } = useParams();
  const [open, setOpen] = useState(false);
  const form = useRef<HTMLFormElement>(null);
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

  const packedPackagingStatus = packedPackaging?.status as PACKED_STATUS;

  const disbled = packedPackagingStatus === PACKED_STATUS.READY;

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 200 },
      {
        field: "name",
        headerName: "บาร์โค๊ด",
        width: 150,
        editable: true,
      },
      {
        field: "amount",
        headerName: "จำนวนสินค้า",
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
      status: PACKED_STATUS.READY,
    } as Packaging);
    alert(`แพ็คกล่องเลขที่ ${id} เรียบร้อยแล้ว`);
    setOpen(false);
  };

  const onSubmit = (event: any) => {
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
    form.current?.reset();
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
      <Box textAlign={"right"}>
        <Chip
          label={renderStatusText(packedPackagingStatus)}
          color={renderStatusTextColor(packedPackagingStatus)}
        />
      </Box>

      <Box textAlign={"left"}>
        <Typography>กำลังแพ็คกล่องเลขที่ {id}</Typography>
        <form ref={form} onSubmit={onSubmit}>
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
            slots={{ toolbar: GridToolbar }}
            rows={packedPackaging?.products ?? []}
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
            disableMultipleRowSelection
          />
        </Box>
        <Box textAlign={"right"}>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            disabled={disbled}
          >
            ยืนยันการแพ็คกล่อง
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default ProductScanning;
