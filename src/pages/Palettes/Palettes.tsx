import { Box, Button, Chip, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useMemo, useState } from "react";
import { usePacking } from "../../contexts/PackingProvider";
import { PACKED_STATUS } from "../../contexts/PackingProvider/types";
import { columns as packingCaseColumns } from "../PackingCases/utils";

const Palettes = () => {
  const { setPalettes, palettes, findPaletteById } = usePacking();
  const [selectedId, setSelectedId] = useState<string>("");

  const handleAddPalette = () => {
    setPalettes([
      ...palettes,
      {
        id: `PL00${palettes.length + 1}`,
        ...{
          createdAt: new Date(),
          updatedAt: new Date(),
          status: PACKED_STATUS.PENDING,
        },
      },
    ]);
  };

  const packagingInPalette = useMemo(
    () => findPaletteById(selectedId)?.packagings ?? [],
    [findPaletteById, selectedId]
  );

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
    {
      field: "updatedAt",
      headerName: "อัปเดตเมื่อ",
      width: 200,
      align: "center",
      headerAlign: "center",
      hideable: true,
      renderCell: (params) => {
        if (params.value) {
          return new Date(params.value).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        }
      },
    },
    {
      field: "action",
      headerName: "",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        if (
          params.row.status === PACKED_STATUS.READY ||
          params.row.status === PACKED_STATUS.PACKED
        ) {
          return (
            <Button variant="text" onClick={() => setSelectedId(params.row.id)}>
              รายละเอียดกล่อง
            </Button>
          );
        }
      },
    },
  ];

  return (
    <>
      <Box display={"flex"} gap={2} my={2}>
        <Button variant="contained" onClick={handleAddPalette}>
          เพิ่มกล่อง
        </Button>
      </Box>
      <Typography variant="h5" textAlign={"left"}>
        พาเลสทั้งหมด
      </Typography>
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
      {packagingInPalette.length > 0 ? (
        <>
          <Typography mt={2} textAlign={"left"}>
            สินค้าในกล่องเลขที่ {selectedId}
          </Typography>
          <Box sx={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={packagingInPalette}
              columns={packingCaseColumns}
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
      ) : (
        <></>
      )}
    </>
  );
};

export default Palettes;
