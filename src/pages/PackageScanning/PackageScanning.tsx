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
import { useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Dialog from "../../components/Dialog";
import { usePacking } from "../../contexts/PackingProvider";
import { PACKED_STATUS, Palette } from "../../contexts/PackingProvider/types";

const renderStatusText = (status: PACKED_STATUS) => {
  switch (status) {
    case PACKED_STATUS.READY:
      return "พาเลสจัดกล่องครบแล้ว";
    case PACKED_STATUS.PACKED:
      return "พาเลสถูกนำส่งแล้ว";
    default:
      return "พาเลสยังไม่ถูกจัดกล่อง";
  }
};

const renderStatusTextColor = (status: PACKED_STATUS) => {
  switch (status) {
    case PACKED_STATUS.READY:
      return "warning";
    case PACKED_STATUS.PACKED:
      return "success";
    default:
      return "default";
  }
};

const PackageScanning = () => {
  const { id = "" } = useParams();
  const [open, setOpen] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const {
    findPackagingById,
    findPaletteById,
    addPackagingInPalette,
    removePackagingInPaletteByPackagingId,
    setPaletteById,
  } = usePacking();

  const packedPalette = useMemo(() => {
    if (!id) return null;
    const packaging = findPaletteById(id.toUpperCase());

    return packaging;
  }, [findPaletteById, id]);

  const packedPaletteStatus = packedPalette?.status as PACKED_STATUS;

  const disbled = packedPaletteStatus === PACKED_STATUS.READY;

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 200 },
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
                label="ยังไม่จัดกล่อง"
                color="warning"
                sx={{ width: "100%" }}
              />
            );
          } else if (params.value === PACKED_STATUS.PACKED) {
            return (
              <Chip
                label="จัดกล่องแล้ว"
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
                  removePackagingInPaletteByPackagingId(id, params.row.id);
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
    [disbled, id, removePackagingInPaletteByPackagingId]
  );

  const handlePacked = () => {
    setPaletteById(id, {
      ...findPaletteById(id),
      status: PACKED_STATUS.PACKED,
    } as Palette);
    alert(`แพ็คพาเลสเลขที่ ${id} เรียบร้อยแล้ว`);
    setOpen(false);
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    const packagingId = event.target?.id.value;

    if (packagingId) {
      const packaging = findPackagingById(packagingId.toUpperCase());
      if (packaging) {
        if (packaging.status === PACKED_STATUS.PENDING) {
          alert(`กล่องเลขที่ ${packaging.id} ยังไม่ถูกจัดสินค้า`);
        } else if (packaging.status === PACKED_STATUS.PACKED) {
          alert(`กล่องเลขที่ ${packaging.id} ได้ถูกจัดกล่องแล้ว`);
        } else {
          addPackagingInPalette(id, packaging);
        }
      } else alert(`ไม่พบรหัสกล่องเลขที่ ${packagingId}`);
    }
    form.current?.reset();
  };

  return (
    <>
      <Dialog
        open={open}
        content="เมื่อยืนยันแล้ว ไม่สามารถยกเลิกได้"
        title="ยืนยันการจัดพาเลส ?"
        handleClose={() => setOpen(false)}
        handleSubmit={handlePacked}
      />
      <Box textAlign={"right"}>
        <Chip
          label={renderStatusText(packedPaletteStatus)}
          color={renderStatusTextColor(packedPaletteStatus)}
        />
      </Box>

      <Box textAlign={"left"}>
        <Typography>กำลังแพ็คพาเลสเลขที่ {id}</Typography>
        <form ref={form} id="myForm" onSubmit={onSubmit}>
          <Box display={"flex"} gap={2}>
            <TextField
              name="id"
              fullWidth
              placeholder={`ระบุรหัสกล่องที่ต้องการแพ็คลงพาเลสเลขที่ ${id}`}
              disabled={disbled}
            />
            <Button variant="contained" type="submit">
              ค้นหา
            </Button>
          </Box>
        </form>
        <Typography mt={2}>กล่องทั้งหมดในพาเลส</Typography>
        <Box sx={{ height: 400, width: "100%" }} mb={2}>
          <DataGrid
            rows={packedPalette?.packagings ?? []}
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
            ยืนยันการแพ็คพาเลส
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default PackageScanning;
